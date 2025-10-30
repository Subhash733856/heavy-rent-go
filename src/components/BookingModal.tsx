import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Equipment, bookingAPI } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const bookingFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters"),
  phone: z.string()
    .regex(/^\+91[6-9]\d{9}$/, "Invalid Indian phone number format (+91XXXXXXXXXX)"),
  location: z.string()
    .trim()
    .min(10, "Please provide complete address")
    .max(500, "Address too long"),
  requirements: z.string()
    .max(2000, "Requirements must be less than 2000 characters")
    .optional()
});

// Support both old and new props for backward compatibility
interface BookingModalPropsNew {
  equipment: Equipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: never;
}

interface BookingModalPropsOld {
  equipment: any; // Old mock equipment type
  trigger: React.ReactNode;
  open?: never;
  onOpenChange?: never;
}

type BookingModalProps = BookingModalPropsNew | BookingModalPropsOld;

const BookingModal = (props: BookingModalProps) => {
  const { equipment } = props;
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: "",
    phone: "+91",
    location: "",
    requirements: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [internalOpen, setInternalOpen] = useState(false);

  // Determine if we're using controlled or uncontrolled mode
  const isControlled = 'open' in props && props.open !== undefined;
  const open = isControlled ? props.open! : internalOpen;
  const setOpen = isControlled ? props.onOpenChange! : setInternalOpen;

  useEffect(() => {
    if (!open) {
      setFormData({ name: "", phone: "+91", location: "", requirements: "" });
      setStartDate(undefined);
      setEndDate(undefined);
      setErrors({});
    }
  }, [open]);

  const validateForm = () => {
    try {
      bookingFormSchema.parse(formData);
      setErrors({});
      
      if (!startDate || !endDate) {
        setErrors({ dates: "Please select both start and end dates" });
        return false;
      }
      
      if (endDate <= startDate) {
        setErrors({ dates: "End date must be after start date" });
        return false;
      }

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    if (!equipment) {
      toast({
        title: "Error",
        description: "Equipment not found",
        variant: "destructive",
      });
      return;
    }

    // Check if using mock data (old EquipmentListing)
    const isMockData = typeof equipment.id === 'number';
    
    if (isMockData) {
      // For mock data, just show success message
      toast({
        title: "Booking Request Received",
        description: "This is a demo. In production, connect to the backend to complete bookings.",
      });
      setOpen(false);
      return;
    }

    // Real Supabase booking flow
    if (!user || !startDate || !endDate) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a booking",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const durationHours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));

      const result = await bookingAPI.createBooking({
        equipmentId: equipment.id as string,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        durationHours,
        clientName: formData.name,
        clientPhone: formData.phone,
        pickupAddress: equipment.location || '',
        deliveryAddress: formData.location,
        specialRequirements: formData.requirements || undefined
      });

      if (result.success && result.booking) {
        // Initiate payment flow
        try {
          // Get the session token properly
          const { supabase } = await import('@/integrations/supabase/client');
          const { data: { session } } = await supabase.auth.getSession();
          const token = session?.access_token;

          if (!token) {
            throw new Error('No authentication token found');
          }

          const paymentResult = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-razorpay-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              bookingId: result.booking.id,
              amount: result.booking.advance_amount,
              currency: 'INR'
            })
          });

          if (!paymentResult.ok) {
            throw new Error('Failed to create payment order');
          }

          const paymentData = await paymentResult.json();
          
          // Load Razorpay
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          document.body.appendChild(script);

          script.onload = () => {
            const options = {
              key: paymentData.razorpay_key_id,
              amount: paymentData.order.amount,
              currency: paymentData.order.currency,
              name: 'Equipment Rental',
              description: `Booking for ${equipment.name}`,
              order_id: paymentData.order.id,
              handler: async function(response: any) {
                // Verify payment
                try {
                  const verifyResult = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_signature: response.razorpay_signature,
                      booking_id: result.booking.id
                    })
                  });

                  if (verifyResult.ok) {
                    toast({
                      title: "Payment Successful!",
                      description: "Your booking is confirmed. You will receive a confirmation shortly.",
                    });
                    setOpen(false);
                    // Reload page to show updated bookings
                    setTimeout(() => window.location.reload(), 1500);
                  } else {
                    throw new Error('Payment verification failed');
                  }
                } catch (error) {
                  toast({
                    title: "Payment Verification Failed",
                    description: "Please contact support with your booking ID",
                    variant: "destructive",
                  });
                }
              },
              prefill: {
                name: formData.name,
                contact: formData.phone,
              },
              theme: {
                color: '#3399cc'
              }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          };
        } catch (paymentError) {
          console.error('Payment initialization error:', paymentError);
          toast({
            title: "Booking Created",
            description: "Booking created but payment failed to initialize. Please contact support.",
            variant: "destructive",
          });
          setOpen(false);
        }
      } else {
        throw new Error(result.error || "Failed to create booking");
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      
      let errorMessage = "Failed to submit booking. Please try again.";
      if (error.message?.includes("Validation failed")) {
        errorMessage = "Please check your input and try again.";
      } else if (error.message?.includes("phone number")) {
        errorMessage = "Please enter a valid Indian phone number (+91XXXXXXXXXX)";
      }
      
      toast({
        title: "Booking Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const DialogWrapper = 'trigger' in props ? Dialog : 'div';
  const wrapperProps = 'trigger' in props ? {} : {};

  const content = (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl">Book {equipment?.name}</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+919876543210"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Delivery Address *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Enter complete delivery address"
            className={errors.location ? "border-destructive" : ""}
          />
          {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground",
                    errors.dates && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground",
                    errors.dates && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => !startDate || date <= startDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {errors.dates && <p className="text-sm text-destructive">{errors.dates}</p>}

        <div className="space-y-2">
          <Label htmlFor="requirements">Special Requirements (Optional)</Label>
          <Textarea
            id="requirements"
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            placeholder="Any special requirements or instructions..."
            rows={3}
            maxLength={2000}
            className={errors.requirements ? "border-destructive" : ""}
          />
          {errors.requirements && <p className="text-sm text-destructive">{errors.requirements}</p>}
          <p className="text-xs text-muted-foreground">{formData.requirements.length}/2000 characters</p>
        </div>

        {equipment && (
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Equipment:</span>
              <span className="font-semibold">{equipment.name}</span>
            </div>
            {equipment.location && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-semibold">{equipment.location}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Booking Request"
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );

  if ('trigger' in props) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{props.trigger}</DialogTrigger>
        {content}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {content}
    </Dialog>
  );
};

export default BookingModal;
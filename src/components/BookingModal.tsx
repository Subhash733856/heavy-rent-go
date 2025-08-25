import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, MapPin, Phone, User, CreditCard, Shield } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  equipment: {
    id: number;
    name: string;
    price: string;
    image: string;
    category: string;
    operator: string;
    location: string;
  };
  trigger: React.ReactNode;
}

export const BookingModal = ({ equipment, trigger }: BookingModalProps) => {
  const [date, setDate] = useState<Date>();
  const [duration, setDuration] = useState("4");
  const [startTime, setStartTime] = useState("09:00");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    requirements: ""
  });

  const pricePerHour = parseInt(equipment.price.replace(/[₹,]/g, ""));
  const totalPrice = pricePerHour * parseInt(duration);
  const gst = Math.round(totalPrice * 0.18);
  const finalPrice = totalPrice + gst;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBooking = async () => {
    if (!isFormValid || !date) return;

    try {
      const startDateTime = new Date(date);
      const [hours, minutes] = startTime.split(':').map(Number);
      startDateTime.setHours(hours, minutes);

      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(startDateTime.getHours() + parseInt(duration));

      const bookingData = {
        equipmentId: equipment.id,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        durationHours: parseInt(duration),
        clientName: formData.name,
        clientPhone: formData.phone,
        pickupAddress: formData.location,
        specialRequirements: formData.requirements
      };

      console.log('Booking data:', bookingData);
      alert(`Booking confirmed!\n\nEquipment: ${equipment.name}\nDate: ${date?.toDateString()}\nTime: ${startTime}\nDuration: ${duration} hours\nClient: ${formData.name}\nPhone: ${formData.phone}\nLocation: ${formData.location}\n\nTotal Amount: ₹${finalPrice.toLocaleString()}\nAdvance Payment: ₹${Math.round(finalPrice * 0.3).toLocaleString()}\n\nBackend integration ready!`);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  const isFormValid = date && formData.name && formData.phone && formData.location;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Book Equipment</DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Equipment Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{equipment.image}</div>
                  <div>
                    <CardTitle className="text-xl">{equipment.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{equipment.category}</Badge>
                      <Badge variant="secondary">{equipment.price}/hour</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{equipment.operator}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{equipment.location}</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                    <Shield className="h-4 w-4" />
                    What's Included
                  </div>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Certified operator</li>
                    <li>• Fuel for operation</li>
                    <li>• Basic insurance coverage</li>
                    <li>• Equipment delivery & pickup</li>
                    <li>• 24/7 technical support</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Price Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Price Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Equipment Rate ({duration} hours)</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{gst.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{finalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  * Minimum booking duration: 4 hours
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date Selection */}
                <div className="space-y-2">
                  <Label>Booking Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time and Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="06:00">06:00 AM</SelectItem>
                        <SelectItem value="07:00">07:00 AM</SelectItem>
                        <SelectItem value="08:00">08:00 AM</SelectItem>
                        <SelectItem value="09:00">09:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="13:00">01:00 PM</SelectItem>
                        <SelectItem value="14:00">02:00 PM</SelectItem>
                        <SelectItem value="15:00">03:00 PM</SelectItem>
                        <SelectItem value="16:00">04:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Duration (hours)</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="6">6 hours</SelectItem>
                        <SelectItem value="8">8 hours (Full day)</SelectItem>
                        <SelectItem value="12">12 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Site Location *</Label>
                    <Input
                      id="location"
                      placeholder="Complete site address"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Special Requirements</Label>
                    <Textarea
                      id="requirements"
                      placeholder="Any specific requirements or instructions..."
                      value={formData.requirements}
                      onChange={(e) => handleInputChange("requirements", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment & Booking */}
            <div className="space-y-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                    <Shield className="h-4 w-4" />
                    Secure Booking Process
                  </div>
                  <p className="text-sm text-green-600">
                    Pay 20% advance now, remaining 80% after service completion. 
                    Full refund if cancelled 24 hours before booking.
                  </p>
                </CardContent>
              </Card>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleBooking}
                disabled={!isFormValid}
              >
                Pay Advance ₹{Math.round(finalPrice * 0.2).toLocaleString()} & Confirm Booking
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                By booking, you agree to our terms and conditions. 
                Equipment will be delivered to your site on the scheduled date.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
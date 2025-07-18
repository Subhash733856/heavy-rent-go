import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Gift, Percent, Clock, Users, Star, Calendar } from "lucide-react";

const SpecialOffersSection = () => {
  const { toast } = useToast();

  const handleOfferClaim = (offerName: string) => {
    toast({
      title: "Offer Applied!",
      description: `${offerName} has been added to your account. Use it during checkout.`,
    });
  };

  const handleViewAllOffers = () => {
    // Scroll to pricing section or show all offers modal
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
    toast({
      title: "All Offers",
      description: "Check out our pricing section for complete offer details.",
    });
  };

  const offers = [
    {
      title: "First Booking Discount",
      description: "Get ₹500 off on your first equipment booking",
      discount: "₹500 OFF",
      code: "FIRST500",
      icon: Gift,
      color: "bg-green-500",
      minBooking: "₹10,000",
      validity: "Valid till 31st Dec 2024"
    },
    {
      title: "Long-term Rental",
      description: "Book for 7+ days and get massive savings",
      discount: "15% OFF",
      code: "LONGTERM15",
      icon: Calendar,
      color: "bg-blue-500",
      minBooking: "7+ days",
      validity: "No expiry"
    },
    {
      title: "Bulk Equipment",
      description: "Rent 3+ equipment and save on total cost",
      discount: "10% OFF",
      code: "BULK10",
      icon: Users,
      color: "bg-purple-500",
      minBooking: "3+ equipment",
      validity: "Ongoing offer"
    },
    {
      title: "Peak Hours Special",
      description: "Non-peak hour bookings get special rates",
      discount: "20% OFF",
      code: "OFFPEAK20",
      icon: Clock,
      color: "bg-orange-500",
      minBooking: "6 AM - 10 AM",
      validity: "Weekdays only"
    },
    {
      title: "Premium Package",
      description: "Upgrade to premium with additional services",
      discount: "25% OFF",
      code: "PREMIUM25",
      icon: Star,
      color: "bg-yellow-500",
      minBooking: "₹25,000",
      validity: "Limited time"
    },
    {
      title: "Seasonal Special",
      description: "Special monsoon rates for all equipment",
      discount: "12% OFF",
      code: "MONSOON12",
      icon: Percent,
      color: "bg-teal-500",
      minBooking: "Any booking",
      validity: "July - September"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Gift className="h-4 w-4 mr-2" />
            Limited Time Offers
          </Badge>
          <h2 className="text-4xl font-heading font-bold mb-6">
            Special Offers & Discounts
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Save more on your equipment rentals with our exclusive offers. 
            Limited time deals that help you maximize your project budget.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {offers.map((offer, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-equipment transition-all duration-300">
              <div className={`absolute top-0 right-0 ${offer.color} text-white px-3 py-1 text-sm font-bold`}>
                {offer.discount}
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`${offer.color} p-2 rounded-lg`}>
                    <offer.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{offer.title}</CardTitle>
                </div>
                <p className="text-muted-foreground text-sm">{offer.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Code:</span>
                    <Badge variant="secondary" className="font-mono">
                      {offer.code}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Minimum:</span>
                    <span className="font-medium">{offer.minBooking}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valid till:</span>
                    <span className="font-medium">{offer.validity}</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={() => handleOfferClaim(offer.title)}
                >
                  Claim Offer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-industrial text-primary-foreground">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Gift className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-2xl font-heading font-bold mb-4">
              Don't Miss Out on These Deals!
            </h3>
            <p className="mb-6 opacity-90">
              More exclusive offers and seasonal discounts available. 
              Check our pricing section for the latest deals and save big on your next booking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={handleViewAllOffers}
              >
                View All Offers
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => {
                  const equipmentSection = document.getElementById('equipment-listing');
                  if (equipmentSection) {
                    equipmentSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Start Booking Now
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffersSection;
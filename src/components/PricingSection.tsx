import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, MapPin, Shield, Star } from "lucide-react";

const pricingCategories = [
  {
    category: "Earthmoving Equipment",
    icon: "🚜",
    popular: true,
    equipment: [
      { name: "Mini Excavator (1-3 tons)", price: "₹1,200", duration: "per hour", minHours: 4 },
      { name: "Excavator (20-25 tons)", price: "₹2,500", duration: "per hour", minHours: 4 },
      { name: "Bulldozer", price: "₹3,200", duration: "per hour", minHours: 6 },
      { name: "Backhoe Loader", price: "₹1,800", duration: "per hour", minHours: 4 },
      { name: "Wheel Loader", price: "₹2,100", duration: "per hour", minHours: 4 }
    ]
  },
  {
    category: "Material Handling",
    icon: "🧱",
    popular: true,
    equipment: [
      { name: "Mobile Crane (25 tons)", price: "₹3,500", duration: "per hour", minHours: 4 },
      { name: "Mobile Crane (50 tons)", price: "₹5,500", duration: "per hour", minHours: 6 },
      { name: "Tower Crane", price: "₹8,500", duration: "per day", minHours: 8 },
      { name: "Forklift (3 tons)", price: "₹800", duration: "per hour", minHours: 4 },
      { name: "Telehandler", price: "₹1,600", duration: "per hour", minHours: 4 }
    ]
  },
  {
    category: "Hauling Vehicles",
    icon: "🛻",
    popular: false,
    equipment: [
      { name: "Dump Truck (10 tons)", price: "₹1,200", duration: "per hour", minHours: 4 },
      { name: "Dump Truck (25 tons)", price: "₹1,800", duration: "per hour", minHours: 4 },
      { name: "Tipper (15 tons)", price: "₹1,500", duration: "per hour", minHours: 4 },
      { name: "Flatbed Truck", price: "₹1,100", duration: "per hour", minHours: 4 },
      { name: "Heavy Haul Truck", price: "₹2,800", duration: "per hour", minHours: 6 }
    ]
  },
  {
    category: "Specialty Equipment",
    icon: "🛠",
    popular: false,
    equipment: [
      { name: "Concrete Pump", price: "₹2,400", duration: "per hour", minHours: 4 },
      { name: "Pile Driver", price: "₹5,500", duration: "per hour", minHours: 6 },
      { name: "Road Roller", price: "₹1,400", duration: "per hour", minHours: 4 },
      { name: "Asphalt Paver", price: "₹3,800", duration: "per hour", minHours: 6 },
      { name: "Drilling Rig", price: "₹4,800", duration: "per hour", minHours: 8 }
    ]
  }
];

const features = [
  "Certified operators included",
  "Fuel charges included",
  "Basic insurance coverage",
  "Equipment delivery & pickup",
  "24/7 technical support",
  "Real-time GPS tracking",
  "Emergency replacement",
  "Transparent billing"
];

export const PricingSection = () => {
  return (
    <section id="pricing-section" className="py-20 bg-gradient-steel">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Transparent Pricing • No Hidden Charges
          </Badge>
          <h2 className="text-4xl font-heading font-bold mb-6">
            Equipment Rental Rates
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            All-inclusive rates with certified operators, fuel, and insurance. 
            Book for minimum hours and get competitive rates across India.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {pricingCategories.map((category, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden ${category.popular ? 'border-primary border-2 shadow-equipment' : ''}`}
            >
              {category.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <span className="text-3xl">{category.icon}</span>
                  {category.category}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {category.equipment.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Min. {item.minHours} hours booking
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{item.price}</div>
                        <div className="text-sm text-muted-foreground">{item.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features & Benefits */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-heading font-bold mb-6">
              What's Included in Every Rental
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Our all-inclusive pricing ensures you get professional equipment operation 
              without any hidden surprises. Every rental includes:
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-gradient-industrial text-primary-foreground shadow-glow">
            <CardHeader>
              <CardTitle className="text-2xl">Special Offers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-background/10 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">Long-term Discount</span>
                  </div>
                  <p className="text-sm opacity-90">
                    Book for 7+ days and get 15% off on total rental
                  </p>
                </div>
                
                <div className="bg-background/10 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5" />
                    <span className="font-semibold">Bulk Booking</span>
                  </div>
                  <p className="text-sm opacity-90">
                    Rent 3+ equipment simultaneously and save 10%
                  </p>
                </div>
                
                <div className="bg-background/10 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5" />
                    <span className="font-semibold">First-time Customer</span>
                  </div>
                  <p className="text-sm opacity-90">
                    Get ₹500 off on your first booking above ₹10,000
                  </p>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full bg-background/10 border-accent-foreground/30 text-primary-foreground hover:bg-background/20"
                onClick={() => {
                  const specialOffersSection = document.getElementById('special-offers-section');
                  if (specialOffersSection) {
                    specialOffersSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                View All Offers
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto p-8 bg-primary text-primary-foreground">
            <h3 className="text-2xl font-heading font-bold mb-4">
              Need a Custom Quote?
            </h3>
            <p className="mb-6 opacity-90">
              For large projects or specialized requirements, get a personalized quote 
              with volume discounts and project management support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-background/10 border-accent-foreground/30 text-primary-foreground hover:bg-background/20"
                onClick={() => window.open('tel:+917259388545', '_self')}
              >
                📞 Call for Quote
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => {
                  const customQuoteSection = document.getElementById('custom-quote-section');
                  if (customQuoteSection) {
                    customQuoteSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Get Custom Pricing
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
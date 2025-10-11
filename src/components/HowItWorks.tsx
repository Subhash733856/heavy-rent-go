import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  CreditCard, 
  Truck, 
  Shield, 
  Clock,
  CheckCircle,
  Users,
  ArrowRight
} from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Find Equipment",
    description: "Search by equipment type and location. View real-time availability, pricing, and operator ratings.",
    icon: Search,
    features: ["Real-time availability", "Location-based search", "Equipment specifications", "Operator profiles"]
  },
  {
    step: "02", 
    title: "Book Instantly",
    description: "Select your equipment, choose duration, and confirm booking. Get instant confirmation with operator details.",
    icon: CheckCircle,
    features: ["Instant booking", "Flexible duration", "Operator assignment", "GPS tracking setup"]
  },
  {
    step: "03",
    title: "Secure Payment",
    description: "Pay securely through our platform. Transparent pricing with no hidden fees. Payment protection included.",
    icon: CreditCard,
    features: ["Secure payments", "Transparent pricing", "Payment protection", "Digital receipts"]
  },
  {
    step: "04",
    title: "Equipment Delivered",
    description: "Track equipment arrival in real-time. Professional operator handles setup and operation on your site.",
    icon: Truck,
    features: ["Real-time tracking", "Professional operators", "Site setup included", "24/7 support"]
  }
];

const benefits = [
  {
    icon: Clock,
    title: "Save Time",
    description: "No more calling multiple suppliers. Find and book equipment in minutes, not hours."
  },
  {
    icon: Shield,
    title: "Fully Insured",
    description: "All equipment and operators are fully insured. Your project is protected."
  },
  {
    icon: Users,
    title: "Expert Operators",
    description: "Certified, experienced operators ensure safe and efficient equipment operation."
  },
  {
    icon: MapPin,
    title: "Local Network",
    description: "Access equipment from local providers. Faster delivery, lower costs."
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Simple. Fast. Professional.
          </Badge>
          <h2 className="text-4xl font-heading font-bold mb-6">
            How HeavyRent Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get heavy equipment on your construction site in 4 simple steps. 
            Professional operators, transparent pricing, and instant booking.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-8 h-full hover:shadow-equipment transition-all duration-300 group border-2 hover:border-primary/30">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8">
                    <div className="bg-gradient-industrial text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg">
                      {step.step}
                    </div>
                  </div>

                  <div className="pt-4 space-y-6">
                    {/* Icon */}
                    <div className="bg-primary/10 p-4 rounded-lg w-fit">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-xl font-heading font-semibold mb-3 group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {step.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Connector Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-heading font-bold mb-4">
              Why Choose HeavyRent?
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional equipment booking designed for the construction industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-industrial transition-all duration-300 group">
                <div className="bg-gradient-industrial p-4 rounded-full w-fit mx-auto mb-4 group-hover:animate-equipment-pulse">
                  <benefit.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h4 className="font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
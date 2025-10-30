import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  MapPin, 
  Clock, 
  Shield, 
  Truck, 
  Wrench, 
  Users,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { user, profile, isOperator, isClient } = useAuth();

  const handleGetStarted = () => {
    if (!user) {
      navigate('/client-login');
    } else if (isOperator) {
      navigate('/operator-home');
    } else {
      navigate('/user-dashboard');
    }
  };

  const handleListEquipment = () => {
    if (!user) {
      navigate('/operator-login');
    } else if (isOperator) {
      navigate('/operator-home');
    } else {
      alert('Please sign up as an operator to list equipment.');
      navigate('/operator-login');
    }
  };

  return (
    <section className="relative bg-gradient-hero text-accent-foreground py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/20 text-primary-foreground border-primary/30">
                🚜 Professional Equipment Booking
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-heading font-bold leading-tight">
                Heavy Equipment
                <span className="block text-primary">On-Demand</span>
              </h1>
              
              <p className="text-xl text-accent-foreground/80 leading-relaxed max-w-lg">
                Book excavators, cranes, bulldozers and 100+ types of construction equipment instantly. 
                Professional operators, transparent pricing, available when you need it.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Clock, text: "Instant Booking" },
                { icon: Shield, text: "Insured Equipment" },
                { icon: MapPin, text: "GPS Tracking" },
                { icon: Users, text: "Certified Operators" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-lg">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="xl" 
                className="bg-gradient-industrial text-primary-foreground hover:opacity-90 transition-all duration-300 shadow-glow"
                onClick={handleGetStarted}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="bg-background/10 border-accent-foreground/30 text-accent-foreground hover:bg-background/20"
                onClick={handleListEquipment}
              >
                List Your Equipment
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-accent-foreground/70">Equipment Units</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-accent-foreground/70">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-accent-foreground/70">Support</div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <Card className="p-8 bg-background/95 backdrop-blur-sm shadow-2xl border-primary/20">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-heading font-semibold">Quick Booking</h3>
                  <Badge variant="default" className="animate-glow-pulse">Live</Badge>
                </div>

                {/* Mock Booking Interface */}
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Truck className="h-6 w-6 text-primary" />
                      <div>
                        <div className="font-semibold">Excavator CAT 320</div>
                        <div className="text-sm text-muted-foreground">Available nearby • ₹2,500/hour</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Wrench className="h-6 w-6 text-secondary" />
                      <div>
                        <div className="font-semibold">Mobile Crane 50T</div>
                        <div className="text-sm text-muted-foreground">2.3 km away • ₹4,500/hour</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-primary" />
                      <div>
                        <div className="font-semibold text-primary">Bulldozer D6T</div>
                        <div className="text-sm text-primary/70">Booking confirmed • Arriving in 30 min</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="equipment" 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    const element = document.getElementById('equipment-listing');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View All Equipment
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
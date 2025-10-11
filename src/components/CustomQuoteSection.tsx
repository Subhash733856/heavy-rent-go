import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Phone, MessageSquare, Calculator, Clock, Users, Shield } from "lucide-react";

const CustomQuoteSection = () => {
  const { toast } = useToast();

  const handleStartBooking = () => {
    const equipmentSection = document.getElementById('equipment-listing');
    if (equipmentSection) {
      equipmentSection.scrollIntoView({ behavior: 'smooth' });
    }
    toast({
      title: "Let's Get Started!",
      description: "Browse our equipment selection and start your booking process.",
    });
  };

  const handleTalkToTeam = () => {
    window.open('tel:+917259388545', '_self');
    toast({
      title: "Calling Our Team",
      description: "You're being connected to our equipment specialists.",
    });
  };

  const handleGetCustomPricing = () => {
    toast({
      title: "Custom Quote Request",
      description: "Our team will contact you within 2 hours with a personalized quote.",
    });
    // In a real app, this would open a form or redirect to a quote page
    console.log("Custom pricing form opened");
  };

  const benefits = [
    {
      icon: Calculator,
      title: "Volume Discounts",
      description: "Get better rates for large projects and bulk bookings"
    },
    {
      icon: Clock,
      title: "Flexible Terms",
      description: "Custom payment schedules and extended rental periods"
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Personal project manager for enterprise clients"
    },
    {
      icon: Shield,
      title: "Enhanced Coverage",
      description: "Premium insurance options for high-value projects"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Calculator className="h-4 w-4 mr-2" />
            Custom Solutions
          </Badge>
          <h2 className="text-4xl font-heading font-bold mb-6">
            Need a Custom Quote?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            For large projects, specialized requirements, or enterprise needs, 
            get a personalized quote with volume discounts and premium support.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Benefits */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-heading font-bold mb-6">
                Why Choose Custom Pricing?
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                When standard rates don't fit your project scope, our custom solutions 
                provide the flexibility and support you need for successful project completion.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-6 hover:shadow-equipment transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Card */}
          <Card className="bg-gradient-industrial text-primary-foreground shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-heading">Ready to Get Started?</CardTitle>
              <p className="opacity-90 text-lg">
                Choose how you'd like to proceed with your equipment rental needs
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="w-full text-lg h-14"
                  onClick={handleStartBooking}
                >
                  🚜 Start Booking Equipment
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg h-14"
                  onClick={handleTalkToTeam}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Talk to Our Team
                </Button>
              </div>

              <div className="border-t border-white/20 pt-6">
                <div className="text-center mb-4">
                  <p className="text-sm opacity-75">
                    For enterprise solutions and custom pricing
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={handleGetCustomPricing}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Get Custom Pricing
                </Button>
              </div>

              {/* Contact Info */}
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-sm opacity-90 mb-2">📞 24/7 Support Available</p>
                <p className="font-semibold">+91 7259388545</p>
                <p className="text-sm opacity-75">HeavyRentProfessionalEquipment@gmail.com</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Process Steps */}
        <div className="bg-muted/30 rounded-xl p-8">
          <h3 className="text-2xl font-heading font-bold text-center mb-8">
            How Custom Quotes Work
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Tell Us Your Needs", desc: "Share project details and requirements" },
              { step: "2", title: "Expert Analysis", desc: "Our team analyzes and creates a solution" },
              { step: "3", title: "Custom Proposal", desc: "Receive detailed quote within 2 hours" },
              { step: "4", title: "Project Success", desc: "Dedicated support throughout your project" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomQuoteSection;
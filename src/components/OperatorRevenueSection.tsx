import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, DollarSign, Calendar, Headphones, Shield, Zap } from "lucide-react";

const OperatorRevenueSection = () => {
  const { toast } = useToast();

  const handleListEquipment = () => {
    toast({
      title: "Equipment Listing",
      description: "Our partner team will contact you within 1 hour to onboard your equipment.",
    });
    // In a real app, this would open a listing form
    console.log("Equipment listing form opened");
  };

  const handleScheduleDemo = () => {
    toast({
      title: "Demo Scheduled",
      description: "We'll call you within 15 minutes to schedule a personalized demo.",
    });
    window.open('tel:+917259388545', '_self');
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Free to List",
      description: "No setup fees or upfront costs to list your equipment"
    },
    {
      icon: TrendingUp,
      title: "Daily Payouts",
      description: "Get paid daily for completed bookings, no waiting"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock support for operators and customers"
    }
  ];

  const features = [
    "Instant booking notifications",
    "Real-time earnings tracking",
    "Equipment management dashboard",
    "Automated scheduling system",
    "Customer rating system",
    "Insurance coverage options",
    "Marketing & promotion tools",
    "Performance analytics"
  ];

  const stats = [
    { number: "500+", label: "Active Operators" },
    { number: "₹2.5L", label: "Avg Monthly Earnings" },
    { number: "95%", label: "Customer Satisfaction" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <TrendingUp className="h-4 w-4 mr-2" />
            Partner with Us
          </Badge>
          <h2 className="text-4xl font-heading font-bold mb-6">
            Ready to Maximize Your Equipment Revenue?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Join thousands of operators earning more with HeavyRent. 
            No setup fees, no long-term contracts, just more bookings.
          </p>
          <p className="text-lg font-semibold text-primary">
            Average operators increase their revenue by 40-60% within 3 months
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-equipment transition-shadow">
              <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Benefits */}
          <div>
            <h3 className="text-3xl font-heading font-bold mb-8">
              Why Choose HeavyRent?
            </h3>
            
            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">{benefit.title}</h4>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Platform Features
              </h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <Card className="bg-gradient-industrial text-primary-foreground shadow-2xl">
            <CardHeader className="text-center">
              <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-10 w-10" />
              </div>
              <CardTitle className="text-3xl font-heading">Start Earning Today!</CardTitle>
              <p className="opacity-90">
                List your equipment and start receiving bookings within 24 hours
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="w-full text-lg h-14"
                  onClick={handleListEquipment}
                >
                  🚜 List Your Equipment
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg h-14"
                  onClick={handleScheduleDemo}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Demo
                </Button>
              </div>

              <div className="border-t border-white/20 pt-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5" />
                    <span className="font-semibold">Guaranteed Benefits</span>
                  </div>
                  <ul className="text-sm space-y-1 opacity-90">
                    <li>• No listing fees or hidden charges</li>
                    <li>• Equipment insurance coverage</li>
                    <li>• Professional customer support</li>
                    <li>• Marketing & promotional support</li>
                  </ul>
                </div>
              </div>

              {/* Contact Info */}
              <div className="text-center">
                <p className="text-sm opacity-75 mb-2">
                  📞 Partner Support: +91-8000-000-000
                </p>
                <p className="text-sm opacity-75">
                  📧 partners@heavyrent.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Process */}
        <div className="bg-background/80 rounded-xl p-8">
          <h3 className="text-2xl font-heading font-bold text-center mb-8">
            How It Works - Start Earning in 3 Simple Steps
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: "1", 
                title: "List Your Equipment", 
                desc: "Upload photos, set rates, and provide equipment details",
                time: "5 minutes"
              },
              { 
                step: "2", 
                title: "Get Verified", 
                desc: "Our team verifies your equipment and documentation",
                time: "24 hours"
              },
              { 
                step: "3", 
                title: "Start Earning", 
                desc: "Receive bookings and get paid daily for completed jobs",
                time: "Immediate"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                <p className="text-muted-foreground mb-2">{item.desc}</p>
                <Badge variant="secondary" className="text-xs">
                  {item.time}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OperatorRevenueSection;
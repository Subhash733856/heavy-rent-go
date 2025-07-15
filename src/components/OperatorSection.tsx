import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Shield, 
  Smartphone,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Star
} from "lucide-react";

const operatorFeatures = [
  {
    icon: DollarSign,
    title: "Maximize Revenue",
    description: "Earn up to 40% more by reducing idle time. Our platform keeps your equipment working."
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Automated booking management with real-time availability updates and conflict prevention."
  },
  {
    icon: Shield,
    title: "Full Protection",
    description: "Comprehensive insurance coverage for your equipment and operators during every booking."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track performance, revenue, and utilization rates with detailed reporting and insights."
  }
];

const testimonials = [
  {
    name: "Mike Johnson",
    role: "Equipment Owner",
    company: "Johnson Construction",
    rating: 5,
    text: "HeavyRent has doubled my equipment utilization. The platform is easy to use and payments are always on time.",
    equipment: "12 machines listed"
  },
  {
    name: "Sarah Chen",
    role: "Fleet Manager", 
    company: "Metro Excavation",
    rating: 5,
    text: "Managing bookings used to take hours. Now it's completely automated. Our operators love the mobile app.",
    equipment: "25 machines listed"
  },
  {
    name: "Carlos Rodriguez",
    role: "Independent Operator",
    company: "Rodriguez Heavy Equipment",
    rating: 5,
    text: "Started with one excavator, now I have a fleet of 8. The demand through HeavyRent is incredible.",
    equipment: "8 machines listed"
  }
];

const steps = [
  {
    step: "1",
    title: "List Your Equipment",
    description: "Add your machines with photos, specifications, and availability schedules."
  },
  {
    step: "2", 
    title: "Set Your Rates",
    description: "Dynamic pricing recommendations help you maximize revenue while staying competitive."
  },
  {
    step: "3",
    title: "Accept Bookings",
    description: "Automatic matching with verified clients. Accept or decline bookings with one tap."
  },
  {
    step: "4",
    title: "Get Paid",
    description: "Secure payments processed automatically. Daily payouts to your bank account."
  }
];

export const OperatorSection = () => {
  return (
    <section id="for-operators" className="py-20 bg-gradient-steel">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            For Equipment Owners & Operators
          </Badge>
          <h2 className="text-4xl font-heading font-bold mb-6">
            Turn Your Equipment Into Revenue
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join the largest network of equipment providers. Maximize utilization, 
            streamline operations, and grow your business with HeavyRent.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { value: "40%", label: "Average Revenue Increase" },
            { value: "85%", label: "Equipment Utilization" },
            { value: "2,500+", label: "Active Operators" },
            { value: "24hrs", label: "Average Payout Time" }
          ].map((stat, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-equipment transition-all duration-300">
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-3xl font-heading font-bold mb-8">
              Why Operators Choose HeavyRent
            </h3>
            <div className="space-y-6">
              {operatorFeatures.map((feature, index) => (
                <Card key={index} className="p-6 hover:shadow-industrial transition-all duration-300 group">
                  <div className="flex gap-4">
                    <div className="bg-gradient-industrial p-3 rounded-lg shadow-lg group-hover:animate-equipment-pulse">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works for Operators */}
          <div>
            <h3 className="text-3xl font-heading font-bold mb-8">
              Get Started in 4 Steps
            </h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <Card key={index} className="p-6 hover:shadow-industrial transition-all duration-300 group">
                  <div className="flex gap-4">
                    <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-3xl font-heading font-bold text-center mb-12">
            Success Stories from Our Operators
          </h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-equipment transition-all duration-300">
                <div className="space-y-4">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Testimonial */}
                  <p className="text-muted-foreground italic">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="pt-4 border-t border-border">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {testimonial.equipment}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-4xl mx-auto p-8 bg-gradient-industrial text-primary-foreground shadow-glow">
            <div className="space-y-6">
              <h3 className="text-3xl font-heading font-bold">
                Ready to Maximize Your Equipment Revenue?
              </h3>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Join thousands of operators earning more with HeavyRent. 
                No setup fees, no long-term contracts, just more bookings.
              </p>
              
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Free to list</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Daily payouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>24/7 support</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button variant="secondary" size="xl" className="group">
                  List Your Equipment
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="xl" className="bg-background/10 border-accent-foreground/30 text-primary-foreground hover:bg-background/20">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
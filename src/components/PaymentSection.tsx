import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Shield, Zap, CheckCircle } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentSection = () => {
  const { toast } = useToast();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (amount: number, description: string) => {
    const res = await loadRazorpay();

    if (!res) {
      toast({
        title: "Payment Error",
        description: "Razorpay SDK failed to load. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get Razorpay key from backend - this is more secure than client-side config
      // The key will be returned by the payment creation endpoint
      toast({
        title: "Payment Setup",
        description: "Please connect your account and create a booking first to enable payments.",
      });
      
      // In production, this would:
      // 1. Create a booking
      // 2. Call create-razorpay-payment endpoint which returns the key
      // 3. Use that key to initialize Razorpay
      console.log("Payment flow requires booking creation first");
      
    } catch (error) {
      console.error('Payment setup error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to setup payment. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const paymentPlans = [
    {
      name: "Basic Plan",
      price: 2500,
      description: "4-hour minimum booking",
      features: ["Certified operator", "Fuel included", "Basic insurance", "Delivery & pickup"],
      popular: false
    },
    {
      name: "Premium Plan", 
      price: 5000,
      description: "8-hour booking with extras",
      features: ["Certified operator", "Fuel included", "Full insurance", "Priority support", "GPS tracking", "Emergency replacement"],
      popular: true
    },
    {
      name: "Enterprise Plan",
      price: 10000,
      description: "Full day with project management",
      features: ["Multiple operators", "All fuel costs", "Comprehensive coverage", "24/7 support", "Project manager", "Multiple equipment"],
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <CreditCard className="h-4 w-4 mr-2" />
            Secure Payment Gateway
          </Badge>
          <h2 className="text-4xl font-heading font-bold mb-6">
            Choose Your Payment Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Secure and instant payments with Razorpay. Pay only for what you use with flexible booking options.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {paymentPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-primary border-2 shadow-equipment scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-primary">₹{plan.price.toLocaleString()}</div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant={plan.popular ? "default" : "outline"} 
                  className="w-full"
                  onClick={() => handlePayment(plan.price, `${plan.name} - ${plan.description}`)}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Security */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Secure Payments</h3>
            <p className="text-sm text-muted-foreground">
              Bank-grade security with 256-bit SSL encryption
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Instant Processing</h3>
            <p className="text-sm text-muted-foreground">
              Payments processed instantly with real-time confirmation
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Multiple Options</h3>
            <p className="text-sm text-muted-foreground">
              UPI, Cards, Net Banking, and digital wallets accepted
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;
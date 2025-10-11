import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, TrendingUp, Clock, Shield } from "lucide-react";

const OperatorHome = () => {
  const { user, isOperator } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/operator-login");
    } else if (!isOperator) {
      navigate("/");
    }
  }, [user, isOperator, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Welcome to <span className="text-primary">Operator Portal</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Manage your equipment, track bookings, and grow your rental business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Settings className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Manage Equipment</CardTitle>
              <CardDescription>
                List and update your equipment inventory
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Track Revenue</CardTitle>
              <CardDescription>
                Monitor your earnings and performance
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>View Bookings</CardTitle>
              <CardDescription>
                Manage all your rental bookings
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Secure Platform</CardTitle>
              <CardDescription>
                Safe payments and verified clients
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={() => navigate("/operator-dashboard")}
            className="bg-gradient-industrial text-primary-foreground hover:opacity-90"
          >
            Go to Dashboard
          </Button>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">
            Why Choose HeavyRent?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Maximize Revenue</h3>
              <p className="text-muted-foreground">
                Reach more clients and keep your equipment working around the clock
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
              <p className="text-muted-foreground">
                All payments are processed securely with verified clients
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">
                Our team is always available to help you succeed
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OperatorHome;

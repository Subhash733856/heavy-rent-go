import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Settings, BarChart3, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GetStartedButton() {
  const { user, profile, isOperator, isClient } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!user) {
      setShowDialog(true);
      return;
    }

    // Redirect based on user role
    if (isOperator) {
      navigate('/operator-dashboard');
    } else if (isClient) {
      navigate('/user-dashboard');
    } else {
      setShowDialog(true);
    }
  };

  const handleRoleSelection = (role: 'client' | 'operator') => {
    if (role === 'client') {
      navigate('/user-dashboard');
    } else {
      navigate('/operator-dashboard');
    }
    setShowDialog(false);
  };

  return (
    <>
      <Button 
        size="xl" 
        className="bg-gradient-industrial text-primary-foreground hover:opacity-90 transition-all duration-300 shadow-glow"
        onClick={handleGetStarted}
      >
        Get Started
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Choose Your Dashboard</DialogTitle>
            <DialogDescription>
              {!user 
                ? "Please log in first to access your personalized dashboard." 
                : "Select the dashboard that matches your role on our platform."
              }
            </DialogDescription>
          </DialogHeader>

          {!user ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You need to log in to access the full features of our platform.
              </p>
              <Button 
                onClick={() => setShowDialog(false)}
                className="bg-gradient-industrial text-primary-foreground"
              >
                Sign In / Sign Up
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary"
                onClick={() => handleRoleSelection('client')}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-6 w-6 text-primary" />
                      <CardTitle>Client Dashboard</CardTitle>
                    </div>
                    <Badge variant="secondary">Rent Equipment</Badge>
                  </div>
                  <CardDescription>
                    Browse, book, and manage equipment rentals for your projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Manage bookings</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span>Track expenses</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Contact operators</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Access Client Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-secondary"
                onClick={() => handleRoleSelection('operator')}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-6 w-6 text-secondary" />
                      <CardTitle>Operator Dashboard</CardTitle>
                    </div>
                    <Badge variant="default">Rent Out Equipment</Badge>
                  </div>
                  <CardDescription>
                    List your equipment and manage rentals to earn revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span>Manage equipment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span>Track revenue</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Manage bookings</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="secondary">
                    Access Operator Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
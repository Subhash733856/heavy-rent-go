import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Construction, Menu, User, Bell, Search, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const handleCallEmergency = () => {
  window.open('tel:+917259388545', '_self');
};

const handleSearch = () => {
  const equipmentSection = document.getElementById('equipment-listing');
  if (equipmentSection) {
    equipmentSection.scrollIntoView({ behavior: 'smooth' });
  }
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut, isOperator, isClient } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/client-login");
  };

  const handleDashboardClick = () => {
    if (isOperator) {
      navigate("/operator-home");
    } else {
      navigate("/user-dashboard");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b-2 border-primary/20 sticky top-0 z-50 shadow-industrial">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="bg-gradient-industrial p-2 rounded-lg shadow-equipment">
              <Construction className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                HeavyRent
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                Professional Equipment Booking
              </p>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => scrollToSection('equipment')} 
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              Equipment
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('for-operators')} 
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              For Operators
            </button>
            <button 
              onClick={handleCallEmergency} 
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              Emergency Support
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex"
              onClick={handleCallEmergency}
            >
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        {profile?.name || 'User'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        <div className="font-medium text-foreground">{profile?.name}</div>
                        <div className="text-xs">{profile?.email}</div>
                        <div className="text-xs mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {isOperator ? 'Operator' : 'Client'}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleDashboardClick}>
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    variant="equipment" 
                    size="sm"
                    onClick={() => scrollToSection('equipment-listing')}
                  >
                    Get Started
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLoginClick}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button 
                    variant="equipment" 
                    size="sm"
                    onClick={() => scrollToSection('equipment-listing')}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <button 
                onClick={() => { scrollToSection('equipment'); setIsMenuOpen(false); }} 
                className="text-foreground hover:text-primary font-medium text-left"
              >
                Equipment
              </button>
              <button 
                onClick={() => { scrollToSection('how-it-works'); setIsMenuOpen(false); }} 
                className="text-foreground hover:text-primary font-medium text-left"
              >
                How It Works
              </button>
              <button 
                onClick={() => { scrollToSection('for-operators'); setIsMenuOpen(false); }} 
                className="text-foreground hover:text-primary font-medium text-left"
              >
                For Operators
              </button>
              <button 
                onClick={() => { handleCallEmergency(); setIsMenuOpen(false); }} 
                className="text-foreground hover:text-primary font-medium text-left"
              >
                Emergency Support
              </button>
              <div className="flex flex-col gap-2 pt-2">
                {user ? (
                  <>
                    <div className="p-3 bg-muted rounded-lg mb-2">
                      <div className="font-medium text-sm">{profile?.name}</div>
                      <div className="text-xs text-muted-foreground">{profile?.email}</div>
                      <Badge variant="secondary" className="text-xs mt-2">
                        {isOperator ? 'Operator' : 'Client'}
                      </Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => { 
                        handleDashboardClick();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => { 
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => { 
                      handleLoginClick();
                      setIsMenuOpen(false);
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )}
                <Button 
                  variant="equipment" 
                  size="sm"
                  onClick={() => { scrollToSection('equipment-listing'); setIsMenuOpen(false); }}
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
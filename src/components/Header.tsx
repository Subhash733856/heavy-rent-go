import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Construction, Menu, User, Bell, Search } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b-2 border-primary/20 sticky top-0 z-50 shadow-industrial">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
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
            <a href="#equipment" className="text-foreground hover:text-primary font-medium transition-colors">
              Equipment
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary font-medium transition-colors">
              How It Works
            </a>
            <a href="#for-operators" className="text-foreground hover:text-primary font-medium transition-colors">
              For Operators
            </a>
            <a href="#support" className="text-foreground hover:text-primary font-medium transition-colors">
              Support
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button variant="equipment" size="sm">
                Get Started
              </Button>
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
              <a href="#equipment" className="text-foreground hover:text-primary font-medium">
                Equipment
              </a>
              <a href="#how-it-works" className="text-foreground hover:text-primary font-medium">
                How It Works
              </a>
              <a href="#for-operators" className="text-foreground hover:text-primary font-medium">
                For Operators
              </a>
              <a href="#support" className="text-foreground hover:text-primary font-medium">
                Support
              </a>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Sign In
                </Button>
                <Button variant="equipment" size="sm" className="flex-1">
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
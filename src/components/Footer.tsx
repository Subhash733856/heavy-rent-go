import { Construction } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-accent text-accent-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Construction className="h-6 w-6 text-primary" />
              <span className="font-heading font-bold text-xl">HeavyRent</span>
            </div>
            <p className="text-sm opacity-80">
              Professional heavy equipment booking platform for the construction industry.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Equipment</h4>
            <div className="space-y-2 text-sm opacity-80">
              <div>Excavators</div>
              <div>Cranes</div>
              <div>Bulldozers</div>
              <div>Dump Trucks</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-sm opacity-80">
              <div>About Us</div>
              <div>Support</div>
              <div>Safety</div>
              <div>Careers</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm opacity-80">
              <div>+91 7259388545</div>
              <div>HeavyRentProfessionalEquipment@gmail.com</div>
              <div>24/7 Emergency Dispatch</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-accent-foreground/20 mt-8 pt-8 text-center text-sm opacity-60">
          © 2024 HeavyRent. All rights reserved. Professional equipment booking platform.
        </div>
      </div>
    </footer>
  );
};
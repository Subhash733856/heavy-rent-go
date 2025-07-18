import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { EquipmentCategories } from "@/components/EquipmentCategories";
import { EquipmentListing } from "@/components/EquipmentListing";
import { PricingSection } from "@/components/PricingSection";
import { HowItWorks } from "@/components/HowItWorks";
import { OperatorSection } from "@/components/OperatorSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <EquipmentCategories />
      <div id="equipment-listing">
        <EquipmentListing />
      </div>
      <PricingSection />
      <HowItWorks />
      <OperatorSection />
      <Footer />
    </div>
  );
};

export default Index;

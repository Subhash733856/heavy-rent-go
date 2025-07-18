import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { EquipmentCategories } from "@/components/EquipmentCategories";
import { EquipmentListing } from "@/components/EquipmentListing";
import { PricingSection } from "@/components/PricingSection";
import PaymentSection from "@/components/PaymentSection";
import SpecialOffersSection from "@/components/SpecialOffersSection";
import CustomQuoteSection from "@/components/CustomQuoteSection";
import { HowItWorks } from "@/components/HowItWorks";
import { OperatorSection } from "@/components/OperatorSection";
import OperatorRevenueSection from "@/components/OperatorRevenueSection";
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
      <PaymentSection />
      <div id="special-offers-section">
        <SpecialOffersSection />
      </div>
      <div id="custom-quote-section">
        <CustomQuoteSection />
      </div>
      <HowItWorks />
      <OperatorSection />
      <OperatorRevenueSection />
      <Footer />
    </div>
  );
};

export default Index;

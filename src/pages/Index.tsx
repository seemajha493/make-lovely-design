import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSButton } from "@/components/SOSButton";
import { HeroSection } from "@/components/home/HeroSection";
import { EmergencyHub } from "@/components/home/EmergencyHub";
import { MedicinePreview } from "@/components/home/MedicinePreview";
import { PrescriptionPreview } from "@/components/home/PrescriptionPreview";
import { HealthcareHero } from "@/components/home/HealthcareHero";
import { Testimonials } from "@/components/home/Testimonials";
import { RakshaChatbot } from "@/components/RakshaChatbot";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <EmergencyHub />
        <MedicinePreview />
        <PrescriptionPreview />
        <HealthcareHero />
        <Testimonials />
      </main>
      <Footer />
      <SOSButton />
      <RakshaChatbot />
    </div>
  );
};

export default Index;

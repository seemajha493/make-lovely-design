import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSButton } from "@/components/SOSButton";
import { HeroSection } from "@/components/home/HeroSection";
import { EmergencyServices } from "@/components/home/EmergencyServices";
import { NearbyHospitals } from "@/components/home/NearbyHospitals";
import { FirstAidPreview } from "@/components/home/FirstAidPreview";
import { EmergencyContacts } from "@/components/home/EmergencyContacts";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <EmergencyServices />
        <NearbyHospitals />
        <FirstAidPreview />
        <EmergencyContacts />
      </main>
      <Footer />
      <SOSButton />
    </div>
  );
};

export default Index;

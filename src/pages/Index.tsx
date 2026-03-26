import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ImpactCounters from "@/components/ImpactCounters";
import AboutSection from "@/components/AboutSection";
import BoardSection from "@/components/BoardSection";
import EventsSection from "@/components/EventsSection";
import GallerySection from "@/components/GallerySection";
import ResourcesSection from "@/components/ResourcesSection";
import ContactSection from "@/components/ContactSection";
import EcoBot from "@/components/EcoBot";
import Footer from "@/components/Footer";
import LiquidBackground from "@/components/LiquidBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <LiquidBackground />
      <div className="glow-mesh animate-ambient-glow" />

      <Navbar />
      <main>
        <HeroSection />
        <ImpactCounters />
        <AboutSection />
        <BoardSection />
        <EventsSection />
        <GallerySection />
        <ResourcesSection />
        <ContactSection />
      </main>
      <Footer />
      <EcoBot />
    </div>
  );
};

export default Index;

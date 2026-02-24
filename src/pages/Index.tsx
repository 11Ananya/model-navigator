import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { DemoInterface } from "@/components/DemoInterface";
import { HowItWorks } from "@/components/HowItWorks";
import { WhySection } from "@/components/WhySection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main>
          <Hero />
          <DemoInterface />
          <HowItWorks />
          <WhySection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;

import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { HowItWorks } from "@/components/HowItWorks";
import { DemoInterface } from "@/components/DemoInterface";
import { AudienceSection } from "@/components/AudienceSection";
import { DifferentiatorSection } from "@/components/DifferentiatorSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main>
          <Hero />
          <ProblemSection />
          <HowItWorks />
          <DemoInterface />
          <AudienceSection />
          <DifferentiatorSection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;

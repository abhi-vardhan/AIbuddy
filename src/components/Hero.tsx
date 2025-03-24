
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface HeroProps {
  onGetStarted?: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[600px] bg-gradient-to-b from-studyBuddy-primary/10 to-transparent rounded-full -mt-32 blur-3xl opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className={`md:w-1/2 space-y-6 transition-all duration-700 ease-out ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <div className="inline-flex items-center rounded-full border border-studyBuddy-primary/20 bg-studyBuddy-primary/5 px-3 py-1 text-sm font-medium text-studyBuddy-primary animate-pulse-subtle">
              <span>AI-Powered Learning</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Transform Your Notes Into 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-studyBuddy-primary to-studyBuddy-secondary"> Interactive Learning</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-prose">
              Upload your notes or PDF documents and let our AI turn them into personalized study guides, flashcards, and quizzes. Study smarter, not harder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="rounded-full bg-studyBuddy-primary hover:bg-studyBuddy-primary/90 text-white px-8"
                onClick={onGetStarted}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full"
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                How It Works
              </Button>
            </div>
          </div>

          <div className={`md:w-1/2 transition-all duration-700 delay-300 ease-out ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <div className="relative p-2 rounded-2xl bg-gradient-to-br from-studyBuddy-primary to-studyBuddy-secondary shadow-xl">
              <div className="absolute inset-0 bg-white rounded-xl m-[2px]" />
              <div className="relative z-10 bg-white rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3546&q=80" 
                  alt="Student studying with AI assistant" 
                  className="w-full h-auto object-cover rounded-t-xl"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-studyBuddy-success/20 p-1.5 rounded-full">
                        <div className="h-2 w-2 rounded-full bg-studyBuddy-success animate-pulse" />
                      </div>
                      <span className="ml-2 text-sm font-medium text-studyBuddy-success">AI Processing</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Study Session 01</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AP Biology: Cellular Respiration</h3>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center p-2 bg-studyBuddy-primary/10 rounded-lg">
                      <p className="text-xs text-muted-foreground">Quiz Score</p>
                      <p className="text-lg font-medium text-studyBuddy-primary">92%</p>
                    </div>
                    <div className="text-center p-2 bg-studyBuddy-secondary/10 rounded-lg">
                      <p className="text-xs text-muted-foreground">Cards</p>
                      <p className="text-lg font-medium text-studyBuddy-secondary">24</p>
                    </div>
                    <div className="text-center p-2 bg-studyBuddy-accent/10 rounded-lg">
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-lg font-medium text-studyBuddy-accent">45m</p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-studyBuddy-primary h-1.5 rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


import { useState, useEffect } from "react";
import { Bot, FileText, Sparkles, BookOpen } from "lucide-react";

interface AIProcessingProps {
  isProcessing: boolean;
  processingStage: number;
  onComplete: () => void;
}

const AIProcessing = ({ isProcessing, processingStage, onComplete }: AIProcessingProps) => {
  const [progress, setProgress] = useState(0);
  const stages = [
    "Analyzing documents",
    "Extracting key information",
    "Generating study materials",
    "Finalizing content"
  ];

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isProcessing, onComplete]);

  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-studyBuddy-primary/20 animate-ping" />
            <div className="relative bg-studyBuddy-primary text-white p-4 rounded-full">
              {processingStage === 0 ? (
                <FileText className="h-6 w-6 animate-pulse" />
              ) : processingStage === 1 ? (
                <Bot className="h-6 w-6 animate-pulse" />
              ) : processingStage === 2 ? (
                <Sparkles className="h-6 w-6 animate-pulse" />
              ) : (
                <BookOpen className="h-6 w-6 animate-pulse" />
              )}
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-center mb-2">
          {stages[processingStage]}
        </h3>
        
        <p className="text-muted-foreground text-center mb-6">
          We're using AI to create personalized study materials from your documents.
        </p>
        
        <div className="w-full bg-muted h-2 rounded-full mb-2 overflow-hidden">
          <div 
            className="h-full bg-studyBuddy-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>AI Processing</span>
          <span>{progress}%</span>
        </div>
        
        <div className="mt-6 space-y-3">
          {stages.map((stage, index) => (
            <div 
              key={index} 
              className={`flex items-center ${
                index < processingStage || (index === processingStage && progress === 100)
                  ? "text-studyBuddy-success"
                  : index === processingStage
                  ? "text-studyBuddy-primary"
                  : "text-muted-foreground"
              }`}
            >
              <div className={`h-2 w-2 rounded-full mr-3 ${
                index < processingStage || (index === processingStage && progress === 100)
                  ? "bg-studyBuddy-success"
                  : index === processingStage
                  ? "bg-studyBuddy-primary animate-pulse"
                  : "bg-muted"
              }`} />
              <span className={index === processingStage ? "font-medium" : ""}>
                {stage}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIProcessing;


import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AIProcessing from "./AIProcessing";
import StudyGuide from "./StudyGuide";
import FlashcardViewer from "./FlashcardViewer";
import QuizGenerator from "./QuizGenerator";
import AudioPlayer from "./AudioPlayer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, FlaskConical, Lightbulb, Headphones } from "lucide-react";

interface StudyMaterialProcessorProps {
  files: File[];
}

interface StudyGuideData {
  title: string;
  content: {
    section: string;
    keyPoints: string[];
    summary: string;
  }[];
}

interface FlashcardData {
  title: string;
  cards: {
    id: number;
    question: string;
    answer: string;
  }[];
}

interface QuizData {
  title: string;
  questions: {
    id: number;
    question: string;
    options: string[];
    correctAnswerIndex: number;
  }[];
}

interface AudioData {
  title: string;
  audioUrl: string;
}

interface ProcessingResult {
  studyGuide: StudyGuideData;
  flashcards: FlashcardData;
  quiz: QuizData;
  audio: AudioData;
}

const StudyMaterialProcessor = ({ files }: StudyMaterialProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [processedData, setProcessedData] = useState<ProcessingResult | null>(null);

  const processFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to process.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingStage(0);
      
      // Process each file one by one
      const file = files[0]; // Start with the first file
      
      setProcessingStage(1);
      
      const formData = new FormData();
      formData.append('file', file);

      // Call Supabase Edge Function to process the file
      setProcessingStage(2);
      const { data, error } = await supabase.functions.invoke('process-files', {
        body: formData,
      });

      if (error) {
        throw new Error(`Error processing file: ${error.message}`);
      }

      setProcessingStage(3);
      
      // Set the processed data
      setProcessedData(data);
      
    } catch (error) {
      console.error("Error processing files:", error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Failed to process files",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    toast({
      title: "Processing Complete",
      description: "Your study materials are ready!",
      variant: "default",
    });
  };

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    toast({
      title: "Quiz Completed",
      description: `You scored ${score} out of ${totalQuestions}!`,
      variant: "default",
    });
  };

  return (
    <div className="w-full">
      {files.length > 0 && !processedData && !isProcessing && (
        <div className="flex justify-center mt-6">
          <button
            onClick={processFiles}
            className="bg-studyBuddy-primary text-white px-6 py-3 rounded-full hover:bg-studyBuddy-primary/90 transition-colors shadow-md"
          >
            Generate Study Materials
          </button>
        </div>
      )}

      {isProcessing && (
        <AIProcessing 
          isProcessing={isProcessing} 
          processingStage={processingStage} 
          onComplete={handleProcessingComplete} 
        />
      )}

      {processedData && (
        <div className="mt-10 space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-center">Your Study Materials</h2>
          
          <Tabs defaultValue="study-guide" className="w-full">
            <TabsList className="grid grid-cols-4 max-w-2xl mx-auto">
              <TabsTrigger value="study-guide" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span className="hidden sm:inline">Study Guide</span>
              </TabsTrigger>
              <TabsTrigger value="flashcards" className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4" />
                <span className="hidden sm:inline">Flashcards</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span className="hidden sm:inline">Quiz</span>
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <Headphones className="h-4 w-4" />
                <span className="hidden sm:inline">Audio</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="study-guide" className="mt-6">
              <StudyGuide 
                title={processedData.studyGuide.title} 
                content={processedData.studyGuide.content} 
              />
            </TabsContent>
            
            <TabsContent value="flashcards" className="mt-6">
              <FlashcardViewer 
                cards={processedData.flashcards.cards}
                title={processedData.flashcards.title}
              />
            </TabsContent>
            
            <TabsContent value="quiz" className="mt-6">
              <QuizGenerator
                title={processedData.quiz.title}
                questions={processedData.quiz.questions}
                onComplete={handleQuizComplete}
              />
            </TabsContent>
            
            <TabsContent value="audio" className="mt-6">
              <AudioPlayer 
                title={processedData.audio.title}
                audioUrl={processedData.audio.audioUrl}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialProcessor;

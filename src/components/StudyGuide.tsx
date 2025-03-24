
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Copy, Share2, Bookmark } from "lucide-react";

interface StudyGuideProps {
  title: string;
  content: {
    section: string;
    keyPoints: string[];
    summary: string;
  }[];
}

const StudyGuide = ({ title, content }: StudyGuideProps) => {
  const [activeSection, setActiveSection] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const copyToClipboard = () => {
    const textToCopy = content.map(section => 
      `${section.section}\n\n${section.summary}\n\n${section.keyPoints.map(point => `• ${point}`).join('\n')}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(textToCopy);
    // You would normally show a toast notification here
    console.log("Copied to clipboard");
  };

  return (
    <div className="bg-white border border-border/40 rounded-xl shadow-sm overflow-hidden animate-scale">
      <div className="flex items-center justify-between border-b border-border/40 p-4">
        <div className="flex items-center">
          <BookOpen className="h-5 w-5 text-studyBuddy-primary mr-2" />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setBookmarked(!bookmarked)}
            className={`rounded-full ${bookmarked ? 'text-studyBuddy-warning' : 'text-muted-foreground'}`}
          >
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={copyToClipboard}
            className="rounded-full text-muted-foreground"
          >
            <Copy className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full text-muted-foreground"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full text-muted-foreground"
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[500px]">
        {/* Sidebar navigation */}
        <div className="w-full md:w-64 bg-studyBuddy-background border-r border-border/40 p-4 overflow-y-auto">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">CONTENTS</h3>
          <nav className="space-y-1">
            {content.map((section, index) => (
              <button
                key={index}
                onClick={() => setActiveSection(index)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeSection === index
                    ? "bg-studyBuddy-primary/10 text-studyBuddy-primary font-medium"
                    : "hover:bg-muted text-foreground/80"
                }`}
              >
                {section.section}
              </button>
            ))}
          </nav>
        </div>

        {/* Content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-2xl font-semibold">{content[activeSection].section}</h3>
            
            <div className="bg-studyBuddy-background rounded-lg p-4">
              <h4 className="text-sm font-medium text-studyBuddy-primary mb-2">SUMMARY</h4>
              <p className="text-foreground/90 leading-relaxed">
                {content[activeSection].summary}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-studyBuddy-primary mb-3">KEY POINTS</h4>
              <ul className="space-y-3">
                {content[activeSection].keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-studyBuddy-primary/10 text-studyBuddy-primary flex items-center justify-center mr-3 mt-0.5 text-xs font-medium">
                      {idx + 1}
                    </div>
                    <p className="text-foreground/90 leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyGuide;

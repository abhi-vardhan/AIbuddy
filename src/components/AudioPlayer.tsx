
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  title: string;
  audioUrl: string;
  generateTextToSpeech?: (text: string) => Promise<string | null>;
  studyContent?: Array<{
    section: string;
    summary: string;
    keyPoints: string[];
  }>;
}

const AudioPlayer = ({ title, audioUrl, generateTextToSpeech, studyContent }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(audioUrl);
  const [selectedSection, setSelectedSection] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element on mount
  useEffect(() => {
    const audio = new Audio(currentAudioUrl);
    audioRef.current = audio;
    
    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };
    
    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    audio.onended = () => {
      setIsPlaying(false);
    };
    
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [currentAudioUrl]);

  // Update audio URL if audioUrl prop changes
  useEffect(() => {
    if (audioUrl && audioUrl !== currentAudioUrl) {
      setCurrentAudioUrl(audioUrl);
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        toast({
          variant: "destructive",
          title: "Playback failed",
          description: "There was an error playing the audio.",
        });
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const generateAudioForSection = async (index: number) => {
    if (!studyContent || !generateTextToSpeech) return;
    
    try {
      setIsLoading(true);
      setIsPlaying(false);
      
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const section = studyContent[index];
      const textToSpeak = `${section.section}. ${section.summary}. Key points: ${section.keyPoints.join(". ")}`;
      
      toast({
        title: "Generating audio",
        description: "Please wait while we generate the audio for this section...",
      });
      
      const newAudioUrl = await generateTextToSpeech(textToSpeak);
      
      if (newAudioUrl) {
        setCurrentAudioUrl(newAudioUrl);
        setSelectedSection(index);
        
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(console.error);
            setIsPlaying(true);
          }
        }, 500);
      } else {
        throw new Error("Failed to generate audio");
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      toast({
        variant: "destructive",
        title: "Audio generation failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border border-border/40 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/40 p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      
      <div className="flex flex-col md:flex-row h-[500px]">
        {/* Section selector */}
        {studyContent && studyContent.length > 0 && (
          <div className="w-full md:w-64 bg-studyBuddy-background border-r border-border/40 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">SELECT SECTION TO LISTEN</h3>
            <nav className="space-y-1">
              {studyContent.map((section, index) => (
                <button
                  key={index}
                  onClick={() => generateAudioForSection(index)}
                  disabled={isLoading}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedSection === index
                      ? "bg-studyBuddy-primary/10 text-studyBuddy-primary font-medium"
                      : "hover:bg-muted text-foreground/80"
                  }`}
                >
                  {section.section}
                </button>
              ))}
            </nav>
          </div>
        )}
        
        {/* Audio player */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <div className="rounded-full bg-studyBuddy-primary/10 p-6 w-32 h-32 flex items-center justify-center mx-auto mb-8">
              {isLoading ? (
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-studyBuddy-primary"></div>
              ) : (
                <button
                  onClick={togglePlayPause}
                  className="bg-studyBuddy-primary text-white rounded-full p-4 hover:bg-studyBuddy-primary/90 transition-colors"
                  disabled={isLoading}
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {formatTime(currentTime)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {isNaN(duration) ? "--:--" : formatTime(duration)}
                </span>
              </div>
              
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer"
                disabled={isLoading || !audioUrl}
              />
              
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
                    }
                  }}
                  disabled={isLoading}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="outline"
                  className="rounded-full px-6"
                  onClick={togglePlayPause}
                  disabled={isLoading || !audioUrl}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Play
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Math.min(
                        audioRef.current.duration,
                        audioRef.current.currentTime + 10
                      );
                    }
                  }}
                  disabled={isLoading}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {studyContent && studyContent.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-muted-foreground text-sm mb-2">
                  Select a section from the sidebar to generate audio for that specific content.
                </p>
                <Button
                  variant="outline"
                  className="text-studyBuddy-primary border-studyBuddy-primary/30"
                  onClick={() => generateAudioForSection(selectedSection)}
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : "Regenerate Audio"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;

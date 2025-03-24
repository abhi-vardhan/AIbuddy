
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

interface FlashcardViewerProps {
  cards: Flashcard[];
  title: string;
}

const FlashcardViewer = ({ cards, title }: FlashcardViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<number[]>([]);
  const [unknownCards, setUnknownCards] = useState<number[]>([]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const markAsKnown = () => {
    const currentCardId = cards[currentIndex].id;
    setKnownCards([...knownCards, currentCardId]);
    setUnknownCards(unknownCards.filter(id => id !== currentCardId));
    handleNext();
  };

  const markAsUnknown = () => {
    const currentCardId = cards[currentIndex].id;
    setUnknownCards([...unknownCards, currentCardId]);
    setKnownCards(knownCards.filter(id => id !== currentCardId));
    handleNext();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {cards.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-muted rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-studyBuddy-primary transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      <div 
        className="relative perspective-1000 w-full aspect-[3/2] max-w-3xl mx-auto mb-8 cursor-pointer"
        onClick={handleFlip}
      >
        <div
          className={`absolute w-full h-full transition-all duration-500 preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of card (Question) */}
          <div className="absolute w-full h-full backface-hidden rounded-xl border border-border shadow-sm bg-white p-8 flex flex-col items-center justify-center">
            <div className="text-xs uppercase tracking-wider text-studyBuddy-primary/70 mb-4">
              Question
            </div>
            <p className="text-xl md:text-2xl font-medium text-center">
              {cards[currentIndex].question}
            </p>
            <div className="mt-6 text-xs text-muted-foreground">
              Tap to reveal answer
            </div>
          </div>

          {/* Back of card (Answer) */}
          <div className="absolute w-full h-full backface-hidden rounded-xl border border-border shadow-sm bg-white p-8 flex flex-col items-center justify-center rotate-y-180">
            <div className="text-xs uppercase tracking-wider text-studyBuddy-secondary/70 mb-4">
              Answer
            </div>
            <p className="text-xl md:text-2xl font-medium text-center">
              {cards[currentIndex].answer}
            </p>
            <div className="mt-6 text-xs text-muted-foreground">
              Tap to see question
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="rounded-full border-studyBuddy-error text-studyBuddy-error hover:bg-studyBuddy-error/5"
            onClick={markAsUnknown}
          >
            <XCircle className="h-5 w-5 mr-1" />
            Don't Know
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-studyBuddy-success text-studyBuddy-success hover:bg-studyBuddy-success/5"
            onClick={markAsKnown}
          >
            <CheckCircle className="h-5 w-5 mr-1" />
            Know It
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={handleFlip}
          >
            <RotateCcw className="h-5 w-5 mr-1" />
            Flip
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-studyBuddy-primary/10 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Total</div>
          <div className="text-2xl font-semibold text-studyBuddy-primary">
            {cards.length}
          </div>
        </div>
        <div className="text-center p-4 bg-studyBuddy-success/10 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Known</div>
          <div className="text-2xl font-semibold text-studyBuddy-success">
            {knownCards.length}
          </div>
        </div>
        <div className="text-center p-4 bg-studyBuddy-error/10 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">To Review</div>
          <div className="text-2xl font-semibold text-studyBuddy-error">
            {unknownCards.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardViewer;


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

interface QuizGeneratorProps {
  title: string;
  questions: QuizQuestion[];
  onComplete: (score: number, totalQuestions: number) => void;
}

const QuizGenerator = ({ title, questions, onComplete }: QuizGeneratorProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{
    questionId: number;
    selectedIndex: number;
    isCorrect: boolean;
  }[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Add a guard to handle the case where questions is undefined or empty
  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl border border-border shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">{title || "Quiz"}</h2>
        <p className="text-center text-muted-foreground">No quiz questions available.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(optionIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    const answer = {
      questionId: currentQuestion.id,
      selectedIndex: selectedOption,
      isCorrect,
    };

    setUserAnswers([...userAnswers, answer]);
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz is completed
      setQuizCompleted(true);
      const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
      onComplete(correctAnswers, questions.length);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
    const scorePercentage = Math.round((correctAnswers / questions.length) * 100);
    
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl border border-border shadow-sm p-8 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center">Quiz Completed!</h2>
        
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle 
                className="text-muted opacity-25" 
                cx="50" cy="50" r="45" 
                stroke="currentColor" 
                strokeWidth="10" 
                fill="none"
              />
              <circle 
                className="text-studyBuddy-primary" 
                cx="50" cy="50" r="45" 
                stroke="currentColor" 
                strokeWidth="10" 
                fill="none" 
                strokeLinecap="round" 
                strokeDasharray={`${scorePercentage * 2.83}, 283`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-studyBuddy-primary">
              {scorePercentage}%
            </div>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground mb-2">
            You scored {correctAnswers} out of {questions.length} questions correctly.
          </p>
          
          {scorePercentage >= 80 ? (
            <p className="text-studyBuddy-success font-medium">Excellent work! You've mastered this material.</p>
          ) : scorePercentage >= 60 ? (
            <p className="text-studyBuddy-warning font-medium">Good job! A little more review would help.</p>
          ) : (
            <p className="text-studyBuddy-error font-medium">You might need more study time with this material.</p>
          )}
        </div>
        
        <div className="flex justify-center">
          <Button 
            className="bg-studyBuddy-primary hover:bg-studyBuddy-primary/90 rounded-full px-8"
            onClick={restartQuiz}
          >
            Restart Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-muted rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-studyBuddy-primary transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-8 mb-8 animate-fade-in">
        <h3 className="text-xl md:text-2xl font-medium mb-8">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedOption === index
                  ? isAnswerSubmitted
                    ? index === currentQuestion.correctAnswerIndex
                      ? "border-studyBuddy-success bg-studyBuddy-success/5"
                      : "border-studyBuddy-error bg-studyBuddy-error/5"
                    : "border-studyBuddy-primary bg-studyBuddy-primary/5"
                  : "border-border bg-white hover:bg-muted/50"
              }`}
              onClick={() => handleOptionSelect(index)}
              disabled={isAnswerSubmitted}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm ${
                  selectedOption === index
                    ? isAnswerSubmitted
                      ? index === currentQuestion.correctAnswerIndex
                        ? "bg-studyBuddy-success text-white"
                        : "bg-studyBuddy-error text-white"
                      : "bg-studyBuddy-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-foreground">{option}</span>
                
                {isAnswerSubmitted && selectedOption === index && index !== currentQuestion.correctAnswerIndex && (
                  <XCircle className="h-5 w-5 text-studyBuddy-error ml-auto" />
                )}
                
                {isAnswerSubmitted && index === currentQuestion.correctAnswerIndex && (
                  <CheckCircle className="h-5 w-5 text-studyBuddy-success ml-auto" />
                )}
              </div>
            </button>
          ))}
        </div>

        {isAnswerSubmitted && (
          <div className={`mt-6 p-4 rounded-lg ${
            selectedOption === currentQuestion.correctAnswerIndex
              ? "bg-studyBuddy-success/10 border border-studyBuddy-success/20"
              : "bg-studyBuddy-error/10 border border-studyBuddy-error/20"
          }`}>
            {selectedOption === currentQuestion.correctAnswerIndex ? (
              <p className="text-studyBuddy-success flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Correct! Well done.
              </p>
            ) : (
              <div className="text-studyBuddy-error">
                <p className="flex items-center">
                  <XCircle className="h-5 w-5 mr-2" />
                  Incorrect. The correct answer is Option {String.fromCharCode(65 + currentQuestion.correctAnswerIndex)}.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        {!isAnswerSubmitted ? (
          <Button
            className="bg-studyBuddy-primary hover:bg-studyBuddy-primary/90 rounded-full px-8"
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            className="bg-studyBuddy-primary hover:bg-studyBuddy-primary/90 rounded-full px-8"
            onClick={handleNextQuestion}
          >
            {currentQuestionIndex < questions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              'Finish Quiz'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;

'use client';

import { useState, useEffect } from 'react';

interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface MCQQuestion {
  id: string;
  type: 'mcq';
  text: string;
  options: MCQOption[];
}

interface CodingQuestion {
  id: string;
  type: 'coding';
  text: string;
  initialCode: string;
  expectedOutput: string;
  testCases: { input: string; expectedOutput: string }[];
}

type Question = MCQQuestion | CodingQuestion;

interface QuestionPanelProps {
  question: Question | undefined;
  onAnswerSubmit: (isCorrect: boolean) => void;
  isCompleted: boolean;
}

export default function QuestionPanel({
  question,
  onAnswerSubmit,
  isCompleted
}: QuestionPanelProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  
  // Reset selected option when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  }, [question]);
  
  // Handle option click
  const handleOptionClick = (optionId: string) => {
    if (isAnswerSubmitted || isCompleted) return;
    
    setSelectedOption(optionId);
    
    // For MCQ questions, submit answer immediately
    if (question?.type === 'mcq') {
      const mcqQuestion = question as MCQQuestion;
      const selectedOptionObj = mcqQuestion.options.find(opt => opt.id === optionId);
      
      if (selectedOptionObj) {
        setIsAnswerSubmitted(true);
        onAnswerSubmit(selectedOptionObj.isCorrect);
      }
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    if (question?.type !== 'mcq' || isAnswerSubmitted || isCompleted) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const mcqQuestion = question as MCQQuestion;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        
        if (!selectedOption) {
          setSelectedOption(mcqQuestion.options[0].id);
          return;
        }
        
        const currentIndex = mcqQuestion.options.findIndex(opt => opt.id === selectedOption);
        if (currentIndex === -1) return;
        
        let newIndex;
        if (e.key === 'ArrowLeft') {
          newIndex = (currentIndex - 1 + mcqQuestion.options.length) % mcqQuestion.options.length;
        } else {
          newIndex = (currentIndex + 1) % mcqQuestion.options.length;
        }
        
        setSelectedOption(mcqQuestion.options[newIndex].id);
      }
      
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        
        if (selectedOption) {
          const selectedOptionObj = mcqQuestion.options.find(opt => opt.id === selectedOption);
          
          if (selectedOptionObj) {
            setIsAnswerSubmitted(true);
            onAnswerSubmit(selectedOptionObj.isCorrect);
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [question, selectedOption, isAnswerSubmitted, isCompleted, onAnswerSubmit]);
  
  if (!question) {
    return (
      <div className="h-52 bg-background/90 border-t-2 border-primary/30 p-4">
        <p className="text-center text-gray-400">Loading question...</p>
      </div>
    );
  }
  
  return (
    <div className="h-52 bg-background/90 border-t-2 border-primary/30 p-4">
      {/* Question Text */}
      <div className="mb-6">
        <h3 className="font-pixel text-lg text-primary mb-2">Question:</h3>
        <p className="text-gray-300">{question.text}</p>
      </div>
      
      {/* MCQ Options */}
      {question.type === 'mcq' && (
        <div className="grid grid-cols-2 gap-4">
          {(question as MCQQuestion).options.map(option => (
            <button
              key={option.id}
              className={`px-4 py-2 rounded-md border transition-all duration-200 ${
                selectedOption === option.id
                  ? isAnswerSubmitted
                    ? option.isCorrect
                      ? 'bg-green-700/30 border-green-500 text-green-300'
                      : 'bg-red-700/30 border-red-500 text-red-300'
                    : 'bg-primary/20 border-primary text-primary'
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600'
              } ${isCompleted || isAnswerSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
              onClick={() => handleOptionClick(option.id)}
              disabled={isCompleted || isAnswerSubmitted}
            >
              {option.text}
            </button>
          ))}
        </div>
      )}
      
      {/* Coding Question (just the prompt, editor is in SpellBar) */}
      {question.type === 'coding' && (
        <div className="bg-gray-800/50 p-3 rounded-md">
          <p className="text-gray-300 text-sm">
            Write your code in the editor below to solve this problem.
          </p>
        </div>
      )}
    </div>
  );
}

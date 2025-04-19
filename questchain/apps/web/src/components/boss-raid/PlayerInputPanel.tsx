'use client';

import { useEffect, useRef } from 'react';

interface Question {
  id: string;
  text: string;
  answer: string | number;
  timeLimit: number; // in seconds
}

interface PlayerInputPanelProps {
  question: Question | null;
  timeRemaining: number;
  playerAnswer: string;
  setPlayerAnswer: (answer: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isCompleted: boolean;
}

export default function PlayerInputPanel({
  question,
  timeRemaining,
  playerAnswer,
  setPlayerAnswer,
  onSubmit,
  isSubmitting,
  isCompleted
}: PlayerInputPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when question changes
  useEffect(() => {
    if (question && inputRef.current && !isCompleted) {
      inputRef.current.focus();
    }
  }, [question, isCompleted]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerAnswer(e.target.value);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitting && !isCompleted && playerAnswer.trim()) {
      onSubmit();
    }
  };
  
  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting && !isCompleted && playerAnswer.trim()) {
      onSubmit();
    }
  };
  
  return (
    <div className="h-52 bg-background/90 border-t-2 border-primary/30 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Question */}
        <div className="mb-8">
          <h3 className="font-pixel text-lg text-primary mb-2">Next Question:</h3>
          <p className="text-gray-300 text-xl">
            {question ? question.text : 'Loading...'}
          </p>
        </div>
        
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          {/* Input Box */}
          <div className="relative w-32">
            <input
              ref={inputRef}
              type="text"
              value={playerAnswer}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full h-6 bg-gray-800 border border-gray-700 rounded px-2 py-4 text-white focus:outline-none focus:border-primary"
              placeholder="Answer..."
              disabled={isSubmitting || isCompleted}
            />
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className={`px-4 py-2 rounded-md font-pixel transition-all duration-200 ${
              isSubmitting || isCompleted
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary'
            }`}
            disabled={isSubmitting || isCompleted}
          >
            Submit
          </button>
          
          {/* Timer */}
          <div className={`ml-auto font-pixel text-lg ${
            timeRemaining <= 3 ? 'text-red-500 animate-pulse' : 'text-gray-300'
          }`}>
            <span className="mr-1">🞄</span>
            {timeRemaining.toString().padStart(2, '0')} s
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

interface CodingQuestion {
  id: string;
  type: 'coding';
  text: string;
  initialCode: string;
  expectedOutput: string;
  testCases: { input: string; expectedOutput: string }[];
}

interface SpellBarProps {
  question: CodingQuestion;
  onAnswerSubmit: (isCorrect: boolean) => void;
  isCompleted: boolean;
}

export default function SpellBar({
  question,
  onAnswerSubmit,
  isCompleted
}: SpellBarProps) {
  const [code, setCode] = useState(question.initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Reset code when question changes
  useEffect(() => {
    setCode(question.initialCode);
    setResult(null);
  }, [question]);
  
  // Handle code change
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };
  
  // Handle run code
  const handleRunCode = () => {
    if (isRunning || isCompleted) return;
    
    setIsRunning(true);
    setResult(null);
    
    // Simulate code execution (in a real implementation, this would actually run the code)
    setTimeout(() => {
      // For the demo, we'll check if the code contains the expected solution
      const isCorrect = code.includes('return a + b');
      
      setResult({
        success: isCorrect,
        message: isCorrect 
          ? 'All test cases passed!' 
          : 'Test failed: Expected sum function to return a + b',
      });
      
      setIsRunning(false);
      
      // Submit answer
      onAnswerSubmit(isCorrect);
    }, 1000);
  };
  
  return (
    <div className="bg-gray-800 border-t border-gray-700 p-4">
      {/* Code Editor */}
      <div className="mb-4">
        <textarea
          className="w-full h-28 bg-gray-900 text-gray-300 font-mono text-sm p-3 rounded-md border border-gray-700 focus:outline-none focus:border-primary"
          value={code}
          onChange={handleCodeChange}
          disabled={isRunning || isCompleted}
          spellCheck={false}
        ></textarea>
      </div>
      
      {/* Controls */}
      <div className="flex justify-between items-center">
        {/* Test Cases */}
        <div className="text-xs text-gray-400">
          <span className="mr-2">Test Cases:</span>
          {question.testCases.map((testCase, index) => (
            <span key={index} className="mr-2">
              {testCase.input} → {testCase.expectedOutput}
            </span>
          ))}
        </div>
        
        {/* Run Button */}
        <button
          className={`px-4 py-2 rounded-md font-pixel text-sm transition-all duration-200 ${
            isRunning
              ? 'bg-gray-700 text-gray-400 cursor-wait'
              : result
                ? result.success
                  ? 'bg-green-700 text-white'
                  : 'bg-red-700 text-white'
                : 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary'
          }`}
          onClick={handleRunCode}
          disabled={isRunning || isCompleted}
        >
          {isRunning ? 'Running...' : result ? (result.success ? '✓ Passed' : '✗ Failed') : 'Run Code'}
        </button>
      </div>
      
      {/* Result Message */}
      {result && (
        <div className={`mt-2 text-sm ${result.success ? 'text-green-400' : 'text-red-400'}`}>
          {result.message}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';
import ChallengeTopHUD from '@/components/challenge-room/ChallengeTopHUD';
import ChallengeArena from '@/components/challenge-room/ChallengeArena';
import QuestionPanel from '@/components/challenge-room/QuestionPanel';
import SpellBar from '@/components/challenge-room/SpellBar';
import BottomNavigation from '@/components/challenge-room/BottomNavigation';
import CompletionModal from '@/components/challenge-room/CompletionModal';

// Define question types
type MCQOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type MCQQuestion = {
  id: string;
  type: 'mcq';
  text: string;
  options: MCQOption[];
};

type CodingQuestion = {
  id: string;
  type: 'coding';
  text: string;
  initialCode: string;
  expectedOutput: string;
  testCases: { input: string; expectedOutput: string }[];
};

type Question = MCQQuestion | CodingQuestion;

// Define biome types
type BiomeType = 'starter' | 'binary' | 'algebra' | 'crypto' | 'logic' | 'network';

// Define challenge data
interface ChallengeData {
  id: string;
  name: string;
  biome: BiomeType;
  timeLimit: number; // in seconds
  phantomHP: number;
  questions: Question[];
  xpReward: number;
}

export default function ChallengeRoomPage() {
  const router = useRouter();
  const params = useParams();
  const challengeId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [phantomHP, setPhantomHP] = useState(0);
  const [playerXP, setPlayerXP] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [showIncorrectAnimation, setShowIncorrectAnimation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  
  // Simulate loading assets with progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Simulate fetching challenge data
          setTimeout(() => {
            // Mock challenge data
            const mockChallengeData: ChallengeData = {
              id: challengeId,
              name: 'JavaScript Basics',
              biome: 'binary',
              timeLimit: 60, // 60 seconds
              phantomHP: 3,
              questions: [
                {
                  id: 'q1',
                  type: 'mcq',
                  text: 'What is the output of 3 + \'2\' in JavaScript?',
                  options: [
                    { id: 'a', text: '32', isCorrect: true },
                    { id: 'b', text: '5', isCorrect: false },
                    { id: 'c', text: 'Error', isCorrect: false },
                    { id: 'd', text: 'NaN', isCorrect: false },
                  ],
                },
                {
                  id: 'q2',
                  type: 'mcq',
                  text: 'Which of the following is NOT a primitive type in JavaScript?',
                  options: [
                    { id: 'a', text: 'string', isCorrect: false },
                    { id: 'b', text: 'boolean', isCorrect: false },
                    { id: 'c', text: 'array', isCorrect: true },
                    { id: 'd', text: 'number', isCorrect: false },
                  ],
                },
                {
                  id: 'q3',
                  type: 'coding',
                  text: 'Write a function that returns the sum of two numbers.',
                  initialCode: 'function sum(a, b) {\n  // Your code here\n}',
                  expectedOutput: 'function that returns a + b',
                  testCases: [
                    { input: 'sum(2, 3)', expectedOutput: '5' },
                    { input: 'sum(-1, 1)', expectedOutput: '0' },
                    { input: 'sum(0, 0)', expectedOutput: '0' },
                  ],
                },
              ],
              xpReward: 10,
            };
            
            setChallengeData(mockChallengeData);
            setTimeRemaining(mockChallengeData.timeLimit);
            setPhantomHP(mockChallengeData.phantomHP);
            setPlayerXP(350); // Mock player XP
            setPlayerLevel(2); // Mock player level
            setIsLoading(false);
          }, 500);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [challengeId]);
  
  // Timer countdown
  useEffect(() => {
    if (isLoading || isCompleted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleChallengeEnd(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isLoading, isCompleted]);
  
  // Handle screen shake effect
  useEffect(() => {
    if (screenShake) {
      const timer = setTimeout(() => {
        setScreenShake(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [screenShake]);
  
  // Get current question
  const currentQuestion = challengeData?.questions[currentQuestionIndex];
  
  // Handle answer submission
  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      // Show correct animation
      setShowCorrectAnimation(true);
      setScreenShake(true);
      
      // Decrease phantom HP
      setPhantomHP(prev => {
        const newHP = prev - 1;
        
        // Check if challenge is completed
        if (newHP <= 0) {
          handleChallengeEnd(true);
        }
        
        return newHP;
      });
      
      // Move to next question if available
      setTimeout(() => {
        setShowCorrectAnimation(false);
        
        if (currentQuestionIndex < (challengeData?.questions.length || 0) - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        }
      }, 1500);
    } else {
      // Show incorrect animation
      setShowIncorrectAnimation(true);
      
      // Deduct time
      setTimeRemaining(prev => Math.max(0, prev - 5));
      
      setTimeout(() => {
        setShowIncorrectAnimation(false);
      }, 1000);
    }
  };
  
  // Handle hint usage
  const handleUseHint = () => {
    // Deduct XP for hint
    setPlayerXP(prev => Math.max(0, prev - 2));
    
    // Log hint usage (would be on-chain in real implementation)
    console.log('Hint used for question:', currentQuestion?.id);
    
    // Show hint (in a real implementation, this would show an actual hint)
    alert('Hint: Think about type coercion in JavaScript!');
  };
  
  // Handle challenge end
  const handleChallengeEnd = (success: boolean) => {
    setIsCompleted(true);
    setIsSuccess(success);
    
    // Calculate XP reward
    const xpEarned = success ? challengeData?.xpReward || 0 : Math.floor((challengeData?.xpReward || 0) / 2);
    
    // Update player XP
    setPlayerXP(prev => prev + xpEarned);
    
    // Show completion modal
    setTimeout(() => {
      setShowCompletionModal(true);
    }, 1000);
    
    // In a real implementation, this would trigger the on-chain claim_xp function
    console.log('Challenge completed:', success ? 'Success' : 'Failed');
    console.log('XP earned:', xpEarned);
  };
  
  // Handle quit
  const handleQuit = () => {
    if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
      router.push('/world-map');
    }
  };
  
  // Handle continue after completion
  const handleContinue = () => {
    router.push('/world-map');
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-gray-900">
      {isLoading ? (
        <LoadingScreen progress={loadingProgress} />
      ) : (
        <div className={`flex flex-col w-full max-w-3xl mx-auto ${screenShake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
          {/* Top HUD */}
          <ChallengeTopHUD 
            playerLevel={playerLevel}
            playerXP={playerXP}
            timeRemaining={timeRemaining}
          />
          
          {/* Challenge Arena */}
          <ChallengeArena 
            biome={challengeData?.biome || 'starter'}
            phantomHP={phantomHP}
            maxPhantomHP={challengeData?.phantomHP || 3}
            showCorrectAnimation={showCorrectAnimation}
            showIncorrectAnimation={showIncorrectAnimation}
            isCompleted={isCompleted}
            isSuccess={isSuccess}
          />
          
          {/* Question Panel */}
          <QuestionPanel 
            question={currentQuestion}
            onAnswerSubmit={handleAnswerSubmit}
            isCompleted={isCompleted}
          />
          
          {/* Spell Bar (only for coding questions) */}
          {currentQuestion?.type === 'coding' && (
            <SpellBar 
              question={currentQuestion as CodingQuestion}
              onAnswerSubmit={handleAnswerSubmit}
              isCompleted={isCompleted}
            />
          )}
          
          {/* Bottom Navigation */}
          <BottomNavigation 
            onQuit={handleQuit}
            onUseHint={handleUseHint}
            onReportIssue={() => alert('Issue reported!')}
            isCompleted={isCompleted}
          />
          
          {/* Completion Modal */}
          {showCompletionModal && (
            <CompletionModal 
              isSuccess={isSuccess}
              xpEarned={isSuccess ? challengeData?.xpReward || 0 : Math.floor((challengeData?.xpReward || 0) / 2)}
              onContinue={handleContinue}
            />
          )}
        </div>
      )}
    </main>
  );
}

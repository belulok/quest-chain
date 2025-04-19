'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';
import RaidHeader from '@/components/boss-raid/RaidHeader';
import RaidArena from '@/components/boss-raid/RaidArena';
import QuestionFeed from '@/components/boss-raid/QuestionFeed';
import PlayerInputPanel from '@/components/boss-raid/PlayerInputPanel';
import RewardsBar from '@/components/boss-raid/RewardsBar';
import RaidCompletionModal from '@/components/boss-raid/RaidCompletionModal';

// Define player types
interface Player {
  id: string;
  name: string;
  avatar: string;
  level: number;
  damage: number;
}

// Define question types
interface Question {
  id: string;
  text: string;
  answer: string | number;
  timeLimit: number; // in seconds
}

// Define raid data
interface RaidData {
  id: string;
  bossName: string;
  bossHP: number;
  maxBossHP: number;
  duration: number; // in hours
  players: Player[];
  xpReward: number;
  lootChest: string;
}

// Define feed entry types
interface FeedEntry {
  id: string;
  playerId: string;
  playerName: string;
  question: string;
  answer?: string | number;
  isCorrect: boolean;
  timestamp: number;
}

export default function BossRaidPage() {
  const router = useRouter();
  const params = useParams();
  const raidId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [raidData, setRaidData] = useState<RaidData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [bossHP, setBossHP] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [feedEntries, setFeedEntries] = useState<FeedEntry[]>([]);
  const [latency, setLatency] = useState(0.74);
  const [isRaidCompleted, setIsRaidCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [playerAnswer, setPlayerAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastDamage, setLastDamage] = useState<{amount: number, x: number, y: number} | null>(null);
  const [showWhiteFlash, setShowWhiteFlash] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Refs
  const playerNameRef = useRef('Sebastian'); // Mock player name
  const questionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Simulate loading assets with progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Simulate fetching raid data
          setTimeout(() => {
            // Mock raid data
            const mockRaidData: RaidData = {
              id: raidId,
              bossName: 'Omega Phantom',
              bossHP: 8420,
              maxBossHP: 10000,
              duration: 64, // 64 hours
              players: [
                { id: 'p1', name: 'Sebastian', avatar: '👤', level: 5, damage: 0 },
                { id: 'p2', name: 'Grace', avatar: '👤', level: 4, damage: 0 },
                { id: 'p3', name: 'Alex', avatar: '👤', level: 6, damage: 0 },
                { id: 'p4', name: 'Maya', avatar: '👤', level: 3, damage: 0 },
                { id: 'p5', name: 'Liam', avatar: '👤', level: 7, damage: 0 },
                { id: 'p6', name: 'Zoe', avatar: '👤', level: 5, damage: 0 },
                { id: 'p7', name: 'Ethan', avatar: '👤', level: 4, damage: 0 },
                { id: 'p8', name: 'Olivia', avatar: '👤', level: 6, damage: 0 },
                { id: 'p9', name: 'Noah', avatar: '👤', level: 5, damage: 0 },
                { id: 'p10', name: 'Emma', avatar: '👤', level: 7, damage: 0 },
                { id: 'p11', name: 'Jackson', avatar: '👤', level: 4, damage: 0 },
                { id: 'p12', name: 'Sophia', avatar: '👤', level: 6, damage: 0 },
              ],
              xpReward: 300,
              lootChest: 'Beta Loot Chest',
            };
            
            setRaidData(mockRaidData);
            setBossHP(mockRaidData.bossHP);
            setPlayers(mockRaidData.players);
            
            // Mock feed entries
            const mockFeedEntries: FeedEntry[] = [
              { 
                id: 'f1', 
                playerId: 'p1', 
                playerName: 'Sebastian', 
                question: '2×8', 
                answer: '16', 
                isCorrect: true, 
                timestamp: Date.now() - 5000 
              },
              { 
                id: 'f2', 
                playerId: 'p2', 
                playerName: 'Grace', 
                question: '3+5', 
                isCorrect: false, 
                timestamp: Date.now() - 3000 
              },
              { 
                id: 'f3', 
                playerId: 'p3', 
                playerName: 'Alex', 
                question: '9-4', 
                answer: '5', 
                isCorrect: true, 
                timestamp: Date.now() - 1000 
              },
            ];
            
            setFeedEntries(mockFeedEntries);
            setIsLoading(false);
            
            // Start question cycle
            startQuestionCycle();
          }, 500);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [raidId]);
  
  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (questionIntervalRef.current) {
        clearInterval(questionIntervalRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);
  
  // Start question cycle
  const startQuestionCycle = () => {
    // Generate first question
    generateNewQuestion();
    
    // Set up question interval (new question every 6 seconds)
    questionIntervalRef.current = setInterval(() => {
      generateNewQuestion();
    }, 6000);
  };
  
  // Generate a new question
  const generateNewQuestion = () => {
    // Clear any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // Reset player answer
    setPlayerAnswer('');
    setIsSubmitting(false);
    
    // Generate a random question
    const questionTypes = [
      { 
        generator: () => {
          const a = Math.floor(Math.random() * 10) + 1;
          const b = Math.floor(Math.random() * 10) + 1;
          return { 
            text: `${a}×${b}`, 
            answer: a * b 
          };
        }
      },
      { 
        generator: () => {
          const a = Math.floor(Math.random() * 20) + 1;
          const b = Math.floor(Math.random() * 10) + 1;
          return { 
            text: `${a}+${b}`, 
            answer: a + b 
          };
        }
      },
      { 
        generator: () => {
          const result = Math.floor(Math.random() * 10) + 5;
          const b = Math.floor(Math.random() * 5) + 1;
          const a = result + b;
          return { 
            text: `${a}-${b}`, 
            answer: result 
          };
        }
      },
      { 
        generator: () => {
          const x = Math.floor(Math.random() * 10) + 1;
          return { 
            text: `f(x) = 2x — find f(${x})`, 
            answer: 2 * x 
          };
        }
      },
    ];
    
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    const { text, answer } = randomType.generator();
    
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      text,
      answer,
      timeLimit: 6, // 6 seconds
    };
    
    setCurrentQuestion(newQuestion);
    setTimeRemaining(newQuestion.timeLimit);
    
    // Start timer countdown
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up, record a miss if player hasn't answered
          if (!isSubmitting) {
            recordMiss();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Handle answer submission
  const handleAnswerSubmit = () => {
    if (!currentQuestion || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Check if answer is correct
    const isCorrect = playerAnswer.trim() === currentQuestion.answer.toString();
    
    if (isCorrect) {
      // Calculate damage (random between 30-50 for demo)
      const damage = Math.floor(Math.random() * 21) + 30;
      
      // Update boss HP
      setBossHP(prev => {
        const newHP = Math.max(0, prev - damage);
        
        // Check if boss is defeated
        if (newHP === 0) {
          handleRaidCompletion();
        } else if (prev > 0 && Math.floor((prev / (raidData?.maxBossHP || 10000)) * 10) > 
                   Math.floor((newHP / (raidData?.maxBossHP || 10000)) * 10)) {
          // Play cheer SFX every 10% HP drop
          console.log('Crowd cheers!');
        }
        
        return newHP;
      });
      
      // Show damage number
      setLastDamage({
        amount: damage,
        x: Math.random() * 100 + 350, // Random position above boss
        y: Math.random() * 50 + 150,
      });
      
      setTimeout(() => {
        setLastDamage(null);
      }, 1000);
      
      // Record hit in feed
      const newFeedEntry: FeedEntry = {
        id: `f${Date.now()}`,
        playerId: 'p1', // Current player
        playerName: playerNameRef.current,
        question: currentQuestion.text,
        answer: playerAnswer,
        isCorrect: true,
        timestamp: Date.now(),
      };
      
      setFeedEntries(prev => [newFeedEntry, ...prev].slice(0, 20));
    } else {
      // Record miss in feed
      recordMiss();
    }
  };
  
  // Record a miss in the feed
  const recordMiss = () => {
    if (!currentQuestion) return;
    
    const newFeedEntry: FeedEntry = {
      id: `f${Date.now()}`,
      playerId: 'p1', // Current player
      playerName: playerNameRef.current,
      question: currentQuestion.text,
      isCorrect: false,
      timestamp: Date.now(),
    };
    
    setFeedEntries(prev => [newFeedEntry, ...prev].slice(0, 20));
  };
  
  // Handle raid completion
  const handleRaidCompletion = () => {
    // Clear intervals
    if (questionIntervalRef.current) {
      clearInterval(questionIntervalRef.current);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    setIsRaidCompleted(true);
    
    // Show white flash
    setShowWhiteFlash(true);
    setTimeout(() => {
      setShowWhiteFlash(false);
    }, 500);
    
    // Show confetti
    setShowConfetti(true);
    
    // Show completion modal after a delay
    setTimeout(() => {
      setShowCompletionModal(true);
    }, 2000);
  };
  
  // Handle continue after completion
  const handleContinue = () => {
    router.push('/world-map');
  };
  
  // Simulate other players attacking
  useEffect(() => {
    if (isLoading || isRaidCompleted) return;
    
    const interval = setInterval(() => {
      // Random chance for other players to attack
      const randomPlayer = players.find(p => p.id !== 'p1');
      if (randomPlayer && Math.random() > 0.7) {
        // Random damage between 20-40
        const damage = Math.floor(Math.random() * 21) + 20;
        
        // Update boss HP
        setBossHP(prev => {
          const newHP = Math.max(0, prev - damage);
          
          // Check if boss is defeated
          if (newHP === 0) {
            handleRaidCompletion();
          }
          
          return newHP;
        });
        
        // Show damage number
        setLastDamage({
          amount: damage,
          x: Math.random() * 100 + 350, // Random position above boss
          y: Math.random() * 50 + 150,
        });
        
        setTimeout(() => {
          setLastDamage(null);
        }, 1000);
        
        // Add to feed
        const questions = ['3×7', '15-8', '4+9', 'f(4)'];
        const answers = ['21', '7', '13', '8'];
        const randomIndex = Math.floor(Math.random() * questions.length);
        
        const newFeedEntry: FeedEntry = {
          id: `f${Date.now()}`,
          playerId: randomPlayer.id,
          playerName: randomPlayer.name,
          question: questions[randomIndex],
          answer: answers[randomIndex],
          isCorrect: true,
          timestamp: Date.now(),
        };
        
        setFeedEntries(prev => [newFeedEntry, ...prev].slice(0, 20));
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isLoading, isRaidCompleted, players]);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-gray-900">
      {isLoading ? (
        <LoadingScreen progress={loadingProgress} />
      ) : (
        <div className="flex flex-col w-full max-w-6xl mx-auto relative">
          {/* White Flash Effect */}
          {showWhiteFlash && (
            <div className="fixed inset-0 bg-white z-50 animate-[flash_0.5s_ease-out]"></div>
          )}
          
          {/* Raid Header */}
          <RaidHeader 
            bossName={raidData?.bossName || 'Unknown Boss'}
            bossHP={bossHP}
            maxBossHP={raidData?.maxBossHP || 10000}
            playersOnline={raidData?.players.length || 0}
            latency={latency}
          />
          
          {/* Main Content Area */}
          <div className="flex relative">
            {/* Question Feed (Left Overlay) */}
            <div className="w-52 bg-background/90 border-r border-primary/30 h-96 z-10">
              <QuestionFeed feedEntries={feedEntries} />
            </div>
            
            {/* Raid Arena */}
            <div className="flex-grow">
              <RaidArena 
                players={players}
                bossHP={bossHP}
                maxBossHP={raidData?.maxBossHP || 10000}
                isCompleted={isRaidCompleted}
                lastDamage={lastDamage}
                showConfetti={showConfetti}
              />
            </div>
          </div>
          
          {/* Player Input Panel */}
          <PlayerInputPanel 
            question={currentQuestion}
            timeRemaining={timeRemaining}
            playerAnswer={playerAnswer}
            setPlayerAnswer={setPlayerAnswer}
            onSubmit={handleAnswerSubmit}
            isSubmitting={isSubmitting}
            isCompleted={isRaidCompleted}
          />
          
          {/* Rewards Bar */}
          <RewardsBar 
            xpReward={raidData?.xpReward || 0}
            lootChest={raidData?.lootChest || ''}
          />
          
          {/* Completion Modal */}
          {showCompletionModal && (
            <RaidCompletionModal 
              xpEarned={raidData?.xpReward || 0}
              lootChest={raidData?.lootChest || ''}
              onContinue={handleContinue}
            />
          )}
        </div>
      )}
    </main>
  );
}

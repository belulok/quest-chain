'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ParallaxBackground from '@/components/ParallaxBackground';
import LoadingScreen from '@/components/LoadingScreen';
import QuestBoardHeader from '@/components/quest-board/QuestBoardHeader';
import QuestBoardTabs from '@/components/quest-board/QuestBoardTabs';
import QuestPackGrid from '@/components/quest-board/QuestPackGrid';
import QuestBoardSidebar from '@/components/quest-board/QuestBoardSidebar';
import QuestBoardCart from '@/components/quest-board/QuestBoardCart';
import QuestPackModal from '@/components/quest-board/QuestPackModal';

export interface QuestPack {
  id: string;
  name: string;
  description: string;
  category: 'coding' | 'math' | 'logic' | 'esl';
  level: { min: number; max: number };
  xpReward: number;
  price: number;
  currency: 'RM' | 'SUI';
  isFree: boolean;
  isOwned: boolean;
  thumbnail: string;
  creator: string;
  sampleQuestion: string;
}

export default function QuestBoardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [questPacks, setQuestPacks] = useState<QuestPack[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<QuestPack[]>([]);
  const [selectedPack, setSelectedPack] = useState<QuestPack | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Simulate loading assets with progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500); // Show 'Ready!' for a moment
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate fetching quest packs
    setTimeout(() => {
      setQuestPacks([
        {
          id: 'qp1',
          name: 'Arrays 101',
          description: 'Master the fundamentals of arrays with hands-on exercises and challenges.',
          category: 'coding',
          level: { min: 1, max: 3 },
          xpReward: 10,
          price: 5,
          currency: 'RM',
          isFree: false,
          isOwned: true,
          thumbnail: '/assets/quest-arrays.png',
          creator: 'CodeMaster',
          sampleQuestion: 'Write a function to find the maximum value in an array.'
        },
        {
          id: 'qp2',
          name: 'Variables Drill',
          description: 'Practice variable declaration, assignment, and scope in various programming languages.',
          category: 'coding',
          level: { min: 1, max: 2 },
          xpReward: 8,
          price: 0,
          currency: 'RM',
          isFree: true,
          isOwned: true,
          thumbnail: '/assets/quest-variables.png',
          creator: 'CodeMaster',
          sampleQuestion: 'What is the difference between let, const, and var in JavaScript?'
        },
        {
          id: 'qp3',
          name: 'Algebra Basics',
          description: 'Learn fundamental algebraic concepts through interactive problems.',
          category: 'math',
          level: { min: 2, max: 4 },
          xpReward: 15,
          price: 8,
          currency: 'RM',
          isFree: false,
          isOwned: false,
          thumbnail: '/assets/quest-algebra.png',
          creator: 'MathWizard',
          sampleQuestion: 'Solve for x: 2x + 5 = 15'
        },
        {
          id: 'qp4',
          name: 'Logic Gates',
          description: 'Understand the fundamentals of digital logic and boolean algebra.',
          category: 'logic',
          level: { min: 3, max: 5 },
          xpReward: 20,
          price: 12,
          currency: 'RM',
          isFree: false,
          isOwned: false,
          thumbnail: '/assets/quest-logic.png',
          creator: 'LogicPro',
          sampleQuestion: 'What is the output of an XOR gate when both inputs are 1?'
        },
        {
          id: 'qp5',
          name: 'English Idioms',
          description: 'Learn common English idioms and their meanings through interactive exercises.',
          category: 'esl',
          level: { min: 2, max: 4 },
          xpReward: 12,
          price: 6,
          currency: 'RM',
          isFree: false,
          isOwned: false,
          thumbnail: '/assets/quest-esl.png',
          creator: 'LanguageMaster',
          sampleQuestion: 'What does the idiom "break a leg" mean?'
        },
        {
          id: 'qp6',
          name: 'Binary Basics',
          description: 'Learn the fundamentals of binary operations and bit manipulation.',
          category: 'coding',
          level: { min: 2, max: 3 },
          xpReward: 10,
          price: 5,
          currency: 'RM',
          isFree: false,
          isOwned: false,
          thumbnail: '/assets/quest-binary.png',
          creator: 'BinaryBaron',
          sampleQuestion: 'Convert the decimal number 42 to binary.'
        },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter quest packs based on category and search query
  const filteredPacks = questPacks.filter(pack => {
    // Filter by category
    if (activeCategory !== 'all' && pack.category !== activeCategory) {
      return false;
    }

    // Filter by search query
    if (searchQuery && !pack.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Handle adding pack to cart
  const addToCart = (pack: QuestPack) => {
    if (!pack.isOwned && !cartItems.some(item => item.id === pack.id)) {
      setCartItems([...cartItems, pack]);
    }
  };

  // Handle removing pack from cart
  const removeFromCart = (packId: string) => {
    setCartItems(cartItems.filter(item => item.id !== packId));
  };

  // Handle pack click to show modal
  const handlePackClick = (pack: QuestPack) => {
    setSelectedPack(pack);
    setShowModal(true);
  };

  // Calculate total cart price
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <main className="flex min-h-screen flex-col relative overflow-hidden">
      {isLoading && <LoadingScreen progress={loadingProgress} />}

      {/* Parallax Background */}
      <ParallaxBackground />

      <div className="flex flex-col h-screen relative z-10">
        {/* Top Banner */}
        <QuestBoardHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Category Tabs */}
        <QuestBoardTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Quest Packs Grid */}
          <div className="flex-grow overflow-y-auto p-4">
            <QuestPackGrid
              questPacks={filteredPacks}
              onPackClick={handlePackClick}
              addToCart={addToCart}
            />
          </div>

          {/* Right Sidebar */}
          <div className="w-52 bg-background/80 border-l-2 border-primary/30 p-4 hidden md:block">
            <QuestBoardSidebar ownedPacks={questPacks.filter(pack => pack.isOwned)} />
          </div>
        </div>

        {/* Cart Bar */}
        {cartItems.length > 0 && (
          <QuestBoardCart
            cartItems={cartItems}
            cartTotal={cartTotal}
            removeFromCart={removeFromCart}
            currency="RM"
          />
        )}

        {/* Navigation Buttons (Mobile Only) */}
        <div className="md:hidden flex justify-between p-4 bg-background/80 border-t-2 border-primary/30">
          <Link
            href="/world-map"
            className="font-pixel py-2 px-4 text-sm border-2 border-primary bg-primary/20 text-primary"
          >
            ← MAP
          </Link>

          <Link
            href="/"
            className="font-pixel py-2 px-4 text-sm border-2 border-gray-500 bg-gray-500/20 text-gray-300"
          >
            HOME
          </Link>
        </div>
      </div>

      {/* Quest Pack Modal */}
      {showModal && selectedPack && (
        <QuestPackModal
          pack={selectedPack}
          onClose={() => setShowModal(false)}
          addToCart={addToCart}
        />
      )}
    </main>
  );
}

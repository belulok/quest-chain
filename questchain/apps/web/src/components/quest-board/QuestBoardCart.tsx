'use client';

import { useState } from 'react';
import { QuestPack } from '@/app/quest-board/page';

interface QuestBoardCartProps {
  cartItems: QuestPack[];
  cartTotal: number;
  removeFromCart: (packId: string) => void;
  currency: string;
}

export default function QuestBoardCart({ 
  cartItems, 
  cartTotal, 
  removeFromCart,
  currency
}: QuestBoardCartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      setShowConfetti(true);
      
      // Hide confetti after 3 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      
      console.log('Checkout completed!');
    }, 1500);
  };
  
  return (
    <div className="h-12 bg-background/90 border-t-2 border-primary/30 flex items-center justify-between px-4">
      {/* Cart Info */}
      <div className="flex items-center">
        <span className="font-pixel text-sm text-gray-300 mr-2">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
        </span>
        <span className="font-pixel text-sm text-primary">
          • {currency} {cartTotal}
        </span>
      </div>
      
      {/* Checkout Button */}
      <button 
        className={`font-pixel text-sm py-1 px-4 rounded transition-all duration-200 ${
          isCheckingOut 
            ? 'bg-gray-600 text-gray-300 cursor-wait' 
            : 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary'
        }`}
        onClick={handleCheckout}
        disabled={isCheckingOut}
      >
        {isCheckingOut ? 'Processing...' : 'Checkout →'}
      </button>
      
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-[fadeIn_0.3s_ease-out]">
              🎉
            </div>
          </div>
          <div className="absolute top-10 left-1/4 text-4xl animate-float">
            🎊
          </div>
          <div className="absolute top-20 right-1/3 text-5xl animate-float" style={{ animationDelay: '0.5s' }}>
            ✨
          </div>
          <div className="absolute bottom-1/3 right-1/4 text-4xl animate-float" style={{ animationDelay: '0.2s' }}>
            🎉
          </div>
          <div className="absolute bottom-1/4 left-1/3 text-5xl animate-float" style={{ animationDelay: '0.7s' }}>
            🎊
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

interface ChallengeArenaProps {
  biome: 'starter' | 'binary' | 'algebra' | 'crypto' | 'logic' | 'network';
  phantomHP: number;
  maxPhantomHP: number;
  showCorrectAnimation: boolean;
  showIncorrectAnimation: boolean;
  isCompleted: boolean;
  isSuccess: boolean;
}

export default function ChallengeArena({
  biome,
  phantomHP,
  maxPhantomHP,
  showCorrectAnimation,
  showIncorrectAnimation,
  isCompleted,
  isSuccess
}: ChallengeArenaProps) {
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [phantomFrame, setPhantomFrame] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 10 - 5;
      const y = (e.clientY / window.innerHeight) * 10 - 5;
      setParallaxOffset({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Phantom idle animation
  useEffect(() => {
    if (isCompleted) return;
    
    const interval = setInterval(() => {
      setPhantomFrame(prev => (prev + 1) % 4);
    }, 250);
    
    return () => clearInterval(interval);
  }, [isCompleted]);
  
  // Show confetti on successful completion
  useEffect(() => {
    if (isCompleted && isSuccess) {
      setShowConfetti(true);
      
      // Hide confetti after 3 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isCompleted, isSuccess]);
  
  // Get biome background color
  const getBiomeBackground = () => {
    switch (biome) {
      case 'starter': return 'bg-green-900';
      case 'binary': return 'bg-blue-900';
      case 'algebra': return 'bg-purple-900';
      case 'crypto': return 'bg-yellow-900';
      case 'logic': return 'bg-red-900';
      case 'network': return 'bg-cyan-900';
      default: return 'bg-gray-900';
    }
  };
  
  // Get phantom color
  const getPhantomColor = () => {
    switch (biome) {
      case 'starter': return 'text-green-500';
      case 'binary': return 'text-blue-500';
      case 'algebra': return 'text-purple-500';
      case 'crypto': return 'text-yellow-500';
      case 'logic': return 'text-red-500';
      case 'network': return 'text-cyan-500';
      default: return 'text-gray-500';
    }
  };
  
  return (
    <div 
      className={`relative w-full h-80 ${getBiomeBackground()} overflow-hidden`}
      style={{ 
        perspective: '1000px',
      }}
    >
      {/* Background Layer 1 (Far) */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ 
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          transform: `translateX(${parallaxOffset.x * 0.5}px) translateY(${parallaxOffset.y * 0.5}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      ></div>
      
      {/* Background Layer 2 (Mid) */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ 
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          transform: `translateX(${parallaxOffset.x}px) translateY(${parallaxOffset.y}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      ></div>
      
      {/* Phantom HP Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32">
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-500 transition-all duration-300"
            style={{ width: `${(phantomHP / maxPhantomHP) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Phantom */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div 
          className={`text-6xl ${getPhantomColor()} ${
            showCorrectAnimation ? 'animate-[hit_0.5s_ease-in-out]' : 
            isCompleted && !isSuccess ? 'animate-[victory_1s_ease-in-out]' : 
            isCompleted && isSuccess ? 'animate-[defeat_1s_ease-in-out]' : 
            'animate-[float_3s_ease-in-out_infinite]'
          }`}
        >
          {/* Phantom sprite (using emoji as placeholder) */}
          👻
        </div>
      </div>
      
      {/* Correct Animation */}
      {showCorrectAnimation && (
        <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 animate-[fireball_1s_ease-in-out]">
          <div className="text-4xl text-yellow-500">🔥</div>
        </div>
      )}
      
      {/* Incorrect Animation */}
      {showIncorrectAnimation && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-[puff_0.5s_ease-out]">
          <div className="text-4xl text-red-500">❌</div>
        </div>
      )}
      
      {/* Confetti Effect */}
      {showConfetti && (
        <>
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
        </>
      )}
    </div>
  );
}

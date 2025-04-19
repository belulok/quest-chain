'use client';

import { useState, useEffect } from 'react';

interface Player {
  id: string;
  name: string;
  avatar: string;
  level: number;
  damage: number;
}

interface RaidArenaProps {
  players: Player[];
  bossHP: number;
  maxBossHP: number;
  isCompleted: boolean;
  lastDamage: {amount: number, x: number, y: number} | null;
  showConfetti: boolean;
}

export default function RaidArena({
  players,
  bossHP,
  maxBossHP,
  isCompleted,
  lastDamage,
  showConfetti
}: RaidArenaProps) {
  const [bossFrame, setBossFrame] = useState(0);
  const [showHitAnimation, setShowHitAnimation] = useState(false);
  const [bossState, setBossState] = useState<'idle' | 'hit' | 'death'>('idle');
  
  // Boss animation frames
  useEffect(() => {
    if (isCompleted) {
      setBossState('death');
      return;
    }
    
    const interval = setInterval(() => {
      if (bossState === 'idle') {
        setBossFrame(prev => (prev + 1) % 6); // 6 idle frames
      } else if (bossState === 'hit') {
        setBossFrame(prev => {
          const nextFrame = prev + 1;
          if (nextFrame >= 4) { // 4 hit frames
            setBossState('idle');
            return 0;
          }
          return nextFrame;
        });
      } else if (bossState === 'death') {
        setBossFrame(prev => {
          const nextFrame = prev + 1;
          if (nextFrame >= 8) { // 8 death frames
            clearInterval(interval);
            return 7; // Stay on last frame
          }
          return nextFrame;
        });
      }
    }, 150);
    
    return () => clearInterval(interval);
  }, [bossState, isCompleted]);
  
  // Show hit animation when damage is dealt
  useEffect(() => {
    if (lastDamage && !isCompleted) {
      setShowHitAnimation(true);
      setBossState('hit');
      
      setTimeout(() => {
        setShowHitAnimation(false);
      }, 500);
    }
  }, [lastDamage, isCompleted]);
  
  // Split players into left and right sides
  const leftPlayers = players.slice(0, 6);
  const rightPlayers = players.slice(6, 12);
  
  return (
    <div className="relative w-full h-96 bg-gray-900 overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ 
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      ></div>
      
      {/* Left Side Players */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
        <div className="grid grid-rows-3 grid-cols-2 gap-4">
          {leftPlayers.map((player, index) => (
            <div 
              key={player.id}
              className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center"
              title={`${player.name} (Lv ${player.level})`}
            >
              <span className="text-lg">{player.avatar}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right Side Players */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
        <div className="grid grid-rows-3 grid-cols-2 gap-4">
          {rightPlayers.map((player, index) => (
            <div 
              key={player.id}
              className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center"
              title={`${player.name} (Lv ${player.level})`}
            >
              <span className="text-lg">{player.avatar}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Boss */}
      <div 
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 flex items-center justify-center ${
          showHitAnimation ? 'animate-[hit_0.5s_ease-in-out]' : ''
        }`}
      >
        <div 
          className={`text-8xl ${
            bossState === 'death' 
              ? 'text-gray-500 animate-[defeat_2s_ease-in-out]' 
              : 'text-purple-500'
          }`}
        >
          {/* Boss sprite (using emoji as placeholder) */}
          👾
        </div>
      </div>
      
      {/* Damage Number */}
      {lastDamage && (
        <div 
          className="absolute text-red-500 font-pixel text-xl animate-[damageNumber_1s_ease-out]"
          style={{ 
            top: `${lastDamage.y}px`, 
            left: `${lastDamage.x}px`,
          }}
        >
          -{lastDamage.amount}
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
          <div className="absolute top-1/3 left-1/2 text-4xl animate-float" style={{ animationDelay: '0.3s' }}>
            ✨
          </div>
          <div className="absolute bottom-1/2 right-1/5 text-5xl animate-float" style={{ animationDelay: '0.9s' }}>
            🎉
          </div>
        </>
      )}
    </div>
  );
}

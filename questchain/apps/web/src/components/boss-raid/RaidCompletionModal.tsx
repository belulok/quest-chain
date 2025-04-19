'use client';

interface RaidCompletionModalProps {
  xpEarned: number;
  lootChest: string;
  onContinue: () => void;
}

export default function RaidCompletionModal({
  xpEarned,
  lootChest,
  onContinue
}: RaidCompletionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-background border-2 border-primary/50 rounded-md w-full max-w-md animate-[fadeIn_0.3s_ease-out]">
        {/* Header */}
        <div className="border-b border-primary/30 p-4">
          <h2 className="font-pixel text-xl text-center text-primary">
            Raid Completed!
          </h2>
        </div>
        
        {/* Content */}
        <div className="p-6 text-center">
          <div className="text-5xl mb-4">🏆</div>
          
          <p className="text-gray-300 mb-6">
            Congratulations! The Omega Phantom has been defeated.
          </p>
          
          <div className="bg-gray-800/50 rounded-md p-4 mb-4">
            <p className="text-gray-400 mb-2">XP Earned:</p>
            <p className="text-blue-300 text-2xl font-pixel">+{xpEarned} XP</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-md p-4 mb-6">
            <p className="text-gray-400 mb-2">Loot Chest:</p>
            <div className="flex items-center justify-center">
              <span className="font-pixel text-yellow-400 text-xl mr-2">{lootChest}</span>
              <span className="text-yellow-500 text-2xl">🗝️</span>
            </div>
          </div>
          
          <p className="text-green-400 text-sm mb-4">
            Your rewards have been saved on-chain!
          </p>
        </div>
        
        {/* Footer */}
        <div className="border-t border-primary/30 p-4 flex justify-center">
          <button 
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary font-pixel py-2 px-6 rounded transition-colors duration-200"
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

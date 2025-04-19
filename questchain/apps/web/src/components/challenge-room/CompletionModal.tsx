'use client';

interface CompletionModalProps {
  isSuccess: boolean;
  xpEarned: number;
  onContinue: () => void;
}

export default function CompletionModal({
  isSuccess,
  xpEarned,
  onContinue
}: CompletionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-background border-2 border-primary/50 rounded-md w-full max-w-md animate-[fadeIn_0.3s_ease-out]">
        {/* Header */}
        <div className="border-b border-primary/30 p-4">
          <h2 className="font-pixel text-xl text-center text-primary">
            {isSuccess ? 'Challenge Completed!' : 'Challenge Failed'}
          </h2>
        </div>
        
        {/* Content */}
        <div className="p-6 text-center">
          {isSuccess ? (
            <div className="text-5xl mb-4">🏆</div>
          ) : (
            <div className="text-5xl mb-4">😢</div>
          )}
          
          <p className="text-gray-300 mb-4">
            {isSuccess 
              ? 'Congratulations! You have defeated the Fog Phantom.' 
              : 'You ran out of time. Better luck next time!'}
          </p>
          
          <div className="bg-gray-800/50 rounded-md p-4 mb-6">
            <p className="text-gray-400 mb-2">XP Earned:</p>
            <p className="text-blue-300 text-2xl font-pixel">+{xpEarned} XP</p>
          </div>
          
          {isSuccess && (
            <p className="text-green-400 text-sm mb-6">
              Your progress has been saved on-chain!
            </p>
          )}
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

'use client';

interface FeedEntry {
  id: string;
  playerId: string;
  playerName: string;
  question: string;
  answer?: string | number;
  isCorrect: boolean;
  timestamp: number;
}

interface QuestionFeedProps {
  feedEntries: FeedEntry[];
}

export default function QuestionFeed({ feedEntries }: QuestionFeedProps) {
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);
    
    if (seconds < 60) {
      return `${seconds}s ago`;
    } else {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m ago`;
    }
  };
  
  return (
    <div className="h-full p-3 overflow-y-auto">
      <h3 className="font-pixel text-primary text-sm mb-3">LIVE FEED</h3>
      
      <div className="space-y-3">
        {feedEntries.length === 0 ? (
          <p className="text-gray-500 text-xs">No activity yet</p>
        ) : (
          feedEntries.map(entry => (
            <div 
              key={entry.id}
              className={`text-xs p-2 rounded-md ${
                entry.isCorrect 
                  ? 'bg-green-900/30 border border-green-800' 
                  : 'bg-red-900/30 border border-red-800'
              } animate-[fadeIn_0.3s_ease-out]`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-300">{entry.playerName}</span>
                <span className="text-gray-500 text-xxs">{formatTime(entry.timestamp)}</span>
              </div>
              
              <div>
                <span className="text-gray-400">{entry.question} = </span>
                {entry.isCorrect ? (
                  <span className="text-green-400">
                    {entry.answer} <span className="ml-1">✅</span>
                  </span>
                ) : (
                  <span className="text-red-400">
                    missed <span className="ml-1">🕑</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

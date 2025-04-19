'use client';

interface BottomNavigationProps {
  onQuit: () => void;
  onUseHint: () => void;
  onReportIssue: () => void;
  isCompleted: boolean;
}

export default function BottomNavigation({
  onQuit,
  onUseHint,
  onReportIssue,
  isCompleted
}: BottomNavigationProps) {
  return (
    <div className="h-8 bg-background/90 border-t border-primary/30 flex items-center justify-between px-4">
      {/* Left - Quit Button */}
      <button
        className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
        onClick={onQuit}
      >
        Quit
      </button>
      
      {/* Center - Hint Button */}
      <button
        className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
        onClick={onUseHint}
        disabled={isCompleted}
      >
        Hint (-2 XP)
      </button>
      
      {/* Right - Report Button */}
      <button
        className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
        onClick={onReportIssue}
      >
        Report
      </button>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KeyboardShortcuts() {
  const router = useRouter();
  
  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts if no input element is focused
      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement
      ) {
        return;
      }
      
      // Leaderboard shortcut
      if (e.key === 'l' || e.key === 'L') {
        router.push('/leaderboard');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router]);
  
  // This component doesn't render anything
  return null;
}

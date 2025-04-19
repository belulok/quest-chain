'use client';

import { useState, useEffect, useRef } from 'react';
import { Player } from '@/app/leaderboard/page';

interface LeaderboardTableProps {
  players: Player[];
  onPlayerSelect: (player: Player) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export default function LeaderboardTable({
  players,
  onPlayerSelect,
  onLoadMore,
  hasMore,
  isLoadingMore
}: LeaderboardTableProps) {
  const [highlightedRows, setHighlightedRows] = useState<Record<string, boolean>>({});
  const [animatingRows, setAnimatingRows] = useState<Record<string, boolean>>({});
  const tableRef = useRef<HTMLDivElement>(null);
  
  // Format XP number
  const formatXP = (xp: number): string => {
    if (xp >= 1000000) {
      return `${(xp / 1000000).toFixed(1)}M`;
    } else if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}k`;
    } else {
      return xp.toString();
    }
  };
  
  // Handle scroll to load more
  useEffect(() => {
    const handleScroll = () => {
      if (!tableRef.current || !hasMore || isLoadingMore) return;
      
      const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
      
      // Load more when scrolled to bottom (with a 100px threshold)
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        onLoadMore();
      }
    };
    
    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (tableElement) {
        tableElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [hasMore, isLoadingMore, onLoadMore]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        
        // Find currently focused row
        const focusedRow = document.activeElement;
        if (!focusedRow || !focusedRow.classList.contains('leaderboard-row')) {
          // Focus first row if none is focused
          const firstRow = document.querySelector('.leaderboard-row');
          if (firstRow) {
            (firstRow as HTMLElement).focus();
          }
          return;
        }
        
        // Get all rows
        const rows = Array.from(document.querySelectorAll('.leaderboard-row'));
        const currentIndex = rows.indexOf(focusedRow as Element);
        
        if (e.key === 'ArrowDown' && currentIndex < rows.length - 1) {
          (rows[currentIndex + 1] as HTMLElement).focus();
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
          (rows[currentIndex - 1] as HTMLElement).focus();
        }
      } else if (e.key === 'Enter') {
        // Select focused row
        const focusedRow = document.activeElement;
        if (focusedRow && focusedRow.classList.contains('leaderboard-row')) {
          const playerId = focusedRow.getAttribute('data-player-id');
          if (playerId) {
            const player = players.find(p => p.id === playerId);
            if (player) {
              onPlayerSelect(player);
            }
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [players, onPlayerSelect]);
  
  // Highlight rows when rank changes
  useEffect(() => {
    const newHighlights: Record<string, boolean> = {};
    const newAnimations: Record<string, boolean> = {};
    
    players.forEach(player => {
      if (player.previousRank && player.rank !== player.previousRank) {
        newHighlights[player.id] = true;
        newAnimations[player.id] = true;
        
        // Clear highlight after 2 seconds
        setTimeout(() => {
          setHighlightedRows(prev => {
            const updated = { ...prev };
            delete updated[player.id];
            return updated;
          });
        }, 2000);
      }
    });
    
    if (Object.keys(newHighlights).length > 0) {
      setHighlightedRows(prev => ({ ...prev, ...newHighlights }));
    }
    
    if (Object.keys(newAnimations).length > 0) {
      setAnimatingRows(prev => ({ ...prev, ...newAnimations }));
      
      // Clear animations after they complete
      setTimeout(() => {
        setAnimatingRows({});
      }, 500);
    }
  }, [players]);
  
  // Render rank badge
  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return <span className="text-yellow-400">🥇</span>;
    } else if (rank === 2) {
      return <span className="text-gray-300">🥈</span>;
    } else if (rank === 3) {
      return <span className="text-amber-600">🥉</span>;
    } else {
      return <span className="text-gray-400">{rank}</span>;
    }
  };
  
  return (
    <div 
      className="w-full h-full overflow-y-auto"
      ref={tableRef}
    >
      {/* Desktop Table View */}
      <table className="w-full hidden md:table">
        <thead>
          <tr className="border-b border-primary/20">
            <th className="px-4 py-2 text-left text-gray-400 font-pixel text-sm" aria-sort="descending">Rank</th>
            <th className="px-4 py-2 text-left text-gray-400 font-pixel text-sm">Player</th>
            <th className="px-4 py-2 text-right text-gray-400 font-pixel text-sm">XP</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr 
              key={player.id}
              className={`leaderboard-row border-b border-gray-800 hover:bg-sky-950/20 hover:-translate-y-[2px] transition-all duration-200 cursor-pointer ${
                highlightedRows[player.id] ? 'bg-green-900/20' : ''
              } ${
                player.isCurrentUser ? 'bg-primary/10' : ''
              } ${
                animatingRows[player.id] ? (
                  player.previousRank && player.rank < player.previousRank
                    ? 'animate-[slideUp_0.5s_ease-out]'
                    : 'animate-[slideDown_0.5s_ease-out]'
                ) : ''
              }`}
              onClick={() => onPlayerSelect(player)}
              data-player-id={player.id}
              tabIndex={0}
              aria-label={`Rank ${player.rank}, ${player.name}, ${formatXP(player.xp)} XP`}
            >
              <td className="px-4 py-3 text-center w-16">
                <div className="flex items-center justify-center">
                  {renderRankBadge(player.rank)}
                  
                  {/* Rank Change Indicator */}
                  {player.previousRank && player.rank !== player.previousRank && (
                    <span className={`ml-2 text-xs ${
                      player.rank < player.previousRank ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {player.rank < player.previousRank ? '⬆︎' : '⬇︎'}
                      {Math.abs(player.rank - player.previousRank)}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm">{player.avatarImage}</span>
                  </div>
                  <div>
                    <div className="font-pixel text-white">{player.name}</div>
                    <div className="text-xs text-gray-400">Level {player.level}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-right font-pixel text-primary">
                {formatXP(player.xp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Mobile Card View */}
      <div className="md:hidden">
        {players.map(player => (
          <div 
            key={player.id}
            className={`leaderboard-row p-4 border-b border-gray-800 hover:bg-sky-950/20 transition-all duration-200 cursor-pointer ${
              highlightedRows[player.id] ? 'bg-green-900/20' : ''
            } ${
              player.isCurrentUser ? 'bg-primary/10' : ''
            }`}
            onClick={() => onPlayerSelect(player)}
            data-player-id={player.id}
            tabIndex={0}
          >
            <div className="flex items-center">
              <div className="w-10 flex items-center justify-center mr-3">
                {renderRankBadge(player.rank)}
              </div>
              
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm">{player.avatarImage}</span>
              </div>
              
              <div className="flex-grow">
                <div className="font-pixel text-white">{player.name}</div>
                <div className="text-xs text-gray-400">Level {player.level}</div>
              </div>
              
              <div className="font-pixel text-primary">
                {formatXP(player.xp)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className="p-4 text-center text-gray-400">
          Loading more players...
        </div>
      )}
      
      {/* End of List */}
      {!hasMore && players.length > 0 && (
        <div className="p-4 text-center text-gray-500 text-sm">
          End of leaderboard
        </div>
      )}
      
      {/* Empty State */}
      {players.length === 0 && (
        <div className="p-8 text-center text-gray-400">
          <p className="text-2xl mb-2">🏆</p>
          <p className="mb-1">No players found</p>
          <p className="text-sm text-gray-500">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LeaderboardHeader from '@/components/leaderboard/LeaderboardHeader';
import FilterRow from '@/components/leaderboard/FilterRow';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import MyStatsRibbon from '@/components/leaderboard/MyStatsRibbon';
import RealtimeTicker from '@/components/leaderboard/RealtimeTicker';
import PlayerProfileModal from '@/components/leaderboard/PlayerProfileModal';
import LoadingScreen from '@/components/LoadingScreen';

// Define player types
export interface Player {
  id: string;
  rank: number;
  previousRank?: number;
  name: string;
  avatarId: string;
  avatarImage: string;
  xp: number;
  level: number;
  badges: string[];
  equipment: {
    head?: string;
    cape?: string;
    weapon?: string;
    charm?: string;
    boots?: string;
  };
  isCurrentUser?: boolean;
}

// Define event types
export interface XPEvent {
  id: string;
  timestamp: number;
  playerName: string;
  avatarId: string;
  xpDelta: number;
  eventType: 'quest' | 'raid';
  subject?: string;
}

// Define filter types
export type DateRange = 'today' | 'week' | 'all-time';
export type Subject = 'all' | 'coding' | 'math' | 'logic';

export default function LeaderboardPage() {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<XPEvent[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>('all-time');
  const [subject, setSubject] = useState<Subject>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [currentUserRankChange, setCurrentUserRankChange] = useState<number>(0);
  const [hasMorePlayers, setHasMorePlayers] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  
  // Simulate loading assets with progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Simulate fetching leaderboard data
          setTimeout(() => {
            // Mock player data
            const mockPlayers: Player[] = [
              {
                id: 'p1',
                rank: 1,
                previousRank: 1,
                name: 'Sebastian',
                avatarId: 'a1',
                avatarImage: '👤',
                xp: 42540,
                level: 8,
                badges: ['First Quest', 'Boss Slayer', 'Coding Master'],
                equipment: {
                  head: 'Legendary Helmet',
                  weapon: 'Epic Sword',
                  cape: 'Rare Cloak',
                },
              },
              {
                id: 'p2',
                rank: 2,
                previousRank: 3,
                name: 'Grace',
                avatarId: 'a2',
                avatarImage: '👤',
                xp: 38750,
                level: 7,
                badges: ['First Quest', 'Math Wizard'],
                equipment: {
                  head: 'Rare Helmet',
                  weapon: 'Rare Sword',
                },
              },
              {
                id: 'p3',
                rank: 3,
                previousRank: 2,
                name: 'Alex',
                avatarId: 'a3',
                avatarImage: '👤',
                xp: 36200,
                level: 7,
                badges: ['First Quest', 'Logic Master'],
                equipment: {
                  weapon: 'Epic Sword',
                  charm: 'Rare Amulet',
                },
              },
              {
                id: 'p4',
                rank: 4,
                previousRank: 4,
                name: 'Maya',
                avatarId: 'a4',
                avatarImage: '👤',
                xp: 34800,
                level: 7,
                badges: ['First Quest'],
                equipment: {
                  head: 'Common Helmet',
                  weapon: 'Rare Sword',
                },
              },
              {
                id: 'p5',
                rank: 5,
                previousRank: 5,
                name: 'Liam',
                avatarId: 'a5',
                avatarImage: '👤',
                xp: 33600,
                level: 6,
                badges: ['First Quest', 'Raid Champion'],
                equipment: {
                  cape: 'Epic Cloak',
                  weapon: 'Common Sword',
                },
              },
              {
                id: 'p6',
                rank: 6,
                previousRank: 7,
                name: 'Zoe',
                avatarId: 'a6',
                avatarImage: '👤',
                xp: 33100,
                level: 6,
                badges: ['First Quest'],
                equipment: {
                  head: 'Rare Helmet',
                  boots: 'Common Boots',
                },
              },
              {
                id: 'p7',
                rank: 7,
                previousRank: 6,
                name: 'Ethan',
                avatarId: 'a7',
                avatarImage: '👤',
                xp: 32900,
                level: 6,
                badges: ['First Quest', 'Coding Novice'],
                equipment: {
                  weapon: 'Common Sword',
                },
              },
              {
                id: 'p8',
                rank: 8,
                previousRank: 8,
                name: 'Olivia',
                avatarId: 'a8',
                avatarImage: '👤',
                xp: 32700,
                level: 6,
                badges: ['First Quest'],
                equipment: {
                  head: 'Common Helmet',
                  charm: 'Common Amulet',
                },
              },
              {
                id: 'p9',
                rank: 9,
                previousRank: 10,
                name: 'Noah',
                avatarId: 'a9',
                avatarImage: '👤',
                xp: 32600,
                level: 6,
                badges: ['First Quest'],
                equipment: {
                  weapon: 'Common Sword',
                },
              },
              {
                id: 'p10',
                rank: 10,
                previousRank: 9,
                name: 'Emma',
                avatarId: 'a10',
                avatarImage: '👤',
                xp: 32550,
                level: 6,
                badges: ['First Quest'],
                equipment: {
                  cape: 'Common Cloak',
                },
              },
              {
                id: 'current-user',
                rank: 17,
                previousRank: 19,
                name: 'You',
                avatarId: 'current-user-avatar',
                avatarImage: '👤',
                xp: 32540,
                level: 5,
                badges: ['First Quest'],
                equipment: {
                  head: 'Common Helmet',
                  weapon: 'Common Sword',
                },
                isCurrentUser: true,
              },
            ];
            
            setPlayers(mockPlayers);
            setFilteredPlayers(mockPlayers);
            
            // Set current user rank
            const currentUser = mockPlayers.find(p => p.isCurrentUser);
            if (currentUser) {
              setCurrentUserRank(currentUser.rank);
              setCurrentUserRankChange(
                currentUser.previousRank ? currentUser.previousRank - currentUser.rank : 0
              );
            }
            
            // Mock events
            const mockEvents: XPEvent[] = [
              {
                id: 'e1',
                timestamp: Date.now() - 30000,
                playerName: 'Sebastian',
                avatarId: 'a1',
                xpDelta: 500,
                eventType: 'quest',
                subject: 'coding',
              },
              {
                id: 'e2',
                timestamp: Date.now() - 60000,
                playerName: 'Grace',
                avatarId: 'a2',
                xpDelta: 750,
                eventType: 'raid',
              },
              {
                id: 'e3',
                timestamp: Date.now() - 120000,
                playerName: 'Alex',
                avatarId: 'a3',
                xpDelta: 300,
                eventType: 'quest',
                subject: 'math',
              },
            ];
            
            setEvents(mockEvents);
            setIsLoading(false);
            setCursor('next-page-cursor');
          }, 500);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);
  
  // Handle filter changes
  useEffect(() => {
    if (isLoading) return;
    
    // In a real implementation, this would fetch data from the API
    // For now, we'll just filter the mock data
    
    // Reset cursor and filtered players
    setCursor('next-page-cursor');
    setHasMorePlayers(true);
    
    // Apply filters
    let filtered = [...players];
    
    // Filter by date range (mock implementation)
    if (dateRange === 'today') {
      // Simulate filtering by today
      filtered = filtered.map(p => ({
        ...p,
        xp: Math.floor(p.xp * 0.05), // 5% of total XP for today
      }));
    } else if (dateRange === 'week') {
      // Simulate filtering by week
      filtered = filtered.map(p => ({
        ...p,
        xp: Math.floor(p.xp * 0.3), // 30% of total XP for week
      }));
    }
    
    // Filter by subject (mock implementation)
    if (subject !== 'all') {
      // Simulate filtering by subject
      filtered = filtered.map(p => ({
        ...p,
        xp: Math.floor(p.xp * (
          subject === 'coding' ? 0.4 :
          subject === 'math' ? 0.3 :
          subject === 'logic' ? 0.3 : 1
        )),
      }));
    }
    
    // Sort by XP
    filtered.sort((a, b) => b.xp - a.xp);
    
    // Update ranks
    filtered = filtered.map((p, index) => ({
      ...p,
      previousRank: p.rank,
      rank: index + 1,
    }));
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Update current user rank
    const currentUser = filtered.find(p => p.isCurrentUser);
    if (currentUser) {
      setCurrentUserRank(currentUser.rank);
      setCurrentUserRankChange(
        currentUser.previousRank ? currentUser.previousRank - currentUser.rank : 0
      );
    } else {
      setCurrentUserRank(null);
      setCurrentUserRankChange(0);
    }
    
    setFilteredPlayers(filtered);
  }, [isLoading, dateRange, subject, searchQuery, players]);
  
  // Simulate WebSocket connection for real-time updates
  useEffect(() => {
    if (isLoading) return;
    
    const interval = setInterval(() => {
      // Simulate receiving a new event
      const randomPlayerIndex = Math.floor(Math.random() * players.length);
      const randomPlayer = players[randomPlayerIndex];
      
      const newEvent: XPEvent = {
        id: `e${Date.now()}`,
        timestamp: Date.now(),
        playerName: randomPlayer.name,
        avatarId: randomPlayer.avatarId,
        xpDelta: Math.floor(Math.random() * 500) + 100,
        eventType: Math.random() > 0.7 ? 'raid' : 'quest',
        subject: Math.random() > 0.7 ? undefined : 
                 Math.random() > 0.5 ? 'coding' :
                 Math.random() > 0.5 ? 'math' : 'logic',
      };
      
      // Add new event to the list
      setEvents(prev => [newEvent, ...prev].slice(0, 20));
      
      // Update player XP
      setPlayers(prev => {
        const updated = prev.map(p => {
          if (p.id === randomPlayer.id) {
            return {
              ...p,
              xp: p.xp + newEvent.xpDelta,
            };
          }
          return p;
        });
        
        // Sort by XP
        updated.sort((a, b) => b.xp - a.xp);
        
        // Update ranks
        return updated.map((p, index) => ({
          ...p,
          previousRank: p.rank,
          rank: index + 1,
        }));
      });
    }, 10000); // Every 10 seconds
    
    return () => clearInterval(interval);
  }, [isLoading, players]);
  
  // Handle load more
  const handleLoadMore = () => {
    if (!hasMorePlayers || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    // Simulate API call with cursor
    setTimeout(() => {
      // Mock more players
      const morePlayersCount = Math.min(10, 20 - filteredPlayers.length);
      
      if (morePlayersCount <= 0) {
        setHasMorePlayers(false);
        setIsLoadingMore(false);
        return;
      }
      
      const lastRank = filteredPlayers[filteredPlayers.length - 1].rank;
      
      const morePlayers: Player[] = Array.from({ length: morePlayersCount }).map((_, index) => ({
        id: `p${filteredPlayers.length + index + 1}`,
        rank: lastRank + index + 1,
        previousRank: lastRank + index + 1,
        name: `Player ${lastRank + index + 1}`,
        avatarId: `a${filteredPlayers.length + index + 1}`,
        avatarImage: '👤',
        xp: Math.max(10000, 32500 - (index + 1) * 100),
        level: Math.max(1, 5 - Math.floor((index + 1) / 5)),
        badges: ['First Quest'],
        equipment: {},
      }));
      
      setFilteredPlayers(prev => [...prev, ...morePlayers]);
      
      // Update cursor
      if (morePlayersCount < 10) {
        setHasMorePlayers(false);
        setCursor(null);
      } else {
        setCursor(`cursor-${lastRank + morePlayersCount}`);
      }
      
      setIsLoadingMore(false);
    }, 1000);
  };
  
  // Handle player selection
  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
    setShowProfileModal(true);
  };
  
  return (
    <main className="flex min-h-screen flex-col relative overflow-hidden bg-gray-900">
      {isLoading ? (
        <LoadingScreen progress={loadingProgress} />
      ) : (
        <div className="flex flex-col h-screen">
          {/* Header */}
          <LeaderboardHeader onSearch={setSearchQuery} />
          
          {/* Filter Row */}
          <FilterRow 
            dateRange={dateRange}
            setDateRange={setDateRange}
            subject={subject}
            setSubject={setSubject}
          />
          
          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Leaderboard Table */}
            <div className="flex-grow overflow-y-auto">
              <LeaderboardTable 
                players={filteredPlayers}
                onPlayerSelect={handlePlayerSelect}
                onLoadMore={handleLoadMore}
                hasMore={hasMorePlayers}
                isLoadingMore={isLoadingMore}
              />
            </div>
            
            {/* Realtime Ticker (hidden on mobile) */}
            <div className="w-52 border-l border-primary/30 hidden md:block">
              <RealtimeTicker events={events} />
            </div>
          </div>
          
          {/* My Stats Ribbon */}
          {currentUserRank && (
            <MyStatsRibbon 
              rank={currentUserRank}
              rankChange={currentUserRankChange}
              xp={players.find(p => p.isCurrentUser)?.xp || 0}
              level={players.find(p => p.isCurrentUser)?.level || 0}
            />
          )}
          
          {/* Player Profile Modal */}
          {showProfileModal && selectedPlayer && (
            <PlayerProfileModal 
              player={selectedPlayer}
              onClose={() => setShowProfileModal(false)}
            />
          )}
        </div>
      )}
    </main>
  );
}

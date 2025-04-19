import { useState, useEffect, useRef, useCallback } from 'react';

interface GameState {
  bossHP: number;
  maxBossHP: number;
  timestamp: number;
}

interface UseGameSocketOptions {
  url: string;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export function useGameSocket({
  url,
  autoReconnect = true,
  reconnectInterval = 3000,
  onOpen,
  onClose,
  onError,
}: UseGameSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Connect to WebSocket
  const connect = useCallback(() => {
    // Close existing connection if any
    if (socketRef.current) {
      socketRef.current.close();
    }

    // Create new WebSocket connection
    const socket = new WebSocket(url);

    socket.onopen = () => {
      setIsConnected(true);
      onOpen?.();
    };

    socket.onclose = () => {
      setIsConnected(false);
      onClose?.();

      // Attempt to reconnect if autoReconnect is enabled
      if (autoReconnect) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, reconnectInterval);
      }
    };

    socket.onerror = (error) => {
      onError?.(error);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'gameState') {
          setGameState({
            bossHP: data.bossHP,
            maxBossHP: data.maxBossHP,
            timestamp: data.timestamp,
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socketRef.current = socket;
  }, [url, autoReconnect, reconnectInterval, onOpen, onClose, onError]);

  // Send message to WebSocket
  const sendMessage = useCallback((message: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message: WebSocket is not connected');
    }
  }, [isConnected]);

  // Attack boss
  const attackBoss = useCallback((damage: number, sender: string) => {
    sendMessage({
      type: 'attack',
      damage,
      sender,
    });
  }, [sendMessage]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    gameState,
    sendMessage,
    attackBoss,
  };
}

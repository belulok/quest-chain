import React, { useEffect, useRef } from 'react';
// Import Phaser only on the client side
let Phaser: any = null;

// These will be loaded dynamically
let gameConfig: any = null;
let BootScene: any = null;
let PreloadScene: any = null;
let MainMenuScene: any = null;
let WorldMapScene: any = null;
let QuestBoardScene: any = null;
let ChallengeRoomScene: any = null;
let BossRaidScene: any = null;
let InventoryScene: any = null;
let LeaderboardScene: any = null;

interface PhaserGameProps {
  isConnected: boolean;
}

const PhaserGameComponent: React.FC<PhaserGameProps> = ({ isConnected }) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Load Phaser and game components
  useEffect(() => {
    let mounted = true;

    const loadGameModules = async () => {
      try {
        // Dynamically import Phaser and game components
        const [phaserModule, configModule, bootSceneModule, preloadSceneModule,
               mainMenuSceneModule, worldMapSceneModule, questBoardSceneModule,
               challengeRoomSceneModule, bossRaidSceneModule, inventorySceneModule,
               leaderboardSceneModule] = await Promise.all([
          import('phaser'),
          import('./config').then(m => m.gameConfig),
          import('./scenes/BootScene').then(m => m.BootScene),
          import('./scenes/PreloadScene').then(m => m.PreloadScene),
          import('./scenes/MainMenuScene').then(m => m.MainMenuScene),
          import('./scenes/WorldMapScene').then(m => m.WorldMapScene),
          import('./scenes/QuestBoardScene').then(m => m.QuestBoardScene),
          import('./scenes/ChallengeRoomScene').then(m => m.ChallengeRoomScene),
          import('./scenes/BossRaidScene').then(m => m.BossRaidScene),
          import('./scenes/InventoryScene').then(m => m.InventoryScene),
          import('./scenes/LeaderboardScene').then(m => m.LeaderboardScene)
        ]);

        if (!mounted) return;

        // Assign the imported modules to our variables
        Phaser = phaserModule;
        gameConfig = configModule;
        BootScene = bootSceneModule;
        PreloadScene = preloadSceneModule;
        MainMenuScene = mainMenuSceneModule;
        WorldMapScene = worldMapSceneModule;
        QuestBoardScene = questBoardSceneModule;
        ChallengeRoomScene = challengeRoomSceneModule;
        BossRaidScene = bossRaidSceneModule;
        InventoryScene = inventorySceneModule;
        LeaderboardScene = leaderboardSceneModule;

        // Initialize the game
        initGame();
      } catch (error) {
        console.error('Error loading game modules:', error);
      }
    };

    const initGame = () => {
      if (!gameContainerRef.current || !Phaser) return;

      // Clean up any existing game instance
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }

      try {
        // Create a new game instance
        const config = {
          ...gameConfig,
          parent: gameContainerRef.current,
          scene: [
            BootScene,
            PreloadScene,
            MainMenuScene,
            WorldMapScene,
            QuestBoardScene,
            ChallengeRoomScene,
            BossRaidScene,
            InventoryScene,
            LeaderboardScene
          ]
        };

        gameRef.current = new Phaser.Game(config);

        // Update wallet connection status
        updateWalletStatus();
      } catch (error) {
        console.error('Error initializing game:', error);
      }
    };

    // Start loading the game modules
    loadGameModules();

    // Clean up on unmount
    return () => {
      mounted = false;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  // Function to update wallet status
  const updateWalletStatus = () => {
    if (!gameRef.current) return;

    try {
      const mainMenuScene = gameRef.current.scene.getScene('MainMenuScene');
      if (mainMenuScene && mainMenuScene.events) {
        mainMenuScene.events.emit('wallet-status-changed', { isConnected });
      }
    } catch (error) {
      console.error('Error updating wallet status:', error);
    }
  };

  // Update game when wallet connection status changes
  useEffect(() => {
    updateWalletStatus();
  }, [isConnected]);

  return <div ref={gameContainerRef} id="game-container" className="w-full h-full" />;
};

export default PhaserGameComponent;

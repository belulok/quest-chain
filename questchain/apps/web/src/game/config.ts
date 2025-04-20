import * as Phaser from 'phaser';

// Make sure Phaser is defined
const PhaserType = Phaser || (window as any).Phaser;

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: PhaserType.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#1e293b',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: process.env.NODE_ENV === 'development'
    }
  },
  scale: {
    mode: PhaserType.Scale.FIT,
    autoCenter: PhaserType.Scale.CENTER_BOTH
  },
  render: {
    pixelArt: true,
    antialias: false,
    antialiasGL: false
  },
  // Scenes will be added in the main game file
  scene: []
};

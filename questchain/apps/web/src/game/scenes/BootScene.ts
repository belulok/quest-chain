import * as Phaser from 'phaser';

// Make sure Phaser is defined
const PhaserType = Phaser || (window as any).Phaser;

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Add loading text
    const loadingText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'Loading...',
      {
        font: '24px monospace',
        color: '#ffffff'
      }
    ).setOrigin(0.5);

    // Create placeholder assets for development
    this.createPlaceholderAssets();

    // Add a loading event to track progress
    this.load.on('complete', () => {
      console.log('Boot assets loaded successfully');
    });

    // Add error handling for asset loading
    this.load.on('loaderror', (fileObj: any) => {
      console.error('Error loading asset:', fileObj.src);
      // Continue anyway since we have placeholders
    });

    // Try to load minimal assets needed for the loading screen
    try {
      // Load the loading background and logo
      this.load.image('loading-bg', '/assets/QuestChain Assets/loading_bg.png');
      this.load.image('loading-logo', '/assets/QuestChain Assets/logo.png');
    } catch (error) {
      console.warn('Could not load assets, using placeholders instead', error);
    }
  }

  // Create placeholder assets if real assets aren't available yet
  private createPlaceholderAssets() {
    // Create a placeholder logo texture with a different key to avoid conflicts
    const logoGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    logoGraphics.fillStyle(0xffd700);
    logoGraphics.fillRect(0, 0, 200, 100);
    logoGraphics.fillStyle(0x000000);
    logoGraphics.fillRect(20, 20, 160, 60);
    logoGraphics.generateTexture('placeholder-logo', 200, 100);

    // Create a placeholder loading bar background
    const bgGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    bgGraphics.fillStyle(0x222222);
    bgGraphics.fillRect(0, 0, 400, 40);
    bgGraphics.generateTexture('loading-bar-bg', 400, 40);

    // Create a placeholder loading bar fill
    const fillGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    fillGraphics.fillStyle(0x00ff00);
    fillGraphics.fillRect(0, 0, 400, 40);
    fillGraphics.generateTexture('loading-bar-fill', 400, 40);
  }

  create() {
    // Set up any game configurations or plugins
    this.scale.refresh();

    // Transition to the preload scene
    this.scene.start('PreloadScene');
  }
}

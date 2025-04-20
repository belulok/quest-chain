import * as Phaser from 'phaser';

// Make sure Phaser is defined
const PhaserType = Phaser || (window as any).Phaser;

export class PreloadScene extends Phaser.Scene {
  private loadingBar!: Phaser.GameObjects.Graphics;
  private progressBar!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.createLoadingBar();

    // Register a progress event to update the loading bar
    this.load.on('progress', (value: number) => {
      // Only update if progressBar exists
      if (this.progressBar) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0xFFD700, 1); // Gold color for the progress bar

        // Use the pixelated bar dimensions if they exist
        const barWidth = 300;
        const barHeight = 20;

        this.progressBar.fillRect(
          this.cameras.main.width / 2 - barWidth / 2,
          this.cameras.main.height / 2 + 30 - barHeight / 2,
          barWidth * value,
          barHeight
        );

        // Update the loading text
        if (this.loadingText) {
          this.loadingText.setText(`Loading...${Math.floor(value * 100)}%`);
        }

        console.log(`Loading progress: ${Math.floor(value * 100)}%`);
      }
    });

    // Add complete event
    this.load.on('complete', () => {
      console.log('All assets loaded successfully');
    });

    // Add error handling for asset loading
    this.load.on('loaderror', (fileObj: any) => {
      console.error('Error loading asset:', fileObj.src);
      // Continue anyway since we have placeholders
    });

    // Load all game assets
    this.loadAssets();
  }

  create() {
    // Add a fade-out effect before transitioning to the main menu
    this.cameras.main.fadeOut(1000, 0, 0, 0);

    // Wait for the fade-out to complete, then start the MainMenuScene
    this.cameras.main.once('camerafadeoutcomplete', () => {
      // Pass fadeIn flag to MainMenuScene to trigger fade-in effect
      this.scene.start('MainMenuScene', { fadeIn: true });
    });
  }

  private createLoadingBar() {
    try {
      // Load the custom background and logo for the loading screen
      this.load.image('loading-bg', '/assets/QuestChain Assets/loading_bg.png');
      this.load.image('loading-logo', '/assets/QuestChain Assets/logo.png');

      // Wait for these assets to load before creating the loading screen
      this.load.once('complete', () => {
        // Add the custom background
        const bg = this.add.image(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2,
          'loading-bg'
        ).setOrigin(0.5);

        // Scale the background to fit the screen
        const scaleX = this.cameras.main.width / bg.width;
        const scaleY = this.cameras.main.height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);

        // Add the QuestChain logo
        const logo = this.add.image(
          this.cameras.main.width / 2,
          this.cameras.main.height / 3,
          'loading-logo'
        ).setOrigin(0.5);
        logo.setScale(0.5);

        // Create a pixelated text style for the loading text
        const pixelTextStyle = {
          fontFamily: 'monospace',
          fontSize: '24px',
          color: '#FFD700',
          align: 'center',
          // Add a slight shadow for better visibility
          shadow: {
            offsetX: 2,
            offsetY: 2,
            color: '#000',
            blur: 0,
            fill: true
          }
        };

        // Add pixelated QUESTCHAIN ACADEMY text
        this.add.text(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2 - 30,
          'QUESTCHAIN ACADEMY',
          pixelTextStyle
        ).setOrigin(0.5);

        // Create a pixelated loading bar background
        const barWidth = 300;
        const barHeight = 20;

        // Create a pixelated border for the loading bar (2px border)
        this.add.rectangle(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2 + 30,
          barWidth + 4,
          barHeight + 4,
          0xFFFFFF
        ).setOrigin(0.5);

        // Create the loading bar background
        this.loadingBar = this.add.graphics();
        this.loadingBar.fillStyle(0x222222, 1);
        this.loadingBar.fillRect(
          this.cameras.main.width / 2 - barWidth / 2,
          this.cameras.main.height / 2 + 30 - barHeight / 2,
          barWidth,
          barHeight
        );

        // Create the progress bar
        this.progressBar = this.add.graphics();

        // Add pixelated loading text
        this.loadingText = this.add.text(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2 + 60,
          'Loading...',
          {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#FFFFFF'
          }
        ).setOrigin(0.5);
      });

      // Start loading the assets for the loading screen
      this.load.start();
    } catch (error) {
      console.error('Error creating loading bar:', error);

      // Fallback to a simple loading bar if there's an error
      this.loadingBar = this.add.graphics();
      this.loadingBar.fillStyle(0x222222, 0.8);
      this.loadingBar.fillRect(
        this.cameras.main.width / 4 - 2,
        this.cameras.main.height / 2 - 18,
        this.cameras.main.width / 2 + 4,
        36
      );

      this.progressBar = this.add.graphics();

      this.loadingText = this.add.text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 - 32,
        'Loading: 0%',
        {
          font: '18px monospace',
          color: '#ffffff'
        }
      ).setOrigin(0.5);

      // Create a simple text logo as fallback
      this.add.text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 - 100,
        'QUESTCHAIN',
        {
          font: '32px monospace',
          color: '#ffd700'
        }
      ).setOrigin(0.5);
    }
  }

  private loadAssets() {
    // Create placeholder assets for development
    this.createPlaceholderAssets();

    try {
      // Load all game assets here

      // Spritesheets
      this.load.spritesheet('player', '/assets/sprites/player.png', {
        frameWidth: 32,
        frameHeight: 32
      });
      this.load.spritesheet('phantom', '/assets/sprites/phantom.png', {
        frameWidth: 64,
        frameHeight: 64
      });
      this.load.spritesheet('character-sprite', '/assets/sprites/character.png', {
        frameWidth: 32,
        frameHeight: 48
      });

      // Tilesets - using placeholders for now
      // this.load.image('world-tiles', '/assets/tilesets/world-tiles.png');
      // this.load.tilemapTiledJSON('world-map', '/assets/maps/world-map.json');

      // UI elements
      this.load.image('button', '/assets/ui/button.png');
      this.load.image('button-hover', '/assets/ui/button-hover.png');
      this.load.image('panel', '/assets/ui/panel.png');
      // this.load.image('inventory-slot', '/assets/ui/inventory-slot.png');

      // QuestChain Assets
      this.load.image('quest-sign', '/assets/QuestChain Assets/quest board.png');
      this.load.image('world-map', '/assets/QuestChain Assets/world map.png');
      this.load.image('start-button', '/assets/QuestChain Assets/start.png');
      this.load.image('character', '/assets/QuestChain Assets/human.png');
      this.load.image('full-character', '/assets/QuestChain Assets/full_human.png');
      this.load.image('logo', '/assets/QuestChain Assets/logo.png');
      this.load.image('background', '/assets/QuestChain Assets/background_1.png');
      this.load.image('grass-block', '/assets/QuestChain Assets/grass block.png');
      this.load.image('water-block', '/assets/QuestChain Assets/water block.png');
      this.load.image('cloud-asset', '/assets/QuestChain Assets/cloud.png');
      this.load.image('wallet-button', '/assets/QuestChain Assets/connect_wallet.png');

      // World Map Scene specific assets
      this.load.image('sky-bg', '/assets/QuestChain Assets/sky.png');
      this.load.image('island-full', '/assets/QuestChain Assets/island full.png');
      this.load.image('inventory-button', '/assets/QuestChain Assets/inventory button3.png');
      this.load.image('boss-raid-button', '/assets/QuestChain Assets/boss raid button.png');
      this.load.image('google-button', '/assets/QuestChain Assets/google.png');

      // Biome backgrounds
      this.load.image('starter-bg', '/assets/backgrounds/starter-bg.png');
      this.load.image('binary-bg', '/assets/backgrounds/binary-bg.png');
      this.load.image('algebra-bg', '/assets/backgrounds/algebra-bg.png');
      this.load.image('crypto-bg', '/assets/backgrounds/crypto-bg.png');
      this.load.image('logic-bg', '/assets/backgrounds/logic-bg.png');
      this.load.image('network-bg', '/assets/backgrounds/network-bg.png');

      // Items and collectibles - using placeholders for now
      // this.load.image('xp-orb', '/assets/items/xp-orb.png');
      // this.load.image('chest', '/assets/items/chest.png');

      // Audio
      this.load.audio('main-theme', '/assets/audio/main-theme.mp3');
      this.load.audio('button-click', '/assets/audio/button-click.mp3');
      this.load.audio('correct-answer', '/assets/audio/correct-answer.mp3');
      this.load.audio('wrong-answer', '/assets/audio/wrong-answer.mp3');
    } catch (error) {
      console.warn('Error loading assets, using placeholders', error);
    }
  }

  // Create placeholder assets if real assets aren't available yet
  private createPlaceholderAssets() {
    // Create placeholder sprites and images

    // Player spritesheet placeholder
    const playerGraphics = this.make.graphics({ x: 0, y: 0 });
    playerGraphics.fillStyle(0x00ff00);
    playerGraphics.fillRect(0, 0, 32, 32);
    playerGraphics.generateTexture('player', 32, 32);

    // Biome marker placeholder
    const markerGraphics = this.make.graphics({ x: 0, y: 0 });
    markerGraphics.fillStyle(0xffffff);
    markerGraphics.fillCircle(16, 16, 12);
    markerGraphics.generateTexture('biome-marker', 32, 32);

    // Phantom spritesheet placeholder
    const phantomGraphics = this.make.graphics({ x: 0, y: 0 });
    phantomGraphics.fillStyle(0xff00ff);
    phantomGraphics.fillRect(0, 0, 64, 64);
    phantomGraphics.generateTexture('phantom', 64, 64);

    // UI elements placeholders
    const buttonGraphics = this.make.graphics({ x: 0, y: 0 });
    buttonGraphics.fillStyle(0x333333);
    buttonGraphics.fillRect(0, 0, 200, 50);
    buttonGraphics.generateTexture('button', 200, 50);

    const buttonHoverGraphics = this.make.graphics({ x: 0, y: 0 });
    buttonHoverGraphics.fillStyle(0x444444);
    buttonHoverGraphics.fillRect(0, 0, 200, 50);
    buttonHoverGraphics.generateTexture('button-hover', 200, 50);

    const panelGraphics = this.make.graphics({ x: 0, y: 0 });
    panelGraphics.fillStyle(0x222222);
    panelGraphics.fillRect(0, 0, 300, 200);
    panelGraphics.generateTexture('panel', 300, 200);

    // Background placeholders
    const bgGraphics = this.make.graphics({ x: 0, y: 0 });
    bgGraphics.fillStyle(0x1e293b);
    bgGraphics.fillRect(0, 0, 800, 600);
    bgGraphics.generateTexture('starter-bg', 800, 600);
    bgGraphics.generateTexture('binary-bg', 800, 600);
    bgGraphics.generateTexture('algebra-bg', 800, 600);
    bgGraphics.generateTexture('crypto-bg', 800, 600);
    bgGraphics.generateTexture('logic-bg', 800, 600);
    bgGraphics.generateTexture('network-bg', 800, 600);

    // Create pixel art cloud texture
    const cloudGraphics = this.make.graphics({ x: 0, y: 0 });
    cloudGraphics.fillStyle(0xffffff);
    cloudGraphics.fillRect(0, 0, 40, 20);
    cloudGraphics.fillRect(10, -5, 20, 5);
    cloudGraphics.generateTexture('cloud', 40, 20);

    // Create quest sign texture as a fallback
    // We'll use the actual asset from QuestChain Assets/quest board.png when available
    const signGraphics = this.make.graphics({ x: 0, y: 0 });
    signGraphics.fillStyle(0x8B4513); // Brown
    signGraphics.fillRect(0, 0, 80, 60);
    signGraphics.fillStyle(0x000000);
    signGraphics.fillRect(5, 5, 70, 50);
    signGraphics.generateTexture('quest-sign-placeholder', 80, 60); // Use a different key

    // Create portal texture
    const portalGraphics = this.make.graphics({ x: 0, y: 0 });
    portalGraphics.fillStyle(0x666666); // Gray
    portalGraphics.fillRect(0, 0, 60, 80);
    portalGraphics.fillStyle(0x00ffff); // Cyan
    portalGraphics.fillRect(5, 5, 50, 70);
    portalGraphics.generateTexture('portal', 60, 80);

    // We don't create a placeholder for start-button since we're using the actual start.png asset

    // Create character placeholder
    const characterGraphics = this.make.graphics({ x: 0, y: 0 });
    characterGraphics.fillStyle(0x3498db); // Blue
    characterGraphics.fillRect(0, 0, 32, 48);
    characterGraphics.generateTexture('character-placeholder', 32, 48);

    // Create placeholder audio
    try {
      // Create a simple beep sound as a placeholder
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const sampleRate = audioContext.sampleRate;
      const buffer = audioContext.createBuffer(1, sampleRate * 0.5, sampleRate);
      const data = buffer.getChannelData(0);

      // Generate a simple beep tone
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.sin(i * 0.01) * 0.5;
      }

      // Convert AudioBuffer to ArrayBuffer
      const audioData = {
        duration: 0.5,
        sampleRate: sampleRate,
        channels: 1,
        data: data
      };

      // Add placeholder sounds
      this.cache.audio.add('main-theme', audioData);
      this.cache.audio.add('button-click', audioData);
      this.cache.audio.add('correct-answer', audioData);
      this.cache.audio.add('wrong-answer', audioData);

      audioContext.close();
    } catch (error) {
      console.warn('Could not create audio placeholders:', error);

      // Fallback to empty buffers if AudioContext fails
      this.cache.audio.add('main-theme', { data: new ArrayBuffer(0) });
      this.cache.audio.add('button-click', { data: new ArrayBuffer(0) });
      this.cache.audio.add('correct-answer', { data: new ArrayBuffer(0) });
      this.cache.audio.add('wrong-answer', { data: new ArrayBuffer(0) });
    }
  }
}

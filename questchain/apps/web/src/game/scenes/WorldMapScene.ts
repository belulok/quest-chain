import * as Phaser from 'phaser';

// Make sure Phaser is defined
const PhaserType = Phaser || (window as any).Phaser;

// Import UI helpers
import { createSidebar } from '../ui/Sidebar';

// Import wallet bridge
import { isWalletConnected } from '../utils/WalletBridge';

// Define biome types
type BiomeType = 'starter' | 'binary' | 'algebra' | 'crypto' | 'logic' | 'network';

interface Biome {
  id: string;
  name: string;
  type: BiomeType;
  requiredXp: number;
  unlocked: boolean;
  completed: boolean;
  x: number;
  y: number;
}

export class WorldMapScene extends Phaser.Scene {
  private skyBackground!: Phaser.GameObjects.Image;
  private islandImage!: Phaser.GameObjects.Image;
  private player!: Phaser.GameObjects.Sprite;
  private biomes: Biome[] = [];
  private playerPosition = { x: 0, y: 0 }; // Will be set based on island center
  private sidebar!: Phaser.GameObjects.Container;
  private biomeInfoPanel!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private levelText!: Phaser.GameObjects.Text;
  private powerText!: Phaser.GameObjects.Text;
  private powerBar!: Phaser.GameObjects.Rectangle;
  private fogLayer!: Phaser.GameObjects.Graphics;
  private isLoggedIn: boolean = false;
  private worldMapText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'WorldMapScene' });
  }

  init(data: any) {
    // Check if the player is logged in - use the wallet bridge to get the actual status
    const walletConnected = isWalletConnected();
    this.isLoggedIn = data?.isLoggedIn || walletConnected;

    console.log('WorldMapScene init with wallet status:', {
      dataIsLoggedIn: data?.isLoggedIn,
      walletConnected,
      finalIsLoggedIn: this.isLoggedIn
    });

    // Check if we should fade in
    if (data?.fadeIn) {
      // Start with a black screen and fade in
      this.cameras.main.fadeIn(1000, 0, 0, 0);
      console.log('Fade-in effect activated in WorldMapScene');
    } else {
      // If not coming from a fade transition, still start with a fade in for consistency
      this.cameras.main.fadeIn(1000, 0, 0, 0);
    }
  }

  create() {
    // Initialize biomes
    this.initializeBiomes();

    // Create sky background
    this.createSkyBackground();

    // Create the world map island
    this.createWorldMap();

    // Create player character
    this.createPlayer();

    // Create UI elements
    this.createUI();

    // Create biome info panel (hidden by default)
    this.createBiomeInfoPanel();

    // Set up input controls
    this.setupControls();

    // Note: Fog of war effect is now created after the island is loaded in createWorldMap()

    // Add world map text at bottom
    this.createWorldMapText();
  }

  update() {
    // Handle player movement
    this.handlePlayerMovement();

    // Check if player is on a biome tile
    this.checkBiomeInteraction();
  }

  private initializeBiomes() {
    // This would come from the blockchain in a real implementation
    this.biomes = [
      { id: 'b1', name: 'Starter Green', type: 'starter', requiredXp: 0, unlocked: true, completed: true, x: 5, y: 4 },
      { id: 'b2', name: 'Binary Caves', type: 'binary', requiredXp: 1000, unlocked: true, completed: false, x: 6, y: 4 },
      { id: 'b3', name: 'Algebra Peaks', type: 'algebra', requiredXp: 2500, unlocked: true, completed: false, x: 7, y: 3 },
      { id: 'b4', name: 'Crypto Valley', type: 'crypto', requiredXp: 4000, unlocked: true, completed: false, x: 8, y: 3 },
      { id: 'b5', name: 'Logic Forest', type: 'logic', requiredXp: 6000, unlocked: false, completed: false, x: 7, y: 5 },
      { id: 'b6', name: 'Network Nexus', type: 'network', requiredXp: 8000, unlocked: false, completed: false, x: 9, y: 4 },
    ];
  }

  private createSkyBackground() {
    // Force reload the sky.png asset directly to ensure it's used
    this.load.image('sky-bg', '/assets/QuestChain Assets/sky.png');
    this.load.once('complete', () => {
      // Add sky background using the specified asset
      this.skyBackground = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'sky-bg');

      // Make sure the sky covers the entire screen
      this.skyBackground.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

      // Fix the sky to the camera so it doesn't move when the camera moves
      this.skyBackground.setScrollFactor(0);
    });
    this.load.start();
  }

  private createWorldMap() {
    // Add the island image to the center of the screen
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Force reload the island full.png asset directly to ensure it's used
    this.load.image('island-full', '/assets/QuestChain Assets/island full.png');
    this.load.once('complete', () => {
      // Load the island image
      this.islandImage = this.add.image(centerX, centerY, 'island-full');

      // Set the island to half its size as requested by the user
      this.islandImage.setScale(0.5);

      // Grid overlay removed as requested by user
      // this.createGridOverlay();

      // Create fog of war effect after island is loaded
      this.createFogOfWar();
    });
    this.load.start();
  }

  private createGridOverlay() {
    // Create a grid overlay to help with biome placement
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.15); // Thin white lines, very subtle transparency (reduced from 0.3 to 0.15)

    // Get the bounds of the island image
    const bounds = this.islandImage.getBounds();
    const gridSize = 32; // Size of each grid cell

    // Draw vertical lines
    for (let x = bounds.left; x <= bounds.right; x += gridSize) {
      graphics.lineBetween(x, bounds.top, x, bounds.bottom);
    }

    // Draw horizontal lines
    for (let y = bounds.top; y <= bounds.bottom; y += gridSize) {
      graphics.lineBetween(bounds.left, y, bounds.right, y);
    }
  }

  private createPlayer() {
    // Position the player at the center of the island
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Create player sprite using the human.png asset
    // Make sure we're using the correct asset key that was loaded in PreloadScene
    if (!this.textures.exists('character')) {
      console.log('Loading character texture directly');
      // If the texture doesn't exist yet, load it directly
      this.load.image('character', '/assets/QuestChain Assets/human.png');
      this.load.once('complete', () => this.createPlayerSprite(centerX, centerY));
      this.load.start();
    } else {
      console.log('Using existing character texture');
      this.createPlayerSprite(centerX, centerY);
    }
  }

  private createPlayerSprite(centerX: number, centerY: number) {
    // Create player sprite using the human.png asset
    this.player = this.add.sprite(centerX, centerY, 'character');
    console.log('Player sprite created with texture:', this.player.texture.key);

    // Set scale for the character to match one grid cell (32px)
    // The human.png is 1024x1024, so we need a very small scale
    this.player.setScale(0.03);

    // Set the player's depth to ensure it appears above the island but below UI elements
    this.player.setDepth(10);

    // Store the player's position for interaction checks
    this.playerPosition = {
      x: Math.floor(centerX / 32),
      y: Math.floor(centerY / 32)
    };

    // Add a very subtle floating animation for the small character
    this.tweens.add({
      targets: this.player,
      y: centerY - 2, // Move just slightly up (reduced from 5 to 2)
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createUI() {
    // Create the right sidebar with player stats and buttons
    this.createSidebar();

    // Create the level and power display in the top-right corner
    this.createStatsDisplay();
  }

  private createSidebar() {
    // Create sidebar with player stats
    const playerStats = {
      level: 1, // Start with level 1 as requested
      power: 10, // Match the reference image
      xp: 4200,
      maxXp: 5000
    };

    // Create the sidebar container
    const sidebarX = this.cameras.main.width - 120;
    const sidebarY = this.cameras.main.height / 2;

    // Create the sidebar background - dark blue color to match the reference image
    const sidebarBg = this.add.rectangle(sidebarX, sidebarY, 180, 350, 0x1e293b, 1)
      .setStrokeStyle(2, 0x64748b)
      .setScrollFactor(0)
      .setDepth(20);

    // Add level text at the top of the sidebar
    const levelText = this.add.text(sidebarX, sidebarY - 140, 'LEVEL 1', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffd700', // Yellow color to match the reference image
      align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(21);

    // Add power text below level
    const powerText = this.add.text(sidebarX, sidebarY - 110, 'POWER 10', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffd700', // Yellow color to match the reference image
      align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(21);

    // Add progress bar
    const barWidth = 140;
    const barHeight = 16;

    // Bar background (dark color)
    const progressBarBg = this.add.rectangle(sidebarX, sidebarY - 80, barWidth, barHeight, 0x333333)
      .setScrollFactor(0)
      .setDepth(21);

    // Bar fill - yellow indicator
    const progressBarFill = this.add.rectangle(
      sidebarX - barWidth/2,
      sidebarY - 80,
      barWidth * 0.1, // Just show a small amount for level 1
      barHeight,
      0xffd700 // Yellow color to match the reference image
    ).setOrigin(0, 0.5).setScrollFactor(0).setDepth(22);

    // Add a small yellow square at the beginning of the progress bar
    const progressIndicator = this.add.rectangle(
      sidebarX - barWidth/2,
      sidebarY - 80,
      barHeight, // Square with same height as bar
      barHeight,
      0xffd700
    ).setOrigin(0, 0.5).setScrollFactor(0).setDepth(23);

    // Create the buttons using the actual assets
    this.createSidebarButtons(sidebarX, sidebarY);
  }

  private createSidebarButtons(sidebarX: number, sidebarY: number) {
    // Create button backgrounds - tan/beige color with brown border to match the reference image

    // Inventory button
    const inventoryBg = this.add.rectangle(sidebarX, sidebarY - 30, 140, 30, 0xf5d7a3)
      .setStrokeStyle(3, 0x8b4513)
      .setScrollFactor(0)
      .setDepth(21);

    const inventoryText = this.add.text(sidebarX, sidebarY - 30, 'INVENTORY', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#8b4513', // Brown text
      align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(22);

    // Quest board button
    const questBoardBg = this.add.rectangle(sidebarX, sidebarY + 10, 140, 30, 0xf5d7a3)
      .setStrokeStyle(3, 0x8b4513)
      .setScrollFactor(0)
      .setDepth(21);

    const questBoardText = this.add.text(sidebarX, sidebarY + 10, 'QUEST\nBOARD', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#8b4513', // Brown text
      align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(22);

    // Boss raid button
    const bossRaidBg = this.add.rectangle(sidebarX, sidebarY + 50, 140, 30, 0xf5d7a3)
      .setStrokeStyle(3, 0x8b4513)
      .setScrollFactor(0)
      .setDepth(21);

    const bossRaidText = this.add.text(sidebarX, sidebarY + 50, 'BOSS RAID', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#8b4513', // Brown text
      align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(22);

    // Make the backgrounds interactive
    inventoryBg.setInteractive();
    questBoardBg.setInteractive();
    bossRaidBg.setInteractive();

    // Add hover effects and click handlers
    this.addButtonInteractions(inventoryBg, 'InventoryScene');
    this.addButtonInteractions(questBoardBg, 'QuestBoardScene');
    this.addButtonInteractions(bossRaidBg, 'BossRaidScene');
  }

  private addButtonInteractions(button: Phaser.GameObjects.Rectangle, targetScene: string) {
    button.on('pointerover', () => {
      button.setFillStyle(0xffe0b3); // Lighter color on hover
    });

    button.on('pointerout', () => {
      button.setFillStyle(0xf5d7a3); // Back to normal color
    });

    button.on('pointerdown', () => {
      try {
        if (this.cache.audio.exists('button-click')) {
          this.sound.play('button-click');
        }
      } catch (error) {
        console.warn('Error playing button click sound:', error);
      }

      // Transition to the target scene
      this.scene.start(targetScene);
    });
  }

  private createStatsDisplay() {
    // We'll hide this display since we're now showing the stats in the sidebar
    // This method is kept for compatibility but doesn't create any visible elements
  }

  private createBiomeInfoPanel() {
    // Create a panel to show biome information when hovering
    this.biomeInfoPanel = this.add.container(0, 0);

    const panel = this.add.image(0, 0, 'panel');
    const title = this.add.text(0, -40, '', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const description = this.add.text(0, 0, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#cccccc',
      wordWrap: { width: 200 }
    }).setOrigin(0.5);

    const xpRequired = this.add.text(0, 40, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ffff00'
    }).setOrigin(0.5);

    this.biomeInfoPanel.add([panel, title, description, xpRequired]);
    this.biomeInfoPanel.setVisible(false);
    this.biomeInfoPanel.setScrollFactor(0);
  }

  private setupControls() {
    // Set up cursor keys
    this.cursors = this.input.keyboard.createCursorKeys();

    // Set up WASD keys
    this.wasdKeys = {
      W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    // Add key for inventory
    const inventoryKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    inventoryKey.on('down', () => {
      this.scene.launch('InventoryScene');
      this.scene.pause();
    });

    // Add key for leaderboard
    const leaderboardKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    leaderboardKey.on('down', () => {
      this.scene.launch('LeaderboardScene');
      this.scene.pause();
    });
  }

  private createFogOfWar() {
    // Create a fog of war effect that reveals areas as the player explores
    this.fogLayer = this.add.graphics();
    this.fogLayer.fillStyle(0x000000, 0.3); // Reduced opacity from 0.7 to 0.3

    // Get the bounds of the island image
    const bounds = this.islandImage.getBounds();
    this.fogLayer.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);

    // Set the depth of the fog layer to be above the island but below the player
    this.fogLayer.setDepth(5);

    // Clear fog around player and unlocked biomes
    this.clearFogAroundPlayer();

    // Update fog when player moves
    this.events.on('player-moved', () => {
      this.clearFogAroundPlayer();
    });
  }

  private clearFogAroundPlayer() {
    // Skip if fogLayer or player isn't initialized yet
    if (!this.fogLayer || !this.player) return;

    // Clear fog in a circle around the player
    this.fogLayer.clear();

    // Get the bounds of the island image
    const bounds = this.islandImage.getBounds();
    this.fogLayer.fillStyle(0x000000, 0.3); // Reduced opacity from 0.7 to 0.3
    this.fogLayer.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);

    // Create a circle mask around player
    const playerX = this.player.x;
    const playerY = this.player.y;
    const radius = 200; // Increased visibility radius from 100 to 200

    this.fogLayer.fillStyle(0x000000, 0);
    this.fogLayer.fillCircle(playerX, playerY, radius);

    // Also clear fog around unlocked biomes
    this.biomes.forEach(biome => {
      if (biome.unlocked) {
        // Calculate biome position based on grid
        const biomeX = bounds.left + (bounds.width * (biome.x / 20)) + bounds.width / 40;
        const biomeY = bounds.top + (bounds.height * (biome.y / 15)) + bounds.height / 30;
        this.fogLayer.fillCircle(biomeX, biomeY, 80); // Increased radius from 40 to 80
      }
    });
  }

  private handlePlayerMovement() {
    // Skip if player isn't initialized yet
    if (!this.player) return;

    // Movement speed
    const speed = 3;
    let moved = false;

    // Handle arrow key movement
    if (this.cursors.left.isDown || this.wasdKeys.A.isDown) {
      this.player.x -= speed;
      moved = true;
    } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
      this.player.x += speed;
      moved = true;
    }

    if (this.cursors.up.isDown || this.wasdKeys.W.isDown) {
      this.player.y -= speed;
      moved = true;
    } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
      this.player.y += speed;
      moved = true;
    }

    // If player moved, update their grid position for biome interaction
    if (moved) {
      // Update player position in grid coordinates
      this.playerPosition = {
        x: Math.floor(this.player.x / 32),
        y: Math.floor(this.player.y / 32)
      };

      // Emit player-moved event to update fog of war
      this.events.emit('player-moved');
    }

    // Keep player within the bounds of the island
    const bounds = this.islandImage.getBounds();
    const padding = 20; // Add some padding to keep player fully visible

    this.player.x = Phaser.Math.Clamp(
      this.player.x,
      bounds.left + padding,
      bounds.right - padding
    );

    this.player.y = Phaser.Math.Clamp(
      this.player.y,
      bounds.top + padding,
      bounds.bottom - padding
    );
  }

  private createWorldMapText() {
    // Add the "WORLD MAP" text at the bottom of the screen
    this.worldMapText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height - 40,
      'WORLD MAP',
      {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6
      }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(30);
  }

  private checkBiomeInteraction() {
    // Check if player is on a biome tile
    const biome = this.biomes.find(b =>
      b.x === this.playerPosition.x && b.y === this.playerPosition.y
    );

    if (biome) {
      // Show biome info panel
      this.showBiomeInfo(biome);

      // Check for interaction (spacebar or enter)
      const spaceKey = this.input.keyboard.checkDown(this.cursors.space, 500);
      const enterKey = this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER), 500);

      if ((spaceKey || enterKey) && biome.unlocked) {
        this.enterBiome(biome);
      }
    } else {
      // Hide biome info panel
      this.biomeInfoPanel.setVisible(false);
    }
  }

  private showBiomeInfo(biome: Biome) {
    // Update and show the biome info panel
    const title = this.biomeInfoPanel.getAt(1) as Phaser.GameObjects.Text;
    const description = this.biomeInfoPanel.getAt(2) as Phaser.GameObjects.Text;
    const xpRequired = this.biomeInfoPanel.getAt(3) as Phaser.GameObjects.Text;

    title.setText(biome.name);

    // Set description based on biome status
    if (!biome.unlocked) {
      description.setText(`Locked - Requires more XP to unlock`);
      xpRequired.setText(`Required XP: ${biome.requiredXp}`);
      xpRequired.setVisible(true);
    } else if (biome.completed) {
      description.setText(`Completed - Press SPACE to revisit`);
      xpRequired.setVisible(false);
    } else {
      description.setText(`Press SPACE to enter`);
      xpRequired.setVisible(false);
    }

    // Position panel near the player but within screen bounds
    // Use default position if player isn't initialized yet
    const playerX = this.player ? this.player.x : this.cameras.main.width / 2;
    const playerY = this.player ? this.player.y : this.cameras.main.height / 2;

    const x = Phaser.Math.Clamp(
      playerX,
      this.cameras.main.width * 0.2,
      this.cameras.main.width * 0.8
    );

    const y = Phaser.Math.Clamp(
      playerY - 100,
      this.cameras.main.height * 0.2,
      this.cameras.main.height * 0.8
    );

    this.biomeInfoPanel.setPosition(x, y);
    this.biomeInfoPanel.setVisible(true);
  }

  private enterBiome(biome: Biome) {
    // Transition to the appropriate scene based on biome type
    switch (biome.type) {
      case 'starter':
      case 'binary':
      case 'algebra':
      case 'crypto':
      case 'logic':
      case 'network':
        // Go to quest board for this biome
        this.scene.start('QuestBoardScene', { biomeId: biome.id, biomeType: biome.type });
        break;
    }
  }

  private getBiomeColor(type: BiomeType): number {
    switch (type) {
      case 'starter': return 0x00ff00; // Green
      case 'binary': return 0x0000ff; // Blue
      case 'algebra': return 0xff0000; // Red
      case 'crypto': return 0xffff00; // Yellow
      case 'logic': return 0xff00ff; // Purple
      case 'network': return 0x00ffff; // Cyan
      default: return 0xffffff; // White
    }
  }
}

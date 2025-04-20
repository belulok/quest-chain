import * as Phaser from 'phaser';

// Make sure Phaser is defined
const PhaserType = Phaser || (window as any).Phaser;

// Import UI helpers
import { createWalletButton } from '../ui/WalletButton';
import { isWalletConnected, connectWallet } from '../utils/WalletBridge';

export class MainMenuScene extends Phaser.Scene {
  private music!: Phaser.Sound.BaseSound;
  private startButton!: Phaser.GameObjects.Image;
  private questBoardSign!: Phaser.GameObjects.Image;
  private worldMapPortal!: Phaser.GameObjects.Image;
  private character!: Phaser.GameObjects.Sprite;
  private clouds: Phaser.GameObjects.Image[] = [];
  private walletButton!: Phaser.GameObjects.Container;
  private isLoggedIn: boolean = false;
  private createEntranceEffect: boolean = false;

  constructor() {
    super({ key: 'MainMenuScene' });
  }

  init(data: any) {
    // Check if the player is logged in - use the wallet bridge to get the actual status
    const walletConnected = isWalletConnected();
    this.isLoggedIn = data?.isLoggedIn || walletConnected;

    console.log('MainMenuScene init with wallet status:', {
      dataIsLoggedIn: data?.isLoggedIn,
      walletConnected,
      finalIsLoggedIn: this.isLoggedIn
    });

    // Check if we should fade in (coming from PreloadScene)
    if (data?.fadeIn) {
      // Start with a black screen and fade in
      this.cameras.main.fadeIn(1000, 0, 0, 0);

      // Add a flag to create entrance particles
      this.createEntranceEffect = true;

      console.log('Fade-in effect activated');
    } else {
      this.createEntranceEffect = false;
    }
  }

  create() {
    // Add sky background
    this.createSkyBackground();

    // Add clouds
    this.createClouds();

    // Add game logo
    this.createLogo();

    // Add login button
    this.createLoginButton();

    // Add character
    this.createCharacter();

    // Add quest board sign
    this.createQuestBoardSign();

    // Add world map portal
    this.createWorldMapPortal();

    // Add start button
    this.createStartButton();

    // Add wallet button
    this.createWalletButton();

    // Create entrance particle effect if coming from preload scene
    if (this.createEntranceEffect) {
      this.createEntranceParticles();
    }

    // Set up periodic wallet status check
    this.time.addEvent({
      delay: 5000, // Check every 5 seconds
      callback: this.checkWalletStatus,
      callbackScope: this,
      loop: true
    });

    // Try to play background music if available
    try {
      if (this.cache.audio.exists('main-theme')) {
        this.music = this.sound.add('main-theme', {
          loop: true,
          volume: 0.5
        });
        this.music.play();
      } else {
        console.warn('Main theme audio not found, skipping music playback');
      }
    } catch (error) {
      console.error('Error playing background music:', error);
    }

    // Button listeners will be added after the buttons are fully loaded
  }

  private createSkyBackground() {
    // Use the background_1.png image for the entire background
    const bg = this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Add pixel art stones/path
    const dirtHeight = 20; // Define dirtHeight here
    for (let i = 0; i < 5; i++) {
      const stoneSize = Phaser.Math.Between(10, 20);
      const x = this.cameras.main.width * 0.5 + Phaser.Math.Between(-200, 200);
      const y = this.cameras.main.height - dirtHeight - stoneSize / 2;

      this.add.circle(
        x,
        y,
        stoneSize / 2,
        0xCCCCCC // Light gray
      );
    }
  }

  private createClouds() {
    // Force reload the cloud asset directly to ensure it's used
    this.load.image('cloud-asset', '/assets/QuestChain Assets/cloud.png');
    this.load.once('complete', () => {
      // Add clouds using the actual cloud.png asset
      for (let i = 0; i < 3; i++) {
        const x = this.cameras.main.width * (0.2 + i * 0.3);
        const y = this.cameras.main.height * (0.1 + i * 0.05);

        // Create the cloud sprite using the asset
        const cloudSprite = this.add.image(x, y, 'cloud-asset');

        // Add some variation to the clouds
        const scale = 0.8 + Math.random() * 0.4; // Scale between 0.8 and 1.2
        cloudSprite.setScale(scale);

        // Add slight transparency variation
        const alpha = 0.7 + Math.random() * 0.3; // Alpha between 0.7 and 1.0
        cloudSprite.setAlpha(alpha);

        this.clouds.push(cloudSprite);
      }

      // Start cloud animation
      this.animateClouds();
    });
    this.load.start();
  }

  private animateClouds() {
    // Animate clouds to slowly move across the sky
    this.clouds.forEach((cloud, index) => {
      const direction = index === 0 ? 1 : -1; // First cloud moves right, second moves left
      const distance = this.cameras.main.width * 0.3;
      const duration = 20000; // 20 seconds for one movement

      this.tweens.add({
        targets: cloud,
        x: cloud.x + (direction * distance),
        duration: duration,
        yoyo: true,
        repeat: -1,
        ease: 'Linear'
      });
    });
  }

  private createLogo() {
    // Add the QuestChain logo exactly as shown in the reference
    const logo = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height * 0.2,
      'logo'
    ).setOrigin(0.5).setScale(0.75);

    // Make sure the logo is visible and not covered by any placeholder graphics
    logo.setDepth(10);
  }

  private createLoginButton() {
    // Login button removed from main screen
    // Login options will be shown when clicking the start button instead
  }

  private createCharacter() {
    // Add the character in the center using the full_human.png asset
    this.character = this.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height * 0.55,
      'full-character'
    ).setScale(0.5);

    // Make sure the character is visible
    this.character.setDepth(5);

    // Add simple idle animation
    this.tweens.add({
      targets: this.character,
      y: this.character.y - 5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createQuestBoardSign() {
    // Add quest board sign on the left using the quest board asset
    const signX = this.cameras.main.width * 0.2;
    const signY = this.cameras.main.height * 0.65;

    // Force reload the quest board asset directly to ensure it's used
    this.load.image('quest-sign', '/assets/QuestChain Assets/quest board.png');
    this.load.once('complete', () => {
      // Add the quest board sign image using the actual quest board asset
      // Increased scale from 0.5 to 1.0 (twice the size)
      this.questBoardSign = this.add.image(signX, signY, 'quest-sign')
        .setScale(1.0)
        .setInteractive();

      // Add hover effect
      this.questBoardSign.on('pointerover', () => {
        this.questBoardSign.setScale(1.1); // Increased hover scale
      });

      this.questBoardSign.on('pointerout', () => {
        this.questBoardSign.setScale(1.0); // Back to normal scale
      });

      // Add click handler
      this.questBoardSign.on('pointerdown', () => {
        try {
          if (this.cache.audio.exists('button-click')) {
            this.sound.play('button-click');
          }
        } catch (error) {
          console.warn('Error playing button click sound:', error);
        }

        this.scene.start('QuestBoardScene');
      });
    });
    this.load.start();

    // No need to add text as it's already in the image
  }

  private createWorldMapPortal() {
    // Add world map portal on the right using the world map asset
    const portalX = this.cameras.main.width * 0.8;
    const portalY = this.cameras.main.height * 0.65;

    // Create a frame for the portal - smaller size
    const frame = this.add.rectangle(portalX, portalY, 50, 65, 0x666666) // Gray
      .setStrokeStyle(3, 0x333333); // Darker gray border

    // Add the world map image as the portal - half the size
    this.worldMapPortal = this.add.image(portalX, portalY, 'world-map')
      .setScale(0.75) // Half the previous scale of 1.5
      .setInteractive();

    // Add a cyan glow effect around the portal - smaller size
    const glow = this.add.rectangle(portalX, portalY, 40, 55, 0x00ffff, 0.3);

    // Store reference to the portal
    this.worldMapPortal = this.worldMapPortal;

    // No need to add text as it's already in the image

    // Add hover effect - smaller hover scale
    this.worldMapPortal.on('pointerover', () => {
      this.worldMapPortal.setScale(0.8); // Half the previous scale of 1.6
    });

    this.worldMapPortal.on('pointerout', () => {
      this.worldMapPortal.setScale(0.75); // Half the previous scale of 1.5
    });

    // Add subtle pulsing animation to portal - smaller pulse scale
    this.tweens.add({
      targets: this.worldMapPortal,
      scaleX: 0.8, // Half the previous scale of 1.6
      scaleY: 0.8, // Half the previous scale of 1.6
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Add click handler
    this.worldMapPortal.on('pointerdown', () => {
      try {
        if (this.cache.audio.exists('button-click')) {
          this.sound.play('button-click');
        }
      } catch (error) {
        console.warn('Error playing button click sound:', error);
      }

      // Transition to WorldMapScene with fade effect
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('WorldMapScene', { fadeIn: true });
      });
    });
  }

  private createStartButton() {
    // Add start button at the bottom using the start button asset
    const buttonX = this.cameras.main.width / 2;
    const buttonY = this.cameras.main.height * 0.85;

    // Create a debug message to check if the asset is loaded
    console.log('Start button asset loaded:', this.textures.exists('start-button'));

    // Force reload the start.png asset directly to ensure it's used
    this.load.image('start-button', '/assets/QuestChain Assets/start.png');
    this.load.once('complete', () => {
      // Add the start button image using the actual start.png asset
      this.startButton = this.add.image(buttonX, buttonY, 'start-button')
        .setScale(1) // Reduced to half the previous size (was 2)
        .setInteractive();

      // Make sure the start button is visible
      this.startButton.setDepth(5);

      // Add hover effect
      this.startButton.on('pointerover', () => {
        this.startButton.setScale(1.05); // Reduced hover scale (was 2.1)
      });

      this.startButton.on('pointerout', () => {
        this.startButton.setScale(1); // Back to normal scale
      });

      // Add the click handler
      this.addButtonListeners();
    });
    this.load.start();
  }

  private createWalletButton() {
    // Create wallet button in the top right corner
    this.walletButton = createWalletButton(this, this.isLoggedIn);
    this.walletButton.setPosition(this.cameras.main.width - 80, 40); // Moved more to the left and lower to prevent being cut off
    this.walletButton.setDepth(10); // Ensure it's visible above other elements
    this.add.existing(this.walletButton);

    // Listen for wallet connection events
    this.events.on('walletConnected', this.handleWalletConnected, this);
    this.events.on('walletDisconnected', this.handleWalletDisconnected, this);
  }

  private handleWalletConnected() {
    console.log('Wallet connected event received');

    // Double-check the wallet is actually connected
    const actuallyConnected = isWalletConnected();
    console.log('Verifying wallet connection:', actuallyConnected);

    if (actuallyConnected) {
      this.isLoggedIn = true;

      // Show success message
      const successText = this.add.text(
        this.cameras.main.width / 2,
        100,
        'Wallet Connected!',
        {
          fontFamily: 'monospace',
          fontSize: '24px',
          color: '#00ff00',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 }
        }
      ).setOrigin(0.5).setDepth(100);

      // Fade out after a few seconds
      this.tweens.add({
        targets: successText,
        alpha: 0,
        duration: 2000,
        delay: 1500,
        onComplete: () => {
          successText.destroy();
        }
      });
    } else {
      console.warn('Received wallet connected event but wallet is not actually connected');
    }
  }

  private handleWalletDisconnected() {
    console.log('Wallet disconnected event received');

    // Double-check the wallet is actually disconnected
    const stillConnected = isWalletConnected();
    console.log('Verifying wallet disconnection:', { stillConnected });

    if (!stillConnected) {
      this.isLoggedIn = false;

      // Show disconnection message
      const disconnectText = this.add.text(
        this.cameras.main.width / 2,
        100,
        'Wallet Disconnected',
        {
          fontFamily: 'monospace',
          fontSize: '24px',
          color: '#ff9900',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 }
        }
      ).setOrigin(0.5).setDepth(100);

      // Fade out after a few seconds
      this.tweens.add({
        targets: disconnectText,
        alpha: 0,
        duration: 2000,
        delay: 1500,
        onComplete: () => {
          disconnectText.destroy();
        }
      });
    } else {
      console.warn('Received wallet disconnected event but wallet is still connected');
    }
  }

  private checkWalletStatus() {
    // Get the current wallet connection status
    const currentlyConnected = isWalletConnected();

    // Only log if there's a change to avoid console spam
    if (currentlyConnected !== this.isLoggedIn) {
      console.log('Wallet status changed:', {
        wasConnected: this.isLoggedIn,
        nowConnected: currentlyConnected
      });

      // Update the scene's state
      this.isLoggedIn = currentlyConnected;

      // Update the wallet button
      if (this.walletButton) {
        // Remove existing status indicator if it exists
        const existingIndicator = this.walletButton.getByName('statusIndicator');
        if (existingIndicator) {
          this.walletButton.remove(existingIndicator, true);
        }

        // Add indicator if connected
        if (currentlyConnected) {
          const statusIndicator = this.add.circle(10, -3, 2, 0x00ff00)
            .setName('statusIndicator');
          this.walletButton.add(statusIndicator);
        }
      }
    }
  }

  private addButtonListeners() {
    // Start button click handler
    this.startButton.on('pointerdown', () => {
      try {
        if (this.cache.audio.exists('button-click')) {
          this.sound.play('button-click');
        }
      } catch (error) {
        console.warn('Error playing button click sound:', error);
      }

      // Always go to world map with fade transition when start button is clicked
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('WorldMapScene', { fadeIn: true });
      });
    });
  }

  private createEntranceParticles() {
    // Create a simpler particle effect using sprites instead of emitters
    this.createStarburstEffect();
    this.createSparkleEffect();
  }

  private createStarburstEffect() {
    // Create a starburst effect from the center using individual sprites
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      // Create a small particle
      const particle = this.add.image(centerX, centerY, 'cloud-asset')
        .setScale(0.1)
        .setAlpha(0.8)
        .setTint(0xFFD700); // Gold color

      // Calculate random angle and distance
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 200;

      // Animate the particle outward
      this.tweens.add({
        targets: particle,
        x: centerX + Math.cos(angle) * speed,
        y: centerY + Math.sin(angle) * speed,
        scale: 0,
        alpha: 0,
        duration: 1500,
        onComplete: () => {
          particle.destroy();
        }
      });
    }
  }

  private createSparkleEffect() {
    // Create sparkles around the character
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height * 0.55;
    const particleCount = 15;

    // Create sparkles at intervals
    const sparkleTimer = this.time.addEvent({
      delay: 100,
      repeat: 10,
      callback: () => {
        for (let i = 0; i < 3; i++) {
          // Create a small particle
          const particle = this.add.image(
            centerX + (Math.random() * 100 - 50),
            centerY + (Math.random() * 100 - 50),
            'cloud-asset'
          )
            .setScale(0.05)
            .setAlpha(1)
            .setTint(0x00FFFF); // Cyan color

          // Animate the particle
          this.tweens.add({
            targets: particle,
            scale: 0,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
              particle.destroy();
            }
          });
        }
      }
    });

    // Stop the timer after a few seconds
    this.time.delayedCall(3000, () => {
      sparkleTimer.destroy();
    });
  }

  private showLoginOptions() {
    // Create a semi-transparent background that covers the entire screen
    const modalBg = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.7
    ).setDepth(100);

    // Create a modal for login options
    const modal = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      400,
      300,
      0x000000
    ).setStrokeStyle(2, 0xffffff).setDepth(101);

    const modalTitle = this.add.text(
      this.cameras.main.width / 2,
      modal.y - 100,
      'LOGIN OPTIONS',
      {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#ffffff'
      }
    ).setOrigin(0.5).setDepth(102);

    // Google login button using the google.png asset
    const googleButton = this.add.image(
      this.cameras.main.width / 2,
      modal.y,
      'google-button'
    ).setScale(0.1).setInteractive().setDepth(102); // 5 times smaller (0.5 -> 0.1)

    // Close button
    const closeButton = this.add.text(
      modal.x + 180,
      modal.y - 130,
      'X',
      {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#ffffff'
      }
    ).setInteractive().setDepth(102);

    // Add hover effect to Google button
    googleButton.on('pointerover', () => {
      googleButton.setScale(0.11); // Slightly larger on hover
    });

    googleButton.on('pointerout', () => {
      googleButton.setScale(0.1); // Back to normal size
    });

    // Add event listeners
    googleButton.on('pointerdown', async () => {
      try {
        if (this.cache.audio.exists('button-click')) {
          this.sound.play('button-click');
        }
      } catch (error) {
        console.warn('Error playing button click sound:', error);
      }

      // Show connecting message
      const connectingText = this.add.text(
        this.cameras.main.width / 2,
        modal.y + 80,
        'Connecting to Google...',
        {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: '#ffffff',
          backgroundColor: '#333333',
          padding: { x: 10, y: 5 }
        }
      ).setOrigin(0.5).setDepth(103);

      // Disable the button while connecting
      googleButton.disableInteractive();
      googleButton.setAlpha(0.5);

      try {
        // Trigger the real wallet connection flow
        const result = await connectWallet();

        if (result.success) {
          console.log('Wallet connection successful');
          this.isLoggedIn = true;

          // Remove the modal with success message
          const successText = this.add.text(
            this.cameras.main.width / 2,
            modal.y + 80,
            'Connection successful!',
            {
              fontFamily: 'monospace',
              fontSize: '16px',
              color: '#00ff00',
              backgroundColor: '#333333',
              padding: { x: 10, y: 5 }
            }
          ).setOrigin(0.5).setDepth(103);

          // Remove connecting text
          connectingText.destroy();

          // Wait a moment before closing the modal
          this.time.delayedCall(1000, () => {
            modalBg.destroy();
            modal.destroy();
            modalTitle.destroy();
            googleButton.destroy();
            closeButton.destroy();
            successText.destroy();

            // Refresh the scene or update UI as needed
            this.scene.restart({ isLoggedIn: true });
          });
        } else {
          console.log('Wallet connection failed:', result.error);

          // Remove connecting text
          connectingText.destroy();

          // Show error message
          const errorText = this.add.text(
            this.cameras.main.width / 2,
            modal.y + 80,
            result.error || 'Connection failed. Please try again.',
            {
              fontFamily: 'monospace',
              fontSize: '16px',
              color: '#ff0000',
              backgroundColor: '#333333',
              padding: { x: 10, y: 5 }
            }
          ).setOrigin(0.5).setDepth(103);

          // Re-enable the button
          googleButton.setInteractive();
          googleButton.setAlpha(1.0);

          // Remove error message after a few seconds
          this.time.delayedCall(3000, () => {
            errorText.destroy();
          });
        }
      } catch (error) {
        console.error('Error during wallet connection:', error);

        // Remove connecting text
        connectingText.destroy();

        // Show error message
        const errorText = this.add.text(
          this.cameras.main.width / 2,
          modal.y + 80,
          'Connection error. Please try again.',
          {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ff0000',
            backgroundColor: '#333333',
            padding: { x: 10, y: 5 }
          }
        ).setOrigin(0.5).setDepth(103);

        // Re-enable the button
        googleButton.setInteractive();
        googleButton.setAlpha(1.0);

        // Remove error message after a few seconds
        this.time.delayedCall(3000, () => {
          errorText.destroy();
        });
      }
    });

    closeButton.on('pointerdown', () => {
      try {
        if (this.cache.audio.exists('button-click')) {
          this.sound.play('button-click');
        }
      } catch (error) {
        console.warn('Error playing button click sound:', error);
      }

      modalBg.destroy();
      modal.destroy();
      modalTitle.destroy();
      googleButton.destroy();
      closeButton.destroy();
    });
  }
}

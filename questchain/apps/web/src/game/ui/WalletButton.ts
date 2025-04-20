import * as Phaser from 'phaser';
import { isWalletConnected, getWalletAddress, connectWallet, disconnectWallet, formatAddress } from '../utils/WalletBridge';

export function createWalletButton(scene: Phaser.Scene, initialConnected: boolean): Phaser.GameObjects.Container {
  // Create a container to hold all wallet button elements
  const container = scene.add.container(0, 0);

  // Create the wallet button using the preloaded image
  const walletButton = scene.add.image(0, 0, 'wallet-button')
    .setScale(0.13) // Extremely reduced size (was 0.4)
    .setInteractive();

  // Add the button to the container
  container.add(walletButton);

  // Check the actual wallet connection status from the bridge
  const actuallyConnected = isWalletConnected();
  console.log('Creating wallet button with connection status:', { initialConnected, actuallyConnected });

  // Add a green dot indicator if the wallet is connected
  let statusIndicator: Phaser.GameObjects.Arc | null = null;
  if (actuallyConnected) {
    statusIndicator = scene.add.circle(10, -3, 2, 0x00ff00) // Adjusted position and size for tiny button
      .setName('statusIndicator');
    container.add(statusIndicator);
  }

  // Add hover effect
  walletButton.on('pointerover', () => {
    walletButton.setScale(0.15); // Slightly larger on hover
  });

  walletButton.on('pointerout', () => {
    walletButton.setScale(0.13); // Back to normal size
  });

  // Add click handler
  walletButton.on('pointerdown', async () => {
    try {
      if (scene.cache.audio.exists('button-click')) {
        scene.sound.play('button-click');
      }
    } catch (error) {
      console.warn('Error playing button click sound:', error);
    }

    // Double-check the actual wallet connection status from the bridge
    const actuallyConnected = isWalletConnected();
    console.log('Wallet button clicked, connection status:', actuallyConnected);

    if (!actuallyConnected) {
      // Show connecting message
      // Get the canvas dimensions safely
      const canvasWidth = scene.scale.width || 800;
      const canvasHeight = scene.scale.height || 600;

      const connectingText = scene.add.text(
        canvasWidth / 2,
        canvasHeight / 2,
        'Connecting mock wallet...',
        {
          fontFamily: 'monospace',
          fontSize: '24px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 20, y: 10 }
        }
      ).setOrigin(0.5).setDepth(100);

      // Trigger the mock wallet connection flow
      const result = await connectWallet();

      // Remove connecting message
      connectingText.destroy();

      if (result.success) {
        console.log('Wallet connection successful');

        // Add the green dot indicator if connection was successful
        if (!container.getByName('statusIndicator')) {
          statusIndicator = scene.add.circle(10, -3, 2, 0x00ff00)
            .setName('statusIndicator');
          container.add(statusIndicator);
        }

        // Refresh the scene or update UI as needed
        scene.events.emit('walletConnected');
      } else {
        console.log('Wallet connection failed:', result.error);

        // Show specific error message
        // Get the canvas dimensions safely
        const canvasWidth = scene.scale.width || 800;
        const canvasHeight = scene.scale.height || 600;

        const errorText = scene.add.text(
          canvasWidth / 2,
          canvasHeight / 2,
          result.error || 'Connection failed. Please try again.',
          {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#ff0000',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
          }
        ).setOrigin(0.5).setDepth(100);

        // Fade out after a few seconds
        scene.tweens.add({
          targets: errorText,
          alpha: 0,
          duration: 2000,
          delay: 2000,
          onComplete: () => {
            errorText.destroy();
          }
        });
      }
    } else {
      // Show wallet details or disconnect options
      showWalletDetails(scene, container);
    }
  });

  return container;
}

function showWalletDetails(scene: Phaser.Scene, walletButton: Phaser.GameObjects.Container) {
  // Create a dropdown panel for wallet details
  const panel = scene.add.container(0, 60);

  // Background
  const bg = scene.add.rectangle(0, 0, 200, 120, 0x333333, 0.9)
    .setStrokeStyle(2, 0xffd700);

  // Get the actual wallet address from the bridge
  const walletAddress = getWalletAddress();
  const formattedAddress = formatAddress(walletAddress);

  // Wallet address (shortened)
  const address = scene.add.text(
    0,
    -40,
    `Address: ${formattedAddress}`,
    {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ffffff'
    }
  ).setOrigin(0.5);

  // Balance (placeholder for now)
  const balance = scene.add.text(
    0,
    -10,
    'Balance: -- SUI',
    {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ffffff'
    }
  ).setOrigin(0.5);

  // Disconnect button
  const disconnectBg = scene.add.rectangle(0, 30, 160, 30, 0x660000)
    .setInteractive();

  const disconnectText = scene.add.text(
    0,
    30,
    'Disconnect',
    {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ffffff'
    }
  ).setOrigin(0.5);

  // Add components to panel
  panel.add([bg, address, balance, disconnectBg, disconnectText]);

  // Add panel to wallet button
  walletButton.add(panel);

  // Add click handler for disconnect
  disconnectBg.on('pointerdown', async () => {
    scene.sound.play('button-click');

    // Trigger the real wallet disconnection
    const success = await disconnectWallet();

    if (success) {
      // Remove the green dot indicator
      const statusIndicator = walletButton.getByName('statusIndicator');
      if (statusIndicator) {
        walletButton.remove(statusIndicator, true);
      }

      // Emit event for scene to handle
      scene.events.emit('walletDisconnected');
    }

    // Remove panel
    walletButton.remove(panel, true);
  });

  // Close panel when clicking outside
  scene.input.once('pointerdown', (pointer: Phaser.Input.Pointer) => {
    if (!disconnectBg.getBounds().contains(pointer.x, pointer.y)) {
      walletButton.remove(panel, true);
    }
  });
}

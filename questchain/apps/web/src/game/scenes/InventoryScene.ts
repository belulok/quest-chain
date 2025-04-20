import * as Phaser from 'phaser';

// Make sure Phaser is defined
const PhaserType = Phaser || (window as any).Phaser;

export class InventoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InventoryScene' });
  }

  create() {
    // This is a placeholder for the Inventory scene
    // In a full implementation, this would include:
    // - Avatar portrait
    // - Equipment slots
    // - Backpack tabs
    // - Item interactions

    // Add semi-transparent background
    this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.7
    );

    // Add inventory panel
    const panel = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      600,
      500,
      0x1e293b,
      0.9
    ).setStrokeStyle(2, 0x64748b);

    // Add title
    this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 220,
      'INVENTORY',
      {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#ffd700'
      }
    ).setOrigin(0.5);

    // Add placeholder content
    this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'Inventory content coming soon...',
      {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffffff'
      }
    ).setOrigin(0.5);

    // Add close button
    const closeButton = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 220,
      200,
      40,
      0x334155
    ).setInteractive();

    this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 220,
      'CLOSE (ESC)',
      {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff'
      }
    ).setOrigin(0.5);

    // Add hover effect
    closeButton.on('pointerover', () => {
      closeButton.setFillStyle(0x475569);
    });

    closeButton.on('pointerout', () => {
      closeButton.setFillStyle(0x334155);
    });

    // Add click handler
    closeButton.on('pointerdown', () => {
      this.sound.play('button-click');
      this.scene.resume('WorldMapScene');
      this.scene.stop();
    });

    // Add ESC key handler
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.resume('WorldMapScene');
      this.scene.stop();
    });
  }
}

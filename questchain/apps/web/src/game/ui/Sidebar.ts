import * as Phaser from 'phaser';

// Make sure Phaser is defined
const PhaserType = Phaser || (window as any).Phaser;

interface PlayerStats {
  level: number;
  power: number;
  xp: number;
  maxXp: number;
}

export function createSidebar(scene: Phaser.Scene, playerStats: PlayerStats): Phaser.GameObjects.Container {
  const container = scene.add.container(0, 0);

  // Create sidebar background
  const bg = scene.add.rectangle(0, 0, 200, 400, 0x1e293b, 0.8)
    .setStrokeStyle(2, 0x64748b);

  // Create header
  const header = scene.add.text(
    0,
    -160,
    'PLAYER STATS',
    {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffd700'
    }
  ).setOrigin(0.5);

  // Create stats text
  const levelText = scene.add.text(
    0,
    -120,
    `Level: ${playerStats.level}`,
    {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff'
    }
  ).setOrigin(0.5);

  const powerText = scene.add.text(
    0,
    -90,
    `Power: ${playerStats.power}`,
    {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff'
    }
  ).setOrigin(0.5);

  // Create XP bar
  const xpBarBg = scene.add.rectangle(0, -60, 160, 16, 0x333333);
  const xpBarFill = scene.add.rectangle(
    -80 + (playerStats.xp / playerStats.maxXp) * 80,
    -60,
    (playerStats.xp / playerStats.maxXp) * 160,
    16,
    0x00ff00
  ).setOrigin(0, 0.5);

  const xpText = scene.add.text(
    0,
    -60,
    `${playerStats.xp}/${playerStats.maxXp}`,
    {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#000000'
    }
  ).setOrigin(0.5);

  // Create buttons
  const inventoryButton = createSidebarButton(scene, 'Inventory (I)', -20);
  const questsButton = createSidebarButton(scene, 'Quests (Q)', 20);
  const leaderboardButton = createSidebarButton(scene, 'Leaderboard (L)', 60);
  const settingsButton = createSidebarButton(scene, 'Settings (S)', 100);

  // Add components to container
  container.add([
    bg,
    header,
    levelText,
    powerText,
    xpBarBg,
    xpBarFill,
    xpText,
    inventoryButton,
    questsButton,
    leaderboardButton,
    settingsButton
  ]);

  // Add button event listeners
  inventoryButton.on('pointerdown', () => {
    scene.sound.play('button-click');
    scene.scene.launch('InventoryScene');
    scene.scene.pause();
  });

  questsButton.on('pointerdown', () => {
    scene.sound.play('button-click');
    scene.scene.launch('QuestBoardScene');
    scene.scene.pause();
  });

  leaderboardButton.on('pointerdown', () => {
    scene.sound.play('button-click');
    scene.scene.launch('LeaderboardScene');
    scene.scene.pause();
  });

  settingsButton.on('pointerdown', () => {
    scene.sound.play('button-click');
    // Show settings modal
  });

  return container;
}

function createSidebarButton(scene: Phaser.Scene, text: string, yOffset: number): Phaser.GameObjects.Rectangle {
  const button = scene.add.rectangle(0, yOffset, 160, 30, 0x334155)
    .setInteractive();

  scene.add.text(
    0,
    yOffset,
    text,
    {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ffffff'
    }
  ).setOrigin(0.5);

  // Add hover effect
  button.on('pointerover', () => {
    button.setFillStyle(0x475569);
  });

  button.on('pointerout', () => {
    button.setFillStyle(0x334155);
  });

  return button;
}

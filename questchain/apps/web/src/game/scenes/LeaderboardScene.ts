import * as Phaser from 'phaser';

// Make sure Phaser is defined
const PhaserType = Phaser || (window as any).Phaser;

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  level: number;
  avatar: string;
}

export class LeaderboardScene extends Phaser.Scene {
  private entries: LeaderboardEntry[] = [];
  private currentFilter: string = 'xp';

  constructor() {
    super({ key: 'LeaderboardScene' });
  }

  create() {
    // Add semi-transparent background
    this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.7
    );

    // Add leaderboard panel
    const panel = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      800,
      600,
      0x1e293b,
      0.9
    ).setStrokeStyle(2, 0x64748b);

    // Add title
    this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 270,
      'LEADERBOARD',
      {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#ffd700'
      }
    ).setOrigin(0.5);

    // Add filter buttons
    this.createFilterButtons();

    // Load leaderboard data
    this.loadLeaderboardData();

    // Display leaderboard entries
    this.displayLeaderboard();

    // Add close button
    const closeButton = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 270,
      200,
      40,
      0x334155
    ).setInteractive();

    this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 270,
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

  private createFilterButtons() {
    const filters = [
      { key: 'xp', label: 'XP' },
      { key: 'level', label: 'Level' },
      { key: 'quests', label: 'Quests' },
      { key: 'raids', label: 'Raids' }
    ];

    const startX = this.cameras.main.width / 2 - 300;
    const y = this.cameras.main.height / 2 - 220;
    const width = 150;
    const padding = 10;

    filters.forEach((filter, index) => {
      const x = startX + index * (width + padding);

      const button = this.add.rectangle(x, y, width, 40, 0x334155)
        .setInteractive();

      const text = this.add.text(
        x,
        y,
        filter.label,
        {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: '#ffffff'
        }
      ).setOrigin(0.5);

      // Highlight the current filter
      if (filter.key === this.currentFilter) {
        button.setFillStyle(0x475569);
        button.setStrokeStyle(2, 0xffd700);
      }

      // Add hover effect
      button.on('pointerover', () => {
        if (filter.key !== this.currentFilter) {
          button.setFillStyle(0x475569);
        }
      });

      button.on('pointerout', () => {
        if (filter.key !== this.currentFilter) {
          button.setFillStyle(0x334155);
        }
      });

      // Add click handler
      button.on('pointerdown', () => {
        this.sound.play('button-click');
        this.currentFilter = filter.key;
        this.scene.restart();
      });
    });
  }

  private loadLeaderboardData() {
    // This would come from the blockchain in a real implementation
    this.entries = [
      { rank: 1, name: 'CryptoWizard', xp: 12500, level: 25, avatar: 'avatar1' },
      { rank: 2, name: 'BlockchainNinja', xp: 11200, level: 22, avatar: 'avatar2' },
      { rank: 3, name: 'CodeMaster', xp: 10800, level: 21, avatar: 'avatar3' },
      { rank: 4, name: 'AlgorithmQueen', xp: 9500, level: 19, avatar: 'avatar4' },
      { rank: 5, name: 'ByteSlayer', xp: 8900, level: 18, avatar: 'avatar5' },
      { rank: 6, name: 'LogicLord', xp: 8200, level: 16, avatar: 'avatar6' },
      { rank: 7, name: 'DataDragon', xp: 7800, level: 15, avatar: 'avatar7' },
      { rank: 8, name: 'HashHunter', xp: 7200, level: 14, avatar: 'avatar8' },
      { rank: 9, name: 'QuantumCoder', xp: 6500, level: 13, avatar: 'avatar9' },
      { rank: 10, name: 'CipherSage', xp: 6100, level: 12, avatar: 'avatar10' }
    ];

    // Sort based on current filter
    if (this.currentFilter === 'level') {
      this.entries.sort((a, b) => b.level - a.level);
    } else {
      // Default sort by XP
      this.entries.sort((a, b) => b.xp - a.xp);
    }

    // Update ranks
    this.entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });
  }

  private displayLeaderboard() {
    // Create header row
    const headerY = this.cameras.main.height / 2 - 170;
    const startY = headerY + 50;
    const rowHeight = 40;

    // Header columns
    this.add.text(
      this.cameras.main.width / 2 - 350,
      headerY,
      'RANK',
      {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffd700'
      }
    ).setOrigin(0.5);

    this.add.text(
      this.cameras.main.width / 2 - 200,
      headerY,
      'PLAYER',
      {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffd700'
      }
    ).setOrigin(0.5);

    this.add.text(
      this.cameras.main.width / 2,
      headerY,
      'XP',
      {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffd700'
      }
    ).setOrigin(0.5);

    this.add.text(
      this.cameras.main.width / 2 + 150,
      headerY,
      'LEVEL',
      {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffd700'
      }
    ).setOrigin(0.5);

    this.add.text(
      this.cameras.main.width / 2 + 300,
      headerY,
      'DETAILS',
      {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffd700'
      }
    ).setOrigin(0.5);

    // Add separator line
    this.add.line(
      this.cameras.main.width / 2,
      headerY + 25,
      -350,
      0,
      350,
      0,
      0xffd700
    ).setLineWidth(2);

    // Display entries
    this.entries.forEach((entry, index) => {
      const y = startY + index * rowHeight;

      // Highlight current player (placeholder)
      const isCurrentPlayer = entry.name === 'CodeMaster';
      const rowColor = isCurrentPlayer ? 0x334155 : (index % 2 === 0 ? 0x1e293b : 0x0f172a);

      // Row background
      this.add.rectangle(
        this.cameras.main.width / 2,
        y,
        700,
        rowHeight - 2,
        rowColor
      );

      // Rank
      this.add.text(
        this.cameras.main.width / 2 - 350,
        y,
        `#${entry.rank}`,
        {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: entry.rank <= 3 ? '#ffd700' : '#ffffff'
        }
      ).setOrigin(0.5);

      // Player name with avatar
      this.add.circle(
        this.cameras.main.width / 2 - 250,
        y,
        15,
        0x666666
      );

      this.add.text(
        this.cameras.main.width / 2 - 200,
        y,
        entry.name,
        {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: isCurrentPlayer ? '#00ff00' : '#ffffff'
        }
      ).setOrigin(0.5);

      // XP
      this.add.text(
        this.cameras.main.width / 2,
        y,
        entry.xp.toLocaleString(),
        {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: '#ffffff'
        }
      ).setOrigin(0.5);

      // Level
      this.add.text(
        this.cameras.main.width / 2 + 150,
        y,
        entry.level.toString(),
        {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: '#ffffff'
        }
      ).setOrigin(0.5);

      // Details button
      const detailsButton = this.add.rectangle(
        this.cameras.main.width / 2 + 300,
        y,
        100,
        30,
        0x334155
      ).setInteractive();

      this.add.text(
        this.cameras.main.width / 2 + 300,
        y,
        'View',
        {
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#ffffff'
        }
      ).setOrigin(0.5);

      // Add hover effect
      detailsButton.on('pointerover', () => {
        detailsButton.setFillStyle(0x475569);
      });

      detailsButton.on('pointerout', () => {
        detailsButton.setFillStyle(0x334155);
      });

      // Add click handler
      detailsButton.on('pointerdown', () => {
        this.sound.play('button-click');
        // Show player details (placeholder)
        this.showPlayerDetails(entry);
      });
    });
  }

  private showPlayerDetails(player: LeaderboardEntry) {
    // Create modal container
    const modal = this.add.container(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2
    );

    // Create modal background
    const bg = this.add.rectangle(0, 0, 500, 400, 0x0f172a, 0.95)
      .setStrokeStyle(2, 0xffd700);

    // Create title
    const title = this.add.text(
      0,
      -160,
      `PLAYER PROFILE: ${player.name}`,
      {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffd700'
      }
    ).setOrigin(0.5);

    // Create avatar
    const avatar = this.add.circle(-150, -80, 50, 0x666666);

    // Create stats
    const stats = [
      `Rank: #${player.rank}`,
      `Level: ${player.level}`,
      `XP: ${player.xp.toLocaleString()}`,
      `Quests Completed: ${Math.floor(player.xp / 100)}`,
      `Raids Completed: ${Math.floor(player.xp / 500)}`,
      `Badges: ${Math.floor(player.level / 5)}`
    ];

    const statsText = this.add.text(
      0,
      -80,
      stats.join('\n'),
      {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff',
        align: 'left'
      }
    ).setOrigin(0.5);

    // Create close button
    const closeButton = this.add.rectangle(0, 140, 200, 40, 0x334155)
      .setInteractive();

    const closeText = this.add.text(
      0,
      140,
      'Close',
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
      modal.destroy();
    });

    // Add components to modal
    modal.add([bg, title, avatar, statsText, closeButton, closeText]);
  }
}

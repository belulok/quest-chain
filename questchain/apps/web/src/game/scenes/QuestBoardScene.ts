import * as Phaser from 'phaser';

// Make sure Phaser is defined
const PhaserType = Phaser || (window as any).Phaser;

export class QuestBoardScene extends Phaser.Scene {
  private biomeId: string = '';
  private biomeType: string = '';

  constructor() {
    super({ key: 'QuestBoardScene' });
  }

  init(data: any) {
    // Get biome data from previous scene
    this.biomeId = data.biomeId || '';
    this.biomeType = data.biomeType || 'starter';
  }

  create() {
    // Add background based on biome type
    this.add.image(0, 0, `${this.biomeType}-bg`)
      .setOrigin(0, 0)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Add quest board title
    this.add.text(
      this.cameras.main.width / 2,
      50,
      'QUEST BOARD',
      {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5);

    // Add biome name
    this.add.text(
      this.cameras.main.width / 2,
      90,
      this.getBiomeName(),
      {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#ffd700'
      }
    ).setOrigin(0.5);

    // Create quest cards
    this.createQuestCards();

    // Add back button
    const backButton = this.add.rectangle(100, 50, 120, 40, 0x000000, 0.6)
      .setInteractive();

    this.add.text(
      100,
      50,
      '← BACK',
      {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff'
      }
    ).setOrigin(0.5);

    backButton.on('pointerdown', () => {
      this.sound.play('button-click');
      this.scene.start('WorldMapScene');
    });
  }

  private createQuestCards() {
    // Create a grid of quest cards
    const quests = this.getQuestsForBiome();
    const startX = 200;
    const startY = 180;
    const cardWidth = 220;
    const cardHeight = 300;
    const padding = 20;

    quests.forEach((quest, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const x = startX + col * (cardWidth + padding);
      const y = startY + row * (cardHeight + padding);

      this.createQuestCard(quest, x, y);
    });
  }

  private createQuestCard(quest: any, x: number, y: number) {
    // Create card background
    const card = this.add.rectangle(x, y, 200, 280, 0x333333, 0.8)
      .setStrokeStyle(2, 0xffd700)
      .setInteractive();

    // Add quest title
    this.add.text(
      x,
      y - 100,
      quest.title,
      {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffffff'
      }
    ).setOrigin(0.5);

    // Add quest image/icon
    this.add.rectangle(x, y - 40, 160, 100, 0x666666);

    // Add quest description
    this.add.text(
      x,
      y + 40,
      quest.description,
      {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#cccccc',
        wordWrap: { width: 180 }
      }
    ).setOrigin(0.5);

    // Add XP reward
    this.add.text(
      x,
      y + 100,
      `XP: ${quest.xpReward}`,
      {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#00ff00'
      }
    ).setOrigin(0.5);

    // Add hover effect
    card.on('pointerover', () => {
      card.setFillStyle(0x444444, 0.8);
    });

    card.on('pointerout', () => {
      card.setFillStyle(0x333333, 0.8);
    });

    // Add click handler
    card.on('pointerdown', () => {
      this.sound.play('button-click');
      this.scene.start('ChallengeRoomScene', { questId: quest.id });
    });
  }

  private getBiomeName(): string {
    switch (this.biomeType) {
      case 'starter': return 'Starter Green';
      case 'binary': return 'Binary Caves';
      case 'algebra': return 'Algebra Peaks';
      case 'crypto': return 'Crypto Valley';
      case 'logic': return 'Logic Forest';
      case 'network': return 'Network Nexus';
      default: return 'Unknown Biome';
    }
  }

  private getQuestsForBiome(): any[] {
    // This would come from the blockchain in a real implementation
    return [
      {
        id: 'q1',
        title: 'Binary Basics',
        description: 'Learn the fundamentals of binary numbers and operations.',
        xpReward: 100,
        difficulty: 1
      },
      {
        id: 'q2',
        title: 'Logic Gates',
        description: 'Master the art of AND, OR, and NOT gates.',
        xpReward: 150,
        difficulty: 2
      },
      {
        id: 'q3',
        title: 'Bit Manipulation',
        description: 'Advanced techniques for manipulating bits.',
        xpReward: 200,
        difficulty: 3
      },
      {
        id: 'q4',
        title: 'Binary Trees',
        description: 'Explore the structure and operations of binary trees.',
        xpReward: 250,
        difficulty: 3
      },
      {
        id: 'q5',
        title: 'Hexadecimal',
        description: 'Convert between binary, decimal, and hexadecimal.',
        xpReward: 150,
        difficulty: 2
      },
      {
        id: 'q6',
        title: 'Boss Challenge',
        description: 'Face the Binary Overlord in a coding challenge!',
        xpReward: 500,
        difficulty: 4
      }
    ];
  }
}

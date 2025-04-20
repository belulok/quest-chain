import * as Phaser from 'phaser';

// Make sure Phaser is defined
const PhaserType = Phaser || (window as any).Phaser;

interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string | number;
  type: 'mcq' | 'coding';
  initialCode?: string;
}

export class ChallengeRoomScene extends Phaser.Scene {
  private questId: string = '';
  private currentQuestionIndex: number = 0;
  private questions: Question[] = [];
  private phantomHP: number = 3;
  private timeRemaining: number = 300; // 5 minutes
  private timer!: Phaser.Time.TimerEvent;
  private timerText!: Phaser.GameObjects.Text;
  private phantom!: Phaser.GameObjects.Sprite;
  private questionPanel!: Phaser.GameObjects.Container;
  private optionButtons: Phaser.GameObjects.Rectangle[] = [];
  private hpBar!: Phaser.GameObjects.Graphics;
  private isCompleted: boolean = false;

  constructor() {
    super({ key: 'ChallengeRoomScene' });
  }

  init(data: any) {
    // Get quest data from previous scene
    this.questId = data.questId || '';
    this.currentQuestionIndex = 0;
    this.phantomHP = 3;
    this.timeRemaining = 300;
    this.isCompleted = false;

    // Load questions for this quest
    this.questions = this.getQuestionsForQuest();
  }

  create() {
    // Add background
    this.add.image(0, 0, 'starter-bg')
      .setOrigin(0, 0)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Add challenge room title
    this.add.text(
      this.cameras.main.width / 2,
      30,
      'CHALLENGE ROOM',
      {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5);

    // Create top HUD with timer and HP
    this.createTopHUD();

    // Create phantom
    this.createPhantom();

    // Create question panel
    this.createQuestionPanel();

    // Start timer
    this.startTimer();

    // Add back button
    const backButton = this.add.rectangle(100, 30, 120, 40, 0x000000, 0.6)
      .setInteractive();

    this.add.text(
      100,
      30,
      '← BACK',
      {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff'
      }
    ).setOrigin(0.5);

    backButton.on('pointerdown', () => {
      this.sound.play('button-click');
      this.timer.remove();
      this.scene.start('QuestBoardScene');
    });
  }

  update() {
    // Update phantom animation
    if (!this.isCompleted) {
      this.phantom.play('phantom-idle', true);
    }
  }

  private createTopHUD() {
    // Create timer
    this.timerText = this.add.text(
      this.cameras.main.width - 100,
      30,
      this.formatTime(this.timeRemaining),
      {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#ffffff'
      }
    ).setOrigin(0.5);

    // Create HP bar
    this.add.text(
      100,
      80,
      'PHANTOM HP:',
      {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff'
      }
    ).setOrigin(0, 0.5);

    this.hpBar = this.add.graphics();
    this.updateHPBar();
  }

  private createPhantom() {
    // Create phantom sprite
    this.phantom = this.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height / 3,
      'phantom'
    ).setScale(2);

    // Create phantom animations
    this.anims.create({
      key: 'phantom-idle',
      frames: this.anims.generateFrameNumbers('phantom', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'phantom-hit',
      frames: this.anims.generateFrameNumbers('phantom', { start: 4, end: 7 }),
      frameRate: 12,
      repeat: 0
    });

    this.anims.create({
      key: 'phantom-defeat',
      frames: this.anims.generateFrameNumbers('phantom', { start: 8, end: 11 }),
      frameRate: 8,
      repeat: 0
    });

    // Start with idle animation
    this.phantom.play('phantom-idle');
  }

  private createQuestionPanel() {
    // Create container for question panel
    this.questionPanel = this.add.container(
      this.cameras.main.width / 2,
      this.cameras.main.height * 0.7
    );

    // Create panel background
    const panel = this.add.rectangle(0, 0, 600, 200, 0x000000, 0.7)
      .setStrokeStyle(2, 0xffd700);

    this.questionPanel.add(panel);

    // Display the first question
    this.displayQuestion(this.currentQuestionIndex);
  }

  private displayQuestion(index: number) {
    // Clear previous question content
    this.questionPanel.removeAll();
    this.optionButtons = [];

    // Add panel background
    const panel = this.add.rectangle(0, 0, 600, 200, 0x000000, 0.7)
      .setStrokeStyle(2, 0xffd700);

    this.questionPanel.add(panel);

    // Get current question
    const question = this.questions[index];

    // Add question text
    const questionText = this.add.text(
      0,
      -70,
      question.text,
      {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffffff',
        wordWrap: { width: 550 }
      }
    ).setOrigin(0.5);

    this.questionPanel.add(questionText);

    // Add options for MCQ questions
    if (question.type === 'mcq' && question.options) {
      const startY = -20;
      const optionHeight = 40;
      const padding = 10;

      question.options.forEach((option, optionIndex) => {
        const y = startY + optionIndex * (optionHeight + padding);

        const optionButton = this.add.rectangle(0, y, 500, optionHeight, 0x333333)
          .setStrokeStyle(1, 0xffffff)
          .setInteractive();

        const optionText = this.add.text(
          0,
          y,
          option,
          {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffffff'
          }
        ).setOrigin(0.5);

        // Add hover effect
        optionButton.on('pointerover', () => {
          optionButton.setFillStyle(0x444444);
        });

        optionButton.on('pointerout', () => {
          optionButton.setFillStyle(0x333333);
        });

        // Add click handler
        optionButton.on('pointerdown', () => {
          this.sound.play('button-click');
          this.checkAnswer(optionIndex);
        });

        this.questionPanel.add(optionButton);
        this.questionPanel.add(optionText);
        this.optionButtons.push(optionButton);
      });
    }
    // Add code editor for coding questions
    else if (question.type === 'coding') {
      // In a real implementation, this would be a code editor
      // For now, we'll just show a placeholder
      const codeArea = this.add.rectangle(0, 20, 500, 100, 0x111111)
        .setStrokeStyle(1, 0x00ff00);

      const codeText = this.add.text(
        -240,
        -20,
        question.initialCode || '// Write your code here',
        {
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#00ff00'
        }
      );

      const submitButton = this.add.rectangle(0, 90, 200, 40, 0x005500)
        .setInteractive();

      const submitText = this.add.text(
        0,
        90,
        'Submit Code',
        {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: '#ffffff'
        }
      ).setOrigin(0.5);

      // Add hover effect
      submitButton.on('pointerover', () => {
        submitButton.setFillStyle(0x006600);
      });

      submitButton.on('pointerout', () => {
        submitButton.setFillStyle(0x005500);
      });

      // Add click handler
      submitButton.on('pointerdown', () => {
        this.sound.play('button-click');
        // In a real implementation, this would evaluate the code
        // For now, we'll just simulate a correct answer
        this.checkAnswer(0);
      });

      this.questionPanel.add(codeArea);
      this.questionPanel.add(codeText);
      this.questionPanel.add(submitButton);
      this.questionPanel.add(submitText);
    }
  }

  private checkAnswer(selectedIndex: number) {
    const question = this.questions[this.currentQuestionIndex];
    const isCorrect = selectedIndex === question.correctAnswer;

    if (isCorrect) {
      // Play correct sound
      this.sound.play('correct-answer');

      // Show correct animation
      this.phantom.play('phantom-hit');

      // Reduce phantom HP
      this.phantomHP--;
      this.updateHPBar();

      // Check if phantom is defeated
      if (this.phantomHP <= 0) {
        this.completeChallenge(true);
        return;
      }
    } else {
      // Play wrong sound
      this.sound.play('wrong-answer');

      // Show incorrect animation (shake the screen)
      this.cameras.main.shake(200, 0.01);
    }

    // Move to next question
    this.currentQuestionIndex++;

    // Check if we've gone through all questions
    if (this.currentQuestionIndex >= this.questions.length) {
      // If phantom still has HP, loop back to the first question
      this.currentQuestionIndex = 0;
    }

    // Display the next question
    this.displayQuestion(this.currentQuestionIndex);
  }

  private updateHPBar() {
    this.hpBar.clear();

    // Background
    this.hpBar.fillStyle(0x333333);
    this.hpBar.fillRect(200, 70, 200, 20);

    // Fill based on current HP
    const fillWidth = (this.phantomHP / 3) * 200;
    this.hpBar.fillStyle(0xff0000);
    this.hpBar.fillRect(200, 70, fillWidth, 20);
  }

  private startTimer() {
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeRemaining--;
        this.timerText.setText(this.formatTime(this.timeRemaining));

        // Check if time is up
        if (this.timeRemaining <= 0) {
          this.completeChallenge(false);
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private completeChallenge(success: boolean) {
    // Stop the timer
    this.timer.remove();

    // Mark as completed
    this.isCompleted = true;

    // Play appropriate animation
    if (success) {
      this.phantom.play('phantom-defeat');
    }

    // Show completion modal
    this.showCompletionModal(success);
  }

  private showCompletionModal(success: boolean) {
    // Create modal container
    const modal = this.add.container(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2
    );

    // Create modal background
    const bg = this.add.rectangle(0, 0, 400, 300, 0x000000, 0.9)
      .setStrokeStyle(3, success ? 0x00ff00 : 0xff0000);

    // Create title
    const title = this.add.text(
      0,
      -100,
      success ? 'CHALLENGE COMPLETED!' : 'CHALLENGE FAILED!',
      {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: success ? '#00ff00' : '#ff0000'
      }
    ).setOrigin(0.5);

    // Create message
    const message = this.add.text(
      0,
      -40,
      success ? 'You defeated the Fog Phantom!' : 'The Fog Phantom was too strong!',
      {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffffff'
      }
    ).setOrigin(0.5);

    // Create XP reward
    const xpReward = success ? 500 : 100;
    const xpText = this.add.text(
      0,
      20,
      `XP Earned: ${xpReward}`,
      {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffd700'
      }
    ).setOrigin(0.5);

    // Create continue button
    const continueButton = this.add.rectangle(0, 80, 200, 50, 0x333333)
      .setInteractive();

    const continueText = this.add.text(
      0,
      80,
      'Continue',
      {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffffff'
      }
    ).setOrigin(0.5);

    // Add hover effect
    continueButton.on('pointerover', () => {
      continueButton.setFillStyle(0x444444);
    });

    continueButton.on('pointerout', () => {
      continueButton.setFillStyle(0x333333);
    });

    // Add click handler
    continueButton.on('pointerdown', () => {
      this.sound.play('button-click');
      this.scene.start('QuestBoardScene');
    });

    // Add components to modal
    modal.add([bg, title, message, xpText, continueButton, continueText]);
  }

  private getQuestionsForQuest(): Question[] {
    // This would come from the blockchain in a real implementation
    return [
      {
        id: 'q1_1',
        text: 'What is the binary representation of the decimal number 10?',
        options: ['1010', '1100', '1001', '1110'],
        correctAnswer: 0,
        type: 'mcq'
      },
      {
        id: 'q1_2',
        text: 'Which of the following is NOT a valid binary operation?',
        options: ['AND', 'OR', 'XOR', 'MAYBE'],
        correctAnswer: 3,
        type: 'mcq'
      },
      {
        id: 'q1_3',
        text: 'Write a function that converts a binary string to decimal.',
        initialCode: 'function binaryToDecimal(binary) {\n  // Your code here\n}',
        correctAnswer: 0, // This would be evaluated differently in a real implementation
        type: 'coding'
      }
    ];
  }
}

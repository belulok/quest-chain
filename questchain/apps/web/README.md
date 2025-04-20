# PhantomPass (QuestChain Academy)

A 2D game built with Phaser 3, Next.js 14, and Sui blockchain integration.

## Technology Stack

- **Game Engine**: Phaser 3 (v3.60) with WebGL 2
- **Frontend Framework**: Next.js 14
- **Blockchain**: Sui (Move 0.55)
- **Authentication**: zkLogin via Enoki
- **Gas Sponsorship**: Shinami Gas Station

## Project Structure

```
questchain/apps/web/
├── public/                # Static assets
│   └── assets/            # Game assets
│       ├── images/        # General images
│       ├── sprites/       # Character and entity sprites
│       ├── tilesets/      # Tileset images
│       ├── maps/          # Tilemap JSON files
│       ├── ui/            # UI elements
│       ├── backgrounds/   # Background images
│       ├── items/         # Item images
│       └── audio/         # Sound effects and music
├── src/
│   ├── app/               # Next.js app router
│   ├── components/        # React components
│   ├── game/              # Phaser game code
│   │   ├── scenes/        # Game scenes
│   │   ├── ui/            # UI components for the game
│   │   ├── config.ts      # Game configuration
│   │   └── PhantomPassGame.ts # Main game class
│   ├── hooks/             # Custom React hooks
│   ├── providers/         # Context providers
│   └── utils/             # Utility functions
```

## Game Scenes

- **BootScene**: Initial scene that loads minimal assets for the loading screen
- **PreloadScene**: Loads all game assets with a progress bar
- **MainMenuScene**: Start screen with login options
- **WorldMapScene**: Overworld map with biomes and navigation
- **QuestBoardScene**: Browse and select quests for each biome
- **ChallengeRoomScene**: Answer questions to defeat Fog Phantoms
- **BossRaidScene**: Multiplayer raid battles
- **InventoryScene**: Manage avatar and equipment
- **LeaderboardScene**: Global player rankings

## Blockchain Integration

The game integrates with the Sui blockchain using:

- **zkLogin**: Wallet-less onboarding via Google OAuth
- **Sponsored Transactions**: Gas-free transactions for players
- **Move Smart Contracts**: On-chain assets, quests, and progression

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   ```
   cp .env.example .env.local
   ```
   Then fill in the required values.

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Deploy the game using Vercel:

```
vercel
```

## License

[MIT](LICENSE)

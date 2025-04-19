# QuestChain Academy

<p align="center">
  <img src="docs/images/logo.png" alt="QuestChain Academy Logo" width="300"/>
</p>

<p align="center">
  <strong>A 2-D "play-to-learn" RPG on Sui where every solved puzzle buffs a dynamic-NFT avatar</strong>
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#architecture"><strong>Architecture</strong></a> ·
  <a href="#roadmap"><strong>Roadmap</strong></a>
</p>

<p align="center">
  <img src="docs/images/screenshot.png" alt="QuestChain Academy Screenshot" width="600"/>
</p>

QuestChain Academy is a revolutionary "play-to-learn" RPG built on the Sui blockchain. Players solve coding and blockchain puzzles to level up their on-chain avatar NFTs, participate in boss raids with other players, and earn rewards. The game features gas-free onboarding via zkLogin and sponsored transactions, making it accessible to both Web3 natives and newcomers.

## Features

- **🎮 Immersive Gameplay**: Pixel-art 2D RPG with multiple game modes and challenges
- **🧩 Educational Quests**: Learn blockchain concepts and coding through interactive puzzles
- **⚔️ Boss Raids**: Cooperative real-time battles against powerful bosses
- **🏆 Dynamic NFT Avatars**: On-chain avatars that evolve as you progress
- **🔄 Real-time Updates**: WebSocket-based real-time game state synchronization
- **🔐 Wallet-free Onboarding**: Simple authentication via zkLogin (Google/Apple)
- **⛽ Gas-free Experience**: Sponsored transactions for a seamless UX
- **💰 Reward System**: Earn in-game rewards and level up your avatar
- **🌐 Cross-platform**: Play on desktop and mobile browsers

## Tech Stack

### Blockchain & Smart Contracts
- **Smart Contracts**: Sui Move 0.54 in a /contracts package
- **Blockchain SDK**: @mysten/sui.js 0.54.x (TypeScript)
- **Auth / On-boarding**: zkLogin (Google + Apple) via @mysten/zklogin
- **Gas abstraction**: Shinami Gas Station or self-hosted sponsor key

### Backend
- **API Server**: Node 20 + Fastify 5 (REST + WebSockets)
- **Transient store**: Redis (Upstash free tier)
- **Deployment**: Fly.io containerized deployment

### Frontend
- **Game engine**: Phaser 3.60 compiled with Vite + TypeScript
- **Framework**: Next.js 14 (App Router) + React 18
- **Styling**: Tailwind CSS + DaisyUI for pixel-perfect UI
- **State Management**: React Query for data fetching and caching
- **Real-time**: WebSocket client with custom useGameSocket React hook

### Infrastructure
- **Asset storage**: NFT.storage (IPFS) for dynamic sprite CIDs
- **Hosting**: Vercel (front-end) + Fly.io (API) + Sui devnet/testnet
- **CI / CD**: GitHub Actions with Turborepo for monorepo management
- **Development**: TypeScript, ESLint, Prettier for code quality

## Project Structure

```
questchain/
├─ apps/
│  ├─ web/                # Next.js 14 frontend (with Phaser integration)
│  │  ├─ src/
│  │  │  ├─ app/          # Next.js App Router pages
│  │  │  ├─ components/   # React components
│  │  │  ├─ game/         # Phaser game scenes and logic
│  │  │  ├─ hooks/        # Custom React hooks
│  │  │  ├─ lib/          # Utility functions and blockchain integration
│  │  │  └─ providers/    # React context providers
│  │  ├─ public/          # Static assets
│  │  └─ ...              # Configuration files
│  │
│  └─ api/                # Fastify backend service
│     ├─ src/
│     │  ├─ routes/       # API endpoints
│     │  ├─ services/     # Business logic
│     │  ├─ middleware/   # Request middleware
│     │  └─ websocket/    # WebSocket server
│     └─ ...              # Configuration files
│
├─ packages/
│  ├─ contracts/          # Sui Move smart contracts
│  │  ├─ sources/         # Move modules
│  │  └─ tests/           # Move tests
│  │
│  └─ shared-ui/          # Shared React components
│     ├─ src/
│     │  ├─ components/   # UI components
│     │  └─ hooks/        # Shared hooks
│     └─ ...              # Configuration files
│
├─ .github/               # GitHub Actions workflows
├─ .env.example           # Environment variables template
└─ turbo.json             # Turborepo configuration
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Sui CLI (for contract development)
- Redis (for local development)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/questchain.git
   cd questchain
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Copy the environment variables
   ```bash
   cp .env.example .env
   ```

4. Fill in the required environment variables in the `.env` file:
   - `SUI_NETWORK`: The Sui network to connect to (devnet, testnet, mainnet)
   - `SUI_RPC_URL`: The RPC URL for the Sui network
   - `NEXT_PUBLIC_ZKLOGIN_PROVIDER_GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `SUI_SPONSOR_PRIVATE_KEY`: Your sponsor account private key
   - `REDIS_URL`: Your Redis connection URL

### Development

1. Start Redis locally (if not using a remote instance):
   ```bash
   docker run -p 6379:6379 redis:alpine
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
   This will start both the Next.js frontend and the Fastify API server.

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building and Testing

1. Build all packages:
   ```bash
   npm run build
   ```

2. Run tests:
   ```bash
   npm run test
   ```

3. Run Move contract tests:
   ```bash
   cd packages/contracts
   sui move test
   ```

### Deployment

1. Deploy the frontend to Vercel:
   ```bash
   cd apps/web
   vercel deploy
   ```

2. Deploy the API to Fly.io:
   ```bash
   cd apps/api
   fly launch
   fly deploy
   ```

3. Deploy the Move contracts to Sui:
   ```bash
   cd packages/contracts
   sui client publish --gas-budget 100000000
   ```

## Architecture

### System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Next.js + React│     │  Fastify API    │     │  Sui Blockchain │
│  (Phaser Game)  │◄────┤  (WebSockets)   │◄────┤  (Move Objects) │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         │              │                 │
         └─────────────►│  Redis Cache    │
                        │                 │
                        └─────────────────┘
```

### Smart Contract Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Avatar         │     │  QuestPack      │     │  BossHP         │
│  (Dynamic NFT)  │◄────┤  (Quest Data)   │◄────┤  (Shared Object)│
│                 │     │                 │     │                 │
└────────┬────────┘     └─────────────────┘     └────────┬────────┘
         │                                               │
         │                                               │
         ▼                                               ▼
┌─────────────────┐                           ┌─────────────────┐
│                 │                           │                 │
│  LootChest      │                           │  Events         │
│  (Rewards)      │                           │  (Game Updates) │
│                 │                           │                 │
└─────────────────┘                           └─────────────────┘
```

## Game Mechanics

### Avatar System
- Players mint a unique Avatar NFT when they start the game
- Avatars have attributes like level, XP, and completed quests
- Avatars visually evolve as they level up

### Quest System
- Quests are organized into themed packs
- Each quest has a difficulty level and XP reward
- Quests involve solving coding or blockchain puzzles
- Completing quests awards XP and can level up the avatar

### Boss Raids
- Players can join real-time boss battles
- Bosses have HP that is shared across all players
- Players attack bosses based on their avatar's level
- Defeating a boss rewards all participants with loot chests

### Loot System
- Loot chests contain rewards like XP boosts or avatar customizations
- Chests have different rarity levels based on how they were obtained
- Opening chests requires a small transaction fee (sponsored)

## Roadmap

### Phase 1: MVP (Current)
- ✅ Basic game mechanics and UI
- ✅ Avatar minting and progression
- ✅ Simple quests and boss raids
- ✅ zkLogin integration
- ✅ Sponsored transactions

### Phase 2: Enhanced Gameplay (Q3 2025)
- 🔄 Advanced quest types with interactive coding challenges
- 🔄 Multiplayer dungeons with cooperative puzzles
- 🔄 Avatar customization and equipment system
- 🔄 Leaderboards and achievements

### Phase 3: Ecosystem Expansion (Q4 2025)
- 📝 Marketplace for trading avatars and items
- 📝 User-generated quests and content
- 📝 Guild system for team-based gameplay
- 📝 Integration with educational platforms

### Phase 4: Mobile and Beyond (2026)
- 📝 Native mobile applications
- 📝 AR features for avatar visualization
- 📝 Cross-chain compatibility
- 📝 Real-world rewards and partnerships

## Contributing

We welcome contributions to QuestChain Academy! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to get involved.

## Security

If you discover a security vulnerability, please send an email to security@questchain.academy instead of opening a public issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Sui Foundation](https://sui.io/) for blockchain infrastructure
- [Phaser](https://phaser.io/) for the game engine
- [Next.js](https://nextjs.org/) for the frontend framework
- [Fastify](https://www.fastify.io/) for the API server
- All our contributors and community members

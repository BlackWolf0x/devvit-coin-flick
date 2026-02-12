# Coin Flick

A precision coin-flicking game built with GameMaker and integrated into Reddit using Devvit. Players must hit exactly one coin per move while avoiding obstacles and keeping all coins on the table.

## About the Game

Coin Flick is a precision-based arcade experience where players flick a coin to hit exactly one other coin per move. Miss your target, hit multiple coins, or knock any coin off the table and it's game over. Use obstacles strategically to create bank shots and solve each setup as efficiently as possible.

## How to Play

### Objective

Collect all coins on the table in the fastest time possible by flicking coins into each other.

### Rules

-   **Select a coin** on the table to begin
-   **Flick your coin** so it hits exactly one other coin. If you hit none or more than one, you lose
-   **The two coins can collide multiple times** with each other during a single flick
-   **If any coin falls off the table**, you lose
-   **Coins can bounce off obstacles freely**, so use them to your advantage to create bank shots
-   **Collect all coins to win**

## Key Features

-   **Daily Challenges**: New levels generated daily with deterministic seeds
-   **Bonus Challenges**: Additional levels with unique configurations
-   **Leaderboards**: Per-post leaderboards to compete with other players
-   **Challenge System**: Complete daily objectives to earn rewards
-   **Coin Collection**: Unlock and collect different coin designs
-   **Chest System**: Open chests using earned gold to expand your collection
-   **Active Coin Selection**: Choose your favorite coin to play with
-   **Real-time Updates**: Live synchronization of scores, balances, and collections

## Inspiration

The idea started with wanting to build a game around simple ball-launching and golf-like mechanics focused on aim and control. After discussing it with friends, they mentioned the Zeni Hajiki minigame from Ghost of Yotei, which immediately clicked with the direction we were exploring. The project evolved from there, taking inspiration from that concept as well as classic marble and pétanque-style games, all centered on precision, angles, and smart positioning.

## How It Works

### Technical Architecture

**Frontend (GameMaker + React)**

-   Game built in GameMaker, exported to HTML5 WASM
-   React-based UI for splash screen, collection, leaderboards, and settings
-   Real-time WebSocket connections for live updates
-   Responsive design for mobile and desktop

**Backend (Devvit + Redis)**

-   Devvit handles Reddit integration, user identity, and server-side logic
-   Redis stores:
    -   User balances and coin collections
    -   Active coin selections
    -   Leaderboard scores per post
    -   Daily challenge completion status
    -   Challenge counters
-   Deterministic seed generation ensures consistent daily levels
-   Scheduled tasks for automatic daily post creation

**Key Systems**

-   **Daily Seed System**: Generates consistent levels based on UTC date (format: YYYYMMDD)
-   **Bonus Challenges**: Uses random past dates stored in Redis for variety
-   **Real-time Updates**: WebSocket channels for balance, collection, and challenge updates
-   **Toast Notifications**: Visual feedback with sound effects for challenge completions
-   **Admin Tools**: Moderator menu for posting challenges and managing game state

## Project Structure

```
coin-game-test/
├── src/
│   ├── client/              # Frontend code
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components (Splash, MyCollection, Ranks, HowTo)
│   │   ├── stores/          # Zustand state management
│   │   ├── public/          # Static assets (coins, audio, images)
│   │   └── index.tsx        # Game canvas entry point
│   ├── server/              # Backend code
│   │   ├── api/             # API routes (user data, leaderboard, chest, etc.)
│   │   ├── admin/           # Admin endpoints (give currency, clear collection)
│   │   ├── internal/        # Internal routes (post creation, schedulers)
│   │   └── utils/           # Utility functions (daily seed, challenge creation)
│   ├── shared/              # Shared types and config
│   └── gamemaker/           # GameMaker project files
├── devvit.json              # Devvit configuration
└── README.md
```

## Development Setup

### Prerequisites

-   Node.js and npm
-   GameMaker Studio 2 (for game development)
-   Devvit CLI (`npm install -g devvit`)

### Installation

1. Clone the repository
2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure your development subreddit in `devvit.json`

4. Start development:
    ```bash
    npm run dev
    ```

### Admin Features

Moderators have access to special menu items:

-   **Post Daily Challenge**: Create a new daily challenge post
-   **Reset Daily Lock**: Reset the daily post lock for testing
-   **Post Bonus Challenge**: Create a bonus challenge with a random seed

## Technologies Used

-   **GameMaker Studio 2**: Game engine and physics
-   **React**: UI framework
-   **TypeScript**: Type-safe development
-   **Devvit**: Reddit platform integration
-   **Redis**: Data persistence
-   **Tailwind CSS**: Styling
-   **React Query**: Data fetching and caching
-   **Zustand**: State management
-   **React Hot Toast**: Notifications
-   **Embla Carousel**: Collection pagination

## License

This project is part of a Reddit hackathon submission.

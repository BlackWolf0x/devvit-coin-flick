# Coin Flick

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

## Key Features

-   **Daily Challenges**: New levels generated daily with deterministic seeds
-   **Bonus Challenges**: Additional levels with unique configurations
-   **Leaderboards**: Per-post leaderboards to compete with other players
-   **Challenge System**: Complete daily objectives to earn rewards
-   **Coin Collection**: Unlock and collect different coin designs
-   **Chest System**: Open chests using earned gold to expand your collection
-   **Active Coin Selection**: Choose your favorite coin to play with
-   **Real-time Updates**: Live synchronization of scores, balances, and collections

## How It Works

**Key Systems**

-   **Daily Seed System**: Generates consistent levels based on UTC date (format: YYYYMMDD)
-   **Bonus Challenges**: Uses random past dates stored in Redis for variety
-   **Real-time Updates**: WebSocket channels for balance, collection, and challenge updates
-   **Toast Notifications**: Visual feedback with sound effects for challenge completions
-   **Admin Tools**: Moderator menu for posting challenges and managing game state

### Admin Features

Moderators have access to special menu items:

-   **Post Daily Challenge**: Create a new daily challenge post
-   **Reset Daily Lock**: Reset the daily post lock for testing
-   **Post Bonus Challenge**: Create a bonus challenge with a random seed

# DnD Tool

A "vibe coded" web-based tool designed to enhance your Dungeons & Dragons campaigns. This application provides a suite of tools for Dungeon Masters to manage campaigns, encounters, maps, and music.

## Features

- **Campaign Management**: Visualize and organize your campaign flow using an interactive node-based editor.
- **Encounter Manager**: Create and run combat encounters with an intuitive interface.
- **Drawing & Maps**: A canvas editor for sketching maps or visual aids on the fly.
- **Spotify Integration**: Control campaign music and playlists directly from the tool.
- **Admin Dashboard**: Centralized hub for managing all aspects of your game session.

## Tech Stack

### Frontend

- **Framework**: React with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Visualization**:
  - React Flow (Campaign Flowcharts)
  - Konva / React-Konva (Drawing Canvas)
- **Data Fetching**: React Query, Axios

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Language**: TypeScript
- **Integrations**: Spotify Web API Node

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- A Spotify Developer account (for music integration)

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dnd-tool
   ```

2. **Install dependencies**
   This project uses npm workspaces to manage dependencies for both client and server from the root.

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the `server` directory with the following variables:

   ```env
   # Server Configuration
   PORT=3001
   FRONTEND_URL=http://localhost:5173

   # Database (Prisma)
   # Update with your actual database connection string
   DATABASE_URL="file:./dev.db"

   # Spotify Integration
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:3001/api/spotify/callback
   ```

4. **Database Setup**
   Initialize the database schema using Prisma.
   ```bash
   npm run db:migrate --workspace=server
   npm run db:generate --workspace=server
   ```

## Running the Application

To run both the client and server concurrently in development mode:

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### Individual Scripts

- `npm run dev:client`: Run only the frontend.
- `npm run dev:server`: Run only the backend.
- `npm run build`: Build both client and server for production.
- `npm run start`: Start the production server.

## Project Structure

```
dnd-tool/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI components (Canvas, Encounter, Flowchart, etc.)
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API integration services
│   │   └── types/          # TypeScript definitions
│   └── ...
├── server/                 # Backend Express application
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   └── ...
│   └── ...
└── package.json            # Root configuration and scripts
```

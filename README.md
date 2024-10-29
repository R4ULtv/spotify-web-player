<img alt="Spotify Web Player" src="/public/assets/og-image.png">

Experience your music like never before with stunning visuals that dance to your favorite tunes. This web-based Spotify player combines seamless integration with beautiful visualizations for an enhanced music experience.

## 🚀 Technologies Used

- [Next.js 14](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Next-Auth v5](https://authjs.dev/)
- [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadergradient](https://www.shadergradient.co)

## 📋 Prerequisites

- Node.js (version 18.x or later)
- npm or yarn
- Spotify Developer account and API credentials

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/spotify-web-player.git
   ```

2. Navigate to the project directory:
   ```bash
   cd spotify-web-player
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   Create a `.env.local` file in the root directory and add:
   ```
   AUTH_SECRET= # Add by `npx auth`. Read more: https://cli.authjs.dev
   AUTH_SPOTIFY_ID=your_client_id
   AUTH_SPOTIFY_SECRET=your_client_secret
   ```

## 🎮 Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start using the player.

## 🔑 Authentication

1. Click "Sign in with Spotify"
2. Authorize the application
3. You'll be redirected back to the player
4. Start enjoying your music with stunning visualizations!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

Made with ❤️ by Raul Carini
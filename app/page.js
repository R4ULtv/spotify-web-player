import { SessionProvider } from "next-auth/react";

import { SpotifyProvider } from "@/components/providers/SpotifyProvider";
import RandomCircle from "@/components/ui/background";
import SpotifyPlayer from "@/components/ui/SpotifyPlayer";
import Navigation from "@/components/ui/Navigation";
import TracksDrawer from "@/components/ui/TracksDrawer";

export default function Home() {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <SpotifyProvider>
        <main className="relative w-svw h-svh z-10">
          <Navigation />
          <SpotifyPlayer />
          <TracksDrawer />
        </main>
        <RandomCircle />
      </SpotifyProvider>
    </SessionProvider>
  );
}

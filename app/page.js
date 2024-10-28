import { SessionProvider } from "next-auth/react";

import { SpotifyProvider } from "@/components/providers/SpotifyProvider";
import { MediaProvider } from "@/components/providers/MediaProvider";
import { DynamicBackground } from "@/components/ui/background";
import SpotifyPlayer from "@/components/ui/SpotifyPlayer";
import Navigation from "@/components/ui/Navigation";
import TracksDrawer from "@/components/ui/TracksDrawer";
import RotateDeviceDrawer from "@/components/ui/RotateDeviceDrawer";
import Settings from "@/components/ui/Settings";

export default function Home() {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={300}>
      <SpotifyProvider>
        <MediaProvider>
          <main className="relative w-svw h-svh z-10">
            <Navigation />
            <SpotifyPlayer />

            <TracksDrawer />
            <RotateDeviceDrawer />
          </main>
          <Settings />
          <DynamicBackground />
        </MediaProvider>
      </SpotifyProvider>
    </SessionProvider>
  );
}

import { SpotifyProvider } from "@/components/providers/SpotifyProvider";
import RandomCircle from "@/components/ui/background";
import SpotifyPlayer from "@/components/ui/SpotifyPlayer";
import Navigation from "@/components/ui/Navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <SpotifyProvider session={session}>
      <main className="relative w-full h-screen z-10">
        <Navigation session={session} />
        <SpotifyPlayer />
      </main>
      <RandomCircle />
    </SpotifyProvider>
  );
}

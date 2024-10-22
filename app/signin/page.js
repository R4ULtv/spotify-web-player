import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

import SignInButton from "@/components/ui/SignInButton";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import FakeSpotifyPlayer from "@/components/ui/FakeSpotifyPlayer";
import { StarsBackground } from "@/components/layout/stars-background";
import { ShootingStars } from "@/components/layout/shooting-stars";

export default function Login() {
  return (
    <main>
      <div className="relative min-h-full md:h-full">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between md:justify-center w-full h-full px-3 py-8 md:px-8 md:py-40 z-10 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-7xl text-zinc-100 font-black text-balance text-center">
              Listen to your Music Anytime, Anywhere
            </h1>

            <p className="mt-4 md:mt-8 text-balance mx-auto text-zinc-300 text-base font-medium text-center">
              Connect your Spotify account and experience your music like never
              before, with stunning visuals that dance to your favorite tunes.
            </p>

            <div className="mt-4 md:mt-8 flex items-center justify-center flex-col md:flex-row gap-3">
              <SignInButton />
              <a
                href="#more"
                className="bg-zinc-100 text-spotify-black px-5 py-2 rounded-full flex gap-1.5 items-center group"
              >
                <GlobeAltIcon className="size-5 group-hover:scale-110 group-hover:rotate-12 group-focus:scale-110 group-focus:rotate-12 duration-75 ease-out" />
                <span className="font-semibold">Discorver More</span>
              </a>
            </div>
          </div>
          <div className="mt-8 md:mt-16 w-full">
            <FakeSpotifyPlayer />
          </div>
        </div>
        <ShootingStars />
        <StarsBackground />
      </div>
    </main>
  );
}

import { GlobeAltIcon } from "@heroicons/react/24/outline";

import { InfiniteSlider } from "@/components/animations/infinite-slider";
import { ShootingStars } from "@/components/layout/shooting-stars";
import { StarsBackground } from "@/components/layout/stars-background";

import { GradientBackground } from "@/components/ui/background";
import { Cobe } from "@/components/ui/Cobe";
import FakeSpotifyPlayer from "@/components/ui/FakeSpotifyPlayer";
import SignInButton from "@/components/ui/SignInButton";

import { exampleTracks } from "@/components/utils/tracks";
import { TextEffect } from "@/components/animations/text-effects";
import { GlowifyIcon, SpotifyIcon } from "@/components/utils/icons";
import { TextShimmer } from "@/components/animations/text-shimmer";

export default function Login() {
  return (
    <main>
      <div className="relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between md:justify-center w-full h-full px-3 py-10 md:px-8 md:py-40 z-10 relative">
          <div className="max-w-3xl">
            <TextEffect
              per="word"
              as="h1"
              preset="slide"
              className="text-5xl sm:text-7xl text-zinc-100 font-black text-balance text-center"
            >
              Listen to your Music Anytime, Anywhere
            </TextEffect>

            <p className="mt-4 md:mt-8 text-balance mx-auto text-zinc-300 text-base font-medium text-center">
              Connect your Spotify account and experience your music like never
              before, with stunning visuals that dance to your favorite tunes.
            </p>

            <div className="mt-4 md:mt-8 flex items-center justify-center flex-row gap-3">
              <SignInButton />
              <a
                href="#features"
                className="bg-zinc-100 text-spotify-black px-5 py-2 rounded-full flex gap-1.5 items-center group"
              >
                <GlobeAltIcon className="size-5 group-hover:scale-110 group-hover:rotate-12 group-focus:scale-110 group-focus:rotate-12 duration-75 ease-out" />
                <span className="hidden md:block font-semibold">
                  Discorver More
                </span>
                <span className="md:hidden font-semibold">Features</span>
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
      <div
        id="features"
        className="flex flex-col items-center justify-between md:justify-center w-full h-full px-3 py-10 md:px-8 md:py-20 z-10 relative bg-zinc-950"
      >
        <div>
          <h1 className="text-xl sm:text-3xl text-zinc-100 font-black text-balance text-center">
            Discover our Features
          </h1>
          <p className="mt-2 md:mt-4 text-balance max-w-xl mx-auto text-zinc-300 text-base font-medium text-center">
            From seamless Spotify integration to stunning visualizations, we've
            got everything you need for an enhanced music experience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full max-w-7xl mx-auto mt-8 md:mt-20">
          <div className="md:col-span-3 bg-zinc-900 w-full rounded-3xl p-6 flex flex-col relative">
            <div className="mb-8 relative w-full h-52 flex flex-row flex-wrap md:flex-nowrap md:gap-4 items-center justify-around md:justify-between bg-spotify-black rounded-xl">
              <div className="p-6 rounded-xl group order-1 z-10">
                <SpotifyIcon className="size-14 md:size-28 fill-spotify-green group-hover:scale-110 group-hover:fill-spotify-light-green group-hover:-rotate-12 transition duration-150 ease-out" />
              </div>

              <div className="flex flex-col items-center gap-4 order-3 md:order-2 z-10">
                <TextShimmer className="text-base md:text-xl font-bold [--base-color:theme(colors.spotify.green)] [--base-gradient-color:theme(colors.spotify.light-green)]">
                  Establishing Connection
                </TextShimmer>
                <TextShimmer className="text-base md:text-xl font-bold [--base-color:theme(colors.spotify.green)] [--base-gradient-color:theme(colors.spotify.light-green)]">
                  Synchronizing Library
                </TextShimmer>
              </div>
              <div className="p-6 rounded-xl group order-2 md:order-3 z-10">
                <GlowifyIcon className="size-14 md:size-28 stroke-spotify-green group-hover:scale-110 group-hover:stroke-spotify-light-green group-hover:rotate-12 transition duration-150 ease-out" />
              </div>
              <ShootingStars />
              <StarsBackground />
            </div>
            <h3 className="font-bold text-zinc-100">
              Seamless Spotify Integration
            </h3>
            <p className="text-balance text-sm text-zinc-100 mt-1">
              Connect your Spotify account in seconds and start enjoying your
              music library with stunning visual effects. No complicated setup
              required.
            </p>
          </div>
          <div className="md:col-span-2 bg-zinc-900 w-full rounded-3xl p-6 flex flex-col">
            <h3 className="font-bold text-zinc-100">
              Beautiful Visualizations
            </h3>
            <p className="text-balance text-sm text-zinc-100 mt-1">
              Watch as your music comes to life with dynamic visual effects that
              react to every beat.
            </p>
            <div className="mt-8 relative w-full h-52 rounded-xl overflow-hidden">
              <GradientBackground
                className="w-full h-full relative"
                colors={["#1ED760", "#0c5a27", "#121212"]}
              />
            </div>
          </div>
          <div className="md:col-span-2 bg-zinc-900 w-full rounded-3xl p-6 flex flex-col">
            <h3 className="font-bold text-zinc-100">Open Source</h3>
            <p className="text-balance text-sm text-zinc-100 mt-1">
              Free forever and community-driven. Check out our code on GitHub
              and contribute to make it even better.
            </p>
            <div className="mt-8 relative w-full h-52 rounded-xl overflow-hidden">
              <Cobe />
            </div>
          </div>
          <div className="md:col-span-3 bg-zinc-900 w-full rounded-3xl p-6 flex flex-col relative">
            <div className="mb-8 relative w-full h-52 flex flex-col justify-between gap-3 rounded-xl overflow-hidden">
              <InfiniteSlider gap={12}>
                {exampleTracks.map((track) => (
                  <a key={track.name} href={track.link}>
                    <img
                      src={track.album.image}
                      className="size-24 rounded-xl brightness-100 hover:brightness-110 duration-75 ease-out"
                    />
                  </a>
                ))}
              </InfiniteSlider>
              <InfiniteSlider gap={12} reverse>
                {exampleTracks.map((track) => (
                  <a key={track.name} href={track.link}>
                    <img
                      src={track.album.image}
                      className="size-24 rounded-xl brightness-100 hover:brightness-110 duration-75 ease-out"
                    />
                  </a>
                ))}
              </InfiniteSlider>
            </div>
            <h3 className="font-bold text-zinc-100">Ultra-Fast Performance</h3>
            <p className="text-balance text-sm text-zinc-100 mt-1">
              Built with cutting-edge web technologies for instant response
              times and smooth animations. No lag, no waiting - just pure music
              enjoyment.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { signIn } from "next-auth/react";
import { Button } from "@headlessui/react";
import { SpotifyIcon } from "@/components/utils/icons";

export default function SignInButton() {
  return (
    <Button
      onClick={() => signIn("spotify", { redirectTo: "/" })}
      className="bg-spotify-green text-spotify-black px-5 py-2 rounded-full flex gap-1.5 items-center group select-none"
    >
      <SpotifyIcon className="size-5 group-hover:scale-110 group-hover:rotate-12 group-focus:scale-110 group-focus:rotate-12 duration-75 ease-out" />
      <span className="hidden md:block font-semibold">
        Sign in with Spotify
      </span>
      <span className="md:hidden font-semibold">Spotify</span>
    </Button>
  );
}

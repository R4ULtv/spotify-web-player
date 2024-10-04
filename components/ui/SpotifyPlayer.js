"use client";

import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useSpotify } from "@/components/providers/SpotifyProvider";

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function SpotifyPlayer() {
  const { currentTrack, progress, progressPercentage } = useSpotify();

  return (
    <Transition show={!!currentTrack} appear as={Fragment}>
      {currentTrack && (
        <div className="absolute inset-0 flex gap-3 flex-col items-center justify-center transition duration-150 data-[closed]:scale-50 data-[closed]:opacity-0">
          <div className="max-w-sm w-full bg-zinc-900/5 backdrop-blur-xl p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <img
                src={currentTrack.album.images[2].url}
                className="size-16 rounded-xl"
              />
              <div className="truncate">
                <a
                  href={currentTrack.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold truncate text-zinc-100 hover:underline underline-offset-2"
                >
                  {currentTrack.name}
                </a>
                <div className="font-medium text-sm truncate space-x-1 text-zinc-300">
                  {currentTrack.explicit && (
                    <span className="text-xs px-1.5 py-0.5 text-zinc-300 bg-zinc-500/25 rounded w-min select-none">
                      E
                    </span>
                  )}
                  {currentTrack.artists.map((item, index) => (
                    <Fragment key={index}>
                      <a
                        className="hover:underline underline-offset-2 truncate"
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.name}
                      </a>
                      {index < currentTrack.artists.length - 1 && (
                        <span className="text-zinc-400">·</span>
                      )}
                    </Fragment>
                  ))}
                </div>
                <div className="font-medium text-sm truncate text-zinc-300">
                  <a
                    className="hover:underline underline-offset-2"
                    href={currentTrack.album.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {currentTrack.album.name}
                  </a>
                </div>
              </div>
            </div>
            <div className="relative mt-2">
              <div className="flex justify-between text-xs text-zinc-400 mt-1">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(currentTrack.durationMs)}</span>
              </div>
              <div
                className="h-1 bg-zinc-200 rounded-full absolute z-10 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
              <div className="w-full h-1 bg-zinc-400 rounded-full" />
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
}

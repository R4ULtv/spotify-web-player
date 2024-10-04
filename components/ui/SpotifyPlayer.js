"use client";

import { Button, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useSpotify } from "@/components/providers/SpotifyProvider";
import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function SpotifyPlayer() {
  const {
    currentTrack,
    progress,
    progressPercentage,
    isPlaying,
    skipToPrevious,
    skipToNext,
    togglePlay,
    toggleShuffle,
    rotateRepeateState,
    playerMode,
  } = useSpotify();

  return (
    <Transition show={!!currentTrack} appear as={Fragment}>
      {currentTrack && (
        <div className="absolute inset-2 flex gap-3 flex-col items-center justify-center transition duration-150 data-[closed]:scale-50 data-[closed]:opacity-0">
          <div className="max-w-sm w-full bg-zinc-900/5 backdrop-blur-xl p-4 rounded-2xl">
            <div
              className={`flex items-center gap-3 ${
                playerMode === "ds" ? "flex-row" : "flex-col"
              }`}
            >
              <img
                alt="Album Cover"
                src={
                  playerMode === "ds"
                    ? currentTrack.album.images[2].url
                    : currentTrack.album.images[0].url
                }
                className={`rounded-xl ${
                  playerMode === "ds" ? "size-16" : "w-full"
                }`}
              />
              <div
                className={`truncate ${
                  playerMode === "ds" ? "self-center" : "self-start"
                }`}
              >
                <a
                  href={currentTrack.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-bold truncate text-zinc-100 hover:underline underline-offset-2 ${
                    playerMode === "ds" ? "text-base" : "text-lg"
                  }`}
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
          </div>

          <div className="max-w-sm w-full bg-zinc-900/5 backdrop-blur-xl p-4 rounded-2xl">
            <div className="relative">
              <div
                className="h-1 bg-zinc-200 rounded-full absolute z-10 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
              <div
                className="size-2 bg-zinc-100 rounded-full absolute z-10 transition-all duration-300 -translate-y-0.5"
                style={{ left: `${progressPercentage}%` }}
              />
              <div className="w-full h-1 bg-zinc-400 rounded-full" />
              <div className="w-full flex justify-between text-xs text-zinc-400 mt-1">
                <span className="hover:text-zinc-300 transition duration-75 select-none">
                  {formatTime(progress)}
                </span>
                <span className="hover:text-zinc-300 transition duration-75 select-none">
                  {formatTime(currentTrack.durationMs)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button
                onClick={toggleShuffle}
                className="p-1 outline-none relative group text-zinc-400"
              >
                <svg
                  className={`size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75 ${
                    currentTrack.shuffleState && "stroke-zinc-200"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
                  <path d="m18 2 4 4-4 4" />
                  <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
                  <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
                  <path d="m18 14 4 4-4 4" />
                </svg>
                {currentTrack.shuffleState && (
                  <div className="size-1 absolute bottom-0 translate-x-[5px] translate-y-[3px] bg-zinc-200 rounded-full" />
                )}
              </Button>
              <div className="flex items-center justify-center gap-1">
                <Button
                  onClick={isPlaying ? skipToPrevious : null}
                  className="p-1 outline-none relative group text-zinc-300"
                >
                  <BackwardIcon className="size-5 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75" />
                </Button>
                <Button
                  onClick={togglePlay}
                  className="p-1 rounded-xl outline-none relative group text-zinc-200"
                >
                  {isPlaying ? (
                    <PauseIcon className="size-6 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75" />
                  ) : (
                    <PlayIcon className="size-6 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75" />
                  )}
                </Button>
                <Button
                  onClick={isPlaying ? skipToNext : null}
                  className="p-1 outline-none relative group text-zinc-300"
                >
                  <ForwardIcon className="size-5 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75" />
                </Button>
              </div>
              <Button
                onClick={rotateRepeateState}
                className="p-1 outline-none relative group text-zinc-400"
              >
                {currentTrack.repeatState === "track" ? (
                  <svg
                    className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75 stroke-zinc-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m17 2 4 4-4 4" />
                    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
                    <path d="m7 22-4-4 4-4" />
                    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
                    <path d="M11 10h1v4" />
                  </svg>
                ) : (
                  <svg
                    className={`size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75 ${
                      currentTrack.repeatState !== "off" && "stroke-zinc-200"
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m17 2 4 4-4 4" />
                    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
                    <path d="m7 22-4-4 4-4" />
                    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
                  </svg>
                )}
                {currentTrack.repeatState !== "off" && (
                  <div className="size-1 absolute bottom-0 translate-x-[5px] translate-y-[3px] bg-zinc-200 rounded-full" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
}

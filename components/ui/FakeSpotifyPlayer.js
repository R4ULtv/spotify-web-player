"use client";
import { Fragment, useCallback, useEffect, useState } from "react";

import { Button } from "@headlessui/react";
import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";
import {
  AdjustmentsHorizontalIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  LinkIcon,
} from "@heroicons/react/16/solid";

import { GradientBackground } from "@/components/ui/background";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/components/utils/hooks";
import {
  QueueIcon,
  RecentlyTracksIcon,
  RepeatIcon,
  ShuffleIcon,
} from "@/components/utils/icons";
import { exampleTracks as tracks } from "@/components/utils/tracks";

export default function FakeSpotifyPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playerState, setPlayerState] = useState({
    ...tracks[currentTrackIndex],
    progress: 0,
    isPlaying: true,
    shuffleState: true,
    repeatState: "all",
  });

  const resetTracks = useCallback(() => {
    setCurrentTrackIndex(0);
    setPlayerState((prev) => ({
      ...tracks[0],
      progress: 0,
      isPlaying: prev.isPlaying,
      shuffleState: prev.shuffleState,
      repeatState: prev.repeatState,
    }));
  }, []);

  const togglePlay = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const nextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setPlayerState((prev) => ({
      ...tracks[nextIndex],
      progress: 0,
      isPlaying: prev.isPlaying,
      shuffleState: prev.shuffleState,
      repeatState: prev.repeatState,
    }));
  }, [currentTrackIndex]);

  const previousTrack = useCallback(() => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
    setPlayerState((prev) => ({
      ...tracks[prevIndex],
      progress: 0,
      isPlaying: prev.isPlaying,
      shuffleState: prev.shuffleState,
      repeatState: prev.repeatState,
    }));
  }, [currentTrackIndex]);

  const toggleShuffle = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, shuffleState: !prev.shuffleState }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setPlayerState((prev) => ({
      ...prev,
      repeatState:
        prev.repeatState === "off"
          ? "all"
          : prev.repeatState === "all"
            ? "track"
            : "off",
    }));
  }, []);

  const handleSliderChange = useCallback((values) => {
    const [newProgress] = values;
    setPlayerState((prev) => ({ ...prev, progress: newProgress }));
  }, []);

  useEffect(() => {
    let intervalId;

    if (playerState.isPlaying) {
      intervalId = setInterval(() => {
        setPlayerState((prev) => {
          const newProgress = prev.progress + 100 / (prev.durationMs / 1000);
          if (newProgress >= 100) {
            if (prev.repeatState === "track") {
              return { ...prev, progress: 0 };
            } else {
              setCurrentTrackIndex(
                (currentIndex) =>
                  (currentIndex - 1 + tracks.length) % tracks.length,
              );
              return {
                ...tracks[
                  (currentTrackIndex - 1 + tracks.length) % tracks.length
                ],
                progress: 0,
                isPlaying: prev.isPlaying,
                shuffleState: prev.shuffleState,
                repeatState: prev.repeatState,
              };
            }
          }
          return { ...prev, progress: newProgress };
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [
    playerState.isPlaying,
    playerState.repeatState,
    playerState.shuffleState,
    playerState.durationMs,
    setCurrentTrackIndex,
    nextTrack,
  ]);

  return (
    <div className="w-full h-full flex gap-3 flex-col items-center justify-center relative aspect-video rounded-3xl overflow-hidden border-8 border-zinc-100/5 shadow-2xl shadow-zinc-100/5">
      <div className="py-1.5 px-2 absolute top-0 w-full z-10 bg-zinc-900/75 text-zinc-500">
        <div className="flex items-center gap-1">
          <Button
            onClick={previousTrack}
            className="p-0.5 bg-zinc-100/5 data-[hover]:bg-zinc-100/10 data-[focus]:bg-zinc-100/10 ease-out duration-75 outline-none rounded group"
          >
            <ArrowLeftIcon className="size-4 group-data-[hover]:text-zinc-400 group-data-[hover]:scale-110 group-data-[focus]:text-zinc-400 group-data-[focus]:scale-110 ease-out duration-75" />
          </Button>
          <Button
            onClick={nextTrack}
            className="p-0.5 bg-zinc-100/5 data-[hover]:bg-zinc-100/10 data-[focus]:bg-zinc-100/10 ease-out duration-75 outline-none rounded group"
          >
            <ArrowRightIcon className="size-4 group-data-[hover]:text-zinc-400 group-data-[hover]:scale-110 group-data-[focus]:text-zinc-400 group-data-[focus]:scale-110 ease-out duration-75" />
          </Button>
          <Button
            onClick={resetTracks}
            className="p-0.5 bg-zinc-100/5 data-[hover]:bg-zinc-100/10 data-[focus]:bg-zinc-100/10 ease-out duration-75 outline-none rounded group"
          >
            <ArrowPathIcon className="size-4 text-zinc-400 group-data-[hover]:text-zinc-300 group-data-[hover]:scale-110 group-data-[focus]:text-zinc-300 group-data-[focus]:scale-110 ease-out duration-75" />
          </Button>
          <div className="text-xs flex items-center justify-between gap-1.5 flex-1 text-zinc-300 py-0.5 px-1.5 bg-zinc-100/5 rounded">
            <div className="flex items-center gap-1.5">
              <Button className="outline-none rounded group">
                <AdjustmentsHorizontalIcon className="size-4 text-zinc-400 group-data-[hover]:text-zinc-300 group-data-[hover]:scale-110 group-data-[focus]:text-zinc-300 group-data-[focus]:scale-110 ease-out duration-75" />
              </Button>

              {playerState.link.slice(8)}
            </div>
            <Button className="outline-none rounded group">
              <LinkIcon className="size-4 text-zinc-400 group-data-[hover]:text-zinc-300 group-data-[hover]:scale-110 group-data-[focus]:text-zinc-300 group-data-[focus]:scale-110 ease-out duration-75" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-8 max-w-md w-full h-fit bg-zinc-900/5 backdrop-blur-xl rounded-2xl overflow-hidden z-10 p-4 relative">
        <div className="flex flex-col md:flex-row items-center gap-3 h-full">
          <div className="relative shrink-0 overflow-hidden outline-none group w-auto h-full rounded-xl">
            <img
              src={playerState.album.image}
              className="group-focus:scale-110 group-hover:scale-110 transition ease-out duration-75 w-full md:size-20"
              alt={`${playerState.album.name} Cover`}
            />
          </div>
          <div className="truncate w-full self-start md:self-center">
            <a
              href={playerState.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-100 hover:underline underline-offset-2 inline-block text-lg font-semibold md:font-bold"
            >
              {playerState.name}
            </a>
            <div className="flex items-center text-zinc-300 text-base space-x-1 font-medium">
              <div className="flex items-center space-x-1">
                {playerState.artists.map((item, index) => (
                  <Fragment key={index}>
                    <a
                      className="hover:underline underline-offset-2"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.name}
                    </a>
                    {index < playerState.artists.length - 1 && (
                      <span className="text-zinc-400">·</span>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
            <div className="truncate text-zinc-300 text-sm font-medium">
              <a
                className="hover:underline underline-offset-2"
                href={playerState.album.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {playerState.album.name}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-sm w-full bg-zinc-900/5 backdrop-blur-xl rounded-2xl overflow-hidden z-10 p-4 relative">
        <div className="relative">
          <Slider
            value={[playerState.progress]}
            onValueChange={handleSliderChange}
            min={0}
            max={100}
            step={1}
            size={"4"}
          />
          <div className="w-full flex justify-between text-zinc-300 mt-1 text-xs">
            <span className="hover:text-zinc-200 transition ease-out duration-75 select-none">
              {formatTime(
                (playerState.progress * playerState.durationMs) / 100,
              )}
            </span>
            <span className="hover:text-zinc-200 transition ease-out duration-75 select-none">
              {formatTime(playerState.durationMs)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button className="p-1 outline-none relative group text-zinc-200">
            <RecentlyTracksIcon className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
          </Button>
          <div className="flex items-center justify-center gap-1">
            <Button
              onClick={toggleShuffle}
              className="mr-2 p-1 outline-none relative group text-zinc-400"
            >
              <ShuffleIcon
                className={`size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75 ${
                  playerState.shuffleState && "stroke-zinc-200"
                }`}
              />
              {playerState.shuffleState && (
                <div className="size-1 absolute bottom-0 translate-x-[5px] translate-y-[3px] bg-zinc-200 rounded-full" />
              )}
            </Button>
            <Button
              onClick={previousTrack}
              className="p-1 outline-none relative group text-zinc-300"
            >
              <BackwardIcon className="size-6 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
            </Button>
            <Button
              onClick={togglePlay}
              className="p-1 outline-none relative group text-zinc-200"
            >
              {playerState.isPlaying ? (
                <PauseIcon className="size-6 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
              ) : (
                <PlayIcon className="size-6 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
              )}
            </Button>
            <Button
              onClick={nextTrack}
              className="p-1 outline-none relative group text-zinc-300"
            >
              <ForwardIcon className="size-6 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
            </Button>
            <Button
              onClick={toggleRepeat}
              className="ml-2 p-1 outline-none relative group text-zinc-400"
            >
              <RepeatIcon
                className={`size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75 ${
                  playerState.repeatState !== "off" && "stroke-zinc-200"
                }`}
                repeatState={playerState.repeatState}
              />
              {playerState.repeatState !== "off" && (
                <div className="size-1 absolute bottom-0 translate-x-[5px] translate-y-[3px] bg-zinc-200 rounded-full" />
              )}
            </Button>
          </div>
          <Button className="p-1 outline-none relative group text-zinc-200">
            <QueueIcon className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
          </Button>
        </div>
      </div>
      <GradientBackground
        className="absolute inset-0 w-full h-full overflow-hidden data-[closed]:opacity-0 duration-300 ease-out"
        colors={[
          playerState.currentPalette[0],
          playerState.currentPalette[1],
          playerState.currentPalette[2],
        ]}
      />
    </div>
  );
}
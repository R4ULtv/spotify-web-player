"use client";

import { Button, Transition } from "@headlessui/react";
import { Fragment, useMemo, useRef, useEffect, useState } from "react";
import { useSpotify } from "@/components/providers/SpotifyProvider";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import { InfiniteSlider } from "@/components/animations/infinite-slider";
import { Slider } from "@/components/ui/slider";

const formatTime = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const ShuffleIcon = ({ shuffleState }) => (
  <svg
    className={`size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75 ${
      shuffleState && "stroke-zinc-200"
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
);

const RepeatIcon = ({ repeatState }) => (
  <svg
    className={`size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75 ${
      repeatState !== "off" && "stroke-zinc-200"
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
    {repeatState === "track" && <path d="M11 10h1v4" />}
  </svg>
);

const TrackInfo = ({ currentTrack, tvMode }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const artistsContainerRef = useRef(null);
  const artistsContentRef = useRef(null);
  const [isArtistsOverflowing, setIsArtistsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && contentRef.current) {
        setIsOverflowing(
          contentRef.current.scrollWidth > containerRef.current.clientWidth
        );
      }
      if (artistsContainerRef.current && artistsContentRef.current) {
        setIsArtistsOverflowing(
          artistsContentRef.current.scrollWidth >
            artistsContainerRef.current.clientWidth
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [currentTrack.name, currentTrack.artists]);

  return (
    <div
      ref={containerRef}
      className="truncate w-full self-start md:self-center"
    >
      {isOverflowing ? (
        <InfiniteSlider durationOnHover={75}>
          <a
            ref={contentRef}
            href={currentTrack.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-zinc-100 hover:underline underline-offset-2 inline-block ${
              tvMode
                ? "text-4xl lg:text-8xl font-black"
                : "text-lg font-semibold md:font-bold"
            }`}
          >
            {currentTrack.name}
          </a>
        </InfiniteSlider>
      ) : (
        <a
          ref={contentRef}
          href={currentTrack.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-zinc-100 hover:underline underline-offset-2 inline-block ${
            tvMode
              ? "text-4xl lg:text-8xl font-black"
              : "text-lg font-semibold md:font-bold"
          }`}
        >
          {currentTrack.name}
        </a>
      )}
      <div
        ref={artistsContainerRef}
        className={`flex items-center text-zinc-300 ${
          tvMode
            ? "text-base lg:text-3xl font-semibold space-x-2"
            : "text-base space-x-1 font-medium"
        }`}
      >
        {currentTrack.explicit && (
          <span
            className={`px-1.5 py-0.5 text-zinc-300 bg-zinc-500/25 rounded w-min select-none ${
              tvMode ? "text-sm lg:text-base" : "text-sm"
            }`}
          >
            E
          </span>
        )}
        {isArtistsOverflowing ? (
          <InfiniteSlider durationOnHover={75}>
            <div
              ref={artistsContentRef}
              className="flex items-center space-x-1"
            >
              {currentTrack.artists.map((item, index) => (
                <Fragment key={index}>
                  <a
                    className="hover:underline underline-offset-2 whitespace-nowrap"
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
          </InfiniteSlider>
        ) : (
          <div ref={artistsContentRef} className="flex items-center space-x-1">
            {currentTrack.artists.map((item, index) => (
              <Fragment key={index}>
                <a
                  className="hover:underline underline-offset-2"
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
        )}
      </div>
      <div
        className={`truncate text-zinc-300 ${
          tvMode ? "text-base lg:text-2xl font-semibold" : "text-sm font-medium"
        }`}
      >
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
  );
};

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
    rotateRepeatState,
    toggleFullScreen,
    fullScreen,
    tvMode,
    seekTrack,
  } = useSpotify();

  const [sliderValue, setSliderValue] = useState(progressPercentage);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setSliderValue(progressPercentage);
    }
  }, [progressPercentage, isDragging]);

  const handleSliderChange = (value) => {
    setSliderValue(value[0]);
    setIsDragging(true);
  };

  const handleSliderCommit = (value) => {
    const positionMs = Math.round((value[0] / 100) * currentTrack.durationMs);
    seekTrack(positionMs);
    setIsDragging(false);
  };

  const albumCover = useMemo(() => {
    if (!currentTrack) return null;
    return (
      <Button
        onClick={toggleFullScreen}
        className={`relative shrink-0 w-full md:h-full md:w-auto group`}
      >
        <img
          alt="Album Cover"
          src={currentTrack.album.images[0].url}
          srcSet={`${currentTrack.album.images[1].url} 1x, ${currentTrack.album.images[0].url} 2x`}
          loading="lazy"
          className={`rounded-xl ${
            tvMode
              ? "w-full h-full aspect-square"
              : "w-full md:w-auto md:size-24"
          }`}
        />
        <div className="invisible group-data-[hover]:visible transition ease-out flex items-center justify-center absolute inset-0 bg-transparent group-data-[hover]:bg-zinc-900/50 text-zinc-200 rounded-xl">
          {fullScreen ? (
            <ArrowsPointingInIcon className="size-5" />
          ) : (
            <ArrowsPointingOutIcon className="size-5" />
          )}
        </div>
      </Button>
    );
  }, [currentTrack, fullScreen, toggleFullScreen, tvMode]);

  const trackControls = useMemo(() => {
    if (!currentTrack) return null;
    return (
      <div className="w-full">
        <div className="relative">
          <Slider
            value={[sliderValue]}
            onValueChange={handleSliderChange}
            onValueCommit={handleSliderCommit}
            min={0}
            max={100}
            step={1}
          />
          <div className="w-full flex justify-between text-xs text-zinc-300 mt-1">
            <span className="hover:text-zinc-200 transition ease-out duration-75 select-none">
              {formatTime(progress)}
            </span>
            <span className="hover:text-zinc-200 transition ease-out duration-75 select-none">
              {formatTime(currentTrack.durationMs)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button
            onClick={toggleShuffle}
            className="p-1 outline-none relative group text-zinc-400"
          >
            <ShuffleIcon shuffleState={currentTrack.shuffleState} />
            {currentTrack.shuffleState && (
              <div className="size-1 absolute bottom-0 translate-x-[5px] translate-y-[3px] bg-zinc-200 rounded-full" />
            )}
          </Button>
          <div className="flex items-center justify-center gap-1">
            <Button
              onClick={isPlaying ? skipToPrevious : null}
              className="p-1 outline-none relative group text-zinc-300"
            >
              <BackwardIcon className="size-5 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
            </Button>
            <Button
              onClick={togglePlay}
              className="p-1 rounded-xl outline-none relative group text-zinc-200"
            >
              {isPlaying ? (
                <PauseIcon className="size-6 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
              ) : (
                <PlayIcon className="size-6 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
              )}
            </Button>
            <Button
              onClick={isPlaying ? skipToNext : null}
              className="p-1 outline-none relative group text-zinc-300"
            >
              <ForwardIcon className="size-5 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
            </Button>
          </div>
          <Button
            onClick={rotateRepeatState}
            className="p-1 outline-none relative group text-zinc-400"
          >
            <RepeatIcon repeatState={currentTrack.repeatState} />
            {currentTrack.repeatState !== "off" && (
              <div className="size-1 absolute bottom-0 translate-x-[5px] translate-y-[3px] bg-zinc-200 rounded-full" />
            )}
          </Button>
        </div>
      </div>
    );
  }, [
    currentTrack,
    sliderValue,
    progress,
    seekTrack,
    skipToPrevious,
    skipToNext,
    togglePlay,
  ]);

  if (!currentTrack) return null;

  return (
    <Transition show={!!currentTrack} appear as={Fragment}>
      <div
        className={`absolute flex gap-3 flex-col items-center justify-center transition ease-out data-[closed]:scale-50 data-[closed]:opacity-0 ${
          tvMode ? "inset-1/16" : "inset-2"
        }`}
      >
        <div
          className={`bg-zinc-900/5 backdrop-blur-xl p-4 rounded-2xl ${
            tvMode ? "w-full h-1/2" : "sm:max-w-md w-full"
          }`}
        >
          <div className="flex items-center gap-3 flex-col md:flex-row h-full">
            {albumCover}
            <div
              className={`truncate w-full ${
                tvMode && "h-full flex flex-col justify-around gap-2"
              }`}
            >
              <TrackInfo currentTrack={currentTrack} tvMode={tvMode} />
              {tvMode && trackControls}
            </div>
          </div>
        </div>
        {!tvMode && (
          <div className="sm:max-w-sm w-full bg-zinc-900/5 backdrop-blur-xl p-4 rounded-2xl">
            {trackControls}
          </div>
        )}
      </div>
    </Transition>
  );
}

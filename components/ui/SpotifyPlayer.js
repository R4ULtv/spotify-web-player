"use client";

import { Button, Transition } from "@headlessui/react";
import { Fragment, useMemo, useRef, useEffect, useState } from "react";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";

import { useMedia } from "@/components/providers/MediaProvider";
import { useSpotify } from "@/components/providers/SpotifyProvider";

import { InfiniteSlider } from "@/components/animations/infinite-slider";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/components/utils/hooks";
import {
  QueueIcon,
  RecentlyTracksIcon,
  ShuffleIcon,
  RepeatIcon,
} from "@/components/utils/icons";

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
          contentRef.current.scrollWidth > containerRef.current.clientWidth,
        );
      }
      if (artistsContainerRef.current && artistsContentRef.current) {
        setIsArtistsOverflowing(
          artistsContentRef.current.scrollWidth >
            artistsContainerRef.current.clientWidth,
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
    seekTrack,
    isPlayingAds,
  } = useSpotify();

  const {
    tvMode,
    setIsOpenTrackDrawer,
    setSelectedDrawerTab,
    isPortrait,
    toggleFullScreen,
    fullScreen,
  } = useMedia();

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
        className={`relative shrink-0 overflow-hidden outline-none group ${
          !tvMode
            ? "w-full md:h-full md:w-auto rounded-xl"
            : "w-auto h-full rounded-xl md:rounded-3xl"
        }`}
      >
        <img
          alt="Album Cover"
          src={currentTrack.album.images[0].url}
          srcSet={
            !tvMode
              ? `${currentTrack.album.images[1].url} 1x, ${currentTrack.album.images[0].url} 2x`
              : undefined
          }
          className={`group-data-[focus]:scale-110 group-data-[hover]:scale-110 transition ease-out duration-75 ${
            tvMode
              ? "w-full h-full aspect-square"
              : "w-full md:w-auto md:size-20"
          }`}
        />
        <div className="invisible group-data-[hover]:visible group-data-[focus]:visible transition ease-out flex items-center justify-center absolute inset-0 bg-transparent group-data-[hover]:bg-zinc-900/50 group-data-[focus]:bg-zinc-900/50 text-zinc-200">
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
            size={tvMode ? "6" : "4"}
          />
          <div
            className={`w-full flex justify-between text-zinc-300 mt-1 ${
              tvMode ? "text-base lg:text-xl" : "text-xs"
            }`}
          >
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
            onClick={() => {
              setSelectedDrawerTab(1);
              setIsOpenTrackDrawer(true);
            }}
            className={`p-1 outline-none relative group text-zinc-200 ${
              tvMode ? "scale-150" : ""
            }`}
          >
            <RecentlyTracksIcon className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
          </Button>
          <div
            className={`flex items-center justify-center gap-1 ${
              tvMode ? "gap-4" : ""
            }`}
          >
            <Button
              onClick={toggleShuffle}
              className={`mr-2 p-1 outline-none relative group text-zinc-400 ${
                tvMode ? "scale-150" : ""
              }`}
            >
              <ShuffleIcon
                className={`size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75 ${
                  currentTrack.shuffleState && "stroke-zinc-200"
                }`}
              />
              {currentTrack.shuffleState && (
                <div className="size-1 absolute bottom-0 translate-x-[5px] translate-y-[3px] bg-zinc-200 rounded-full" />
              )}
            </Button>
            <Button
              onClick={isPlaying ? skipToPrevious : null}
              className={`p-1 outline-none relative group text-zinc-300 ${
                tvMode ? "scale-150" : ""
              }`}
            >
              <BackwardIcon className="size-6 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
            </Button>
            <Button
              onClick={togglePlay}
              className={`p-1 outline-none relative group text-zinc-200 ${
                tvMode ? "scale-150" : ""
              }`}
            >
              {isPlaying ? (
                <PauseIcon className="size-6 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
              ) : (
                <PlayIcon className="size-6 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
              )}
            </Button>
            <Button
              onClick={isPlaying ? skipToNext : null}
              className={`p-1 outline-none relative group text-zinc-300 ${
                tvMode ? "scale-150" : ""
              }`}
            >
              <ForwardIcon className="size-6 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
            </Button>
            <Button
              onClick={rotateRepeatState}
              className={`ml-2 p-1 outline-none relative group text-zinc-400 ${
                tvMode ? "scale-150" : ""
              }`}
            >
              <RepeatIcon
                className={`size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75 ${
                  currentTrack.repeatState !== "off" && "stroke-zinc-200"
                }`}
                repeatState={currentTrack.repeatState}
              />
              {currentTrack.repeatState !== "off" && (
                <div className="size-1 absolute bottom-0 translate-x-[5px] translate-y-[3px] bg-zinc-200 rounded-full" />
              )}
            </Button>
          </div>
          <Button
            onClick={() => {
              setSelectedDrawerTab(0);
              setIsOpenTrackDrawer(true);
            }}
            className={`p-1 outline-none relative group text-zinc-200 ${
              tvMode ? "scale-150" : ""
            }`}
          >
            <QueueIcon className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
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
    tvMode,
  ]);

  if (!currentTrack) return null;

  return (
    <Transition
      show={!!currentTrack && !isPlayingAds && (!tvMode || !isPortrait)}
      as={Fragment}
      appear
    >
      <div className="absolute flex gap-3 flex-col items-center justify-center transition-all ease-out data-[closed]:scale-50 data-[closed]:opacity-0 inset-4">
        <div
          className={`bg-zinc-900/5 backdrop-blur-xl ${
            tvMode
              ? "w-full h-3/4 md:h-3/5 md:max-w-[90%] rounded-3xl p-4 md:rounded-6xl md:p-8"
              : "sm:max-w-md w-full rounded-2xl p-4"
          }`}
        >
          <div
            className={`flex items-center gap-3 h-full ${
              !tvMode ? "flex-col md:flex-row" : ""
            }`}
          >
            {albumCover}
            <div
              className={`truncate w-full ${
                tvMode ? "h-full flex flex-col justify-around gap-2" : ""
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

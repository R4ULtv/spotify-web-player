"use client";

import {
  Button,
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
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
import { formatTime } from "@/components/utils/hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const RecentlyTracksIcon = () => (
  <svg
    className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 18H3" />
    <path d="m15 18 2 2 4-4" />
    <path d="M16 12H3" />
    <path d="M16 6H3" />
  </svg>
);

const QueueIcon = () => (
  <svg
    className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15V6" />
    <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    <path d="M12 12H3" />
    <path d="M16 6H3" />
    <path d="M12 18H3" />
  </svg>
);

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
    toggleTvMode,
    fullScreen,
    tvMode,
    seekTrack,
    isPlayingAds,
    setIsOpenDrawer,
  } = useSpotify();

  const [sliderValue, setSliderValue] = useState(progressPercentage);
  const [isDragging, setIsDragging] = useState(false);

  const [isPortrait, setIsPortrait] = useState(false);
  const [showRotateDialog, setShowRotateDialog] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsPortrait(isPortrait);
      setShowRotateDialog(tvMode && isPortrait);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, [tvMode]);

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
        className={`relative shrink-0 overflow-hidden outline-none rounded-xl group ${
          !tvMode ? "md:h-full md:w-auto" : "w-auto h-full"
        }`}
      >
        <img
          alt="Album Cover"
          src={currentTrack.album.images[0].url}
          srcSet={`${currentTrack.album.images[1].url} 1x, ${currentTrack.album.images[0].url} 2x`}
          loading="lazy"
          className={`group-hover:scale-110 transition ease-out duration-75 ${
            tvMode
              ? "w-full h-full aspect-square"
              : "w-full md:w-auto md:size-24"
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
      <TooltipProvider>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsOpenDrawer(true)}
                  className={`p-1 outline-none relative group text-zinc-200 ${
                    tvMode ? "scale-150" : ""
                  }`}
                >
                  <RecentlyTracksIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Recently Played</TooltipContent>
            </Tooltip>
            <div
              className={`flex items-center justify-center gap-1 ${
                tvMode ? "gap-4" : ""
              }`}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={toggleShuffle}
                    className={`mr-2 p-1 outline-none relative group text-zinc-400 ${
                      tvMode ? "scale-150" : ""
                    }`}
                  >
                    <ShuffleIcon shuffleState={currentTrack.shuffleState} />
                    {currentTrack.shuffleState && (
                      <div className="size-1 absolute bottom-0 translate-x-[5px] translate-y-[3px] bg-zinc-200 rounded-full" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Shuffle</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={isPlaying ? skipToPrevious : null}
                    className={`p-1 outline-none relative group text-zinc-300 ${
                      tvMode ? "scale-150" : ""
                    }`}
                  >
                    <BackwardIcon className="size-6 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Previous</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent>{isPlaying ? "Pause" : "Play"}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={isPlaying ? skipToNext : null}
                    className={`p-1 outline-none relative group text-zinc-300 ${
                      tvMode ? "scale-150" : ""
                    }`}
                  >
                    <ForwardIcon className="size-6 group-data-[hover]:scale-110 group-data-[focus]:scale-110 transition ease-out duration-75" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Next</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={rotateRepeatState}
                    className={`ml-2 p-1 outline-none relative group text-zinc-400 ${
                      tvMode ? "scale-150" : ""
                    }`}
                  >
                    <RepeatIcon repeatState={currentTrack.repeatState} />
                    {currentTrack.repeatState !== "off" && (
                      <div className="size-1 absolute bottom-0 translate-x-[5px] translate-y-[3px] bg-zinc-200 rounded-full" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Repeat</TooltipContent>
              </Tooltip>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={`p-1 outline-none relative group text-zinc-200 ${
                    tvMode ? "scale-150" : ""
                  }`}
                >
                  <QueueIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Queue</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
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
    <>
      <Transition show={!!currentTrack && !isPlayingAds} as={Fragment} appear>
        <div
          className={`absolute flex gap-3 flex-col items-center justify-center transition ease-out data-[closed]:scale-50 data-[closed]:opacity-0 ${
            tvMode ? "inset-1/16" : "inset-2"
          }`}
        >
          <div
            className={`bg-zinc-900/5 backdrop-blur-xl p-4 rounded-2xl ${
              tvMode ? "w-full h-3/5" : "sm:max-w-md w-full"
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

      <Dialog
        open={showRotateDialog}
        onClose={() => {
          if (!isPortrait) {
            setShowRotateDialog(false);
          }
        }}
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/40 z-50 data-[closed]:opacity-0 ease-out duration-75"
        />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-50">
          <DialogPanel
            transition
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl data-[closed]:opacity-0 data-[closed]:scale-50 ease-out duration-75"
          >
            <DialogTitle className="text-lg font-semibold leading-6 text-center text-gray-900">
              Please Rotate Your Device
            </DialogTitle>
            <div className="mt-2">
              <div className="flex items-center justify-center p-2">
                <svg
                  className="size-12 text-gray-500 animate-[spin_4s_linear_infinite]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
              </div>
              <Description className="text-center text-sm text-gray-500 text-balance">
                For the best viewing experience in TV mode, please rotate your
                device to landscape orientation.
              </Description>

              <Button
                onClick={() => {
                  toggleTvMode();
                  setShowRotateDialog(false);
                }}
                className="mt-4 p-2 w-full bg-zinc-200 text-zinc-900 text-sm font-semibold rounded-lg"
              >
                Disable TV Mode
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

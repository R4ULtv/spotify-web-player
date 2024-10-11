"use client";

import { Drawer } from "vaul";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";

import { useSpotify } from "@/components/providers/SpotifyProvider";
import { useMedia } from "@/components/providers/MediaProvider";
import { formatRelativeTime, formatTime, useMediaQuery } from "@/components/utils/hooks";

export default function TracksDrawer() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const snapPoints = useMemo(() => [0.6, 1], []);
  const [snap, setSnap] = useState(snapPoints[0]);
  const { recentlyTracks } = useSpotify();
  const { isOpenTrackDrawer, setIsOpenTrackDrawer } = useMedia();

  const TrackList = useMemo(
    () => (
      <div className="flex flex-col gap-2">
        {recentlyTracks.map((track, index) => (
          <TrackItem key={index} track={track} />
        ))}
      </div>
    ),
    [recentlyTracks]
  );

  if (isDesktop) {
    return (
      <DesktopDialog
        isOpen={isOpenTrackDrawer}
        onClose={() => setIsOpenTrackDrawer(false)}
        title="Recently Played Tracks"
        description={getDescription(recentlyTracks)}
        content={TrackList}
      />
    );
  }

  return (
    <MobileDrawer
      isOpen={isOpenTrackDrawer}
      onClose={() => setIsOpenTrackDrawer(false)}
      snapPoints={snapPoints}
      snap={snap}
      setSnap={setSnap}
      title="Recently Played Tracks"
      description={getDescription(recentlyTracks)}
      content={TrackList}
    />
  );
}

function TrackItem({ track }) {
  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <img
          src={track.album.images[0].url}
          alt={track.name}
          className="size-10 flex-shrink-0 rounded-md"
        />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-zinc-200 font-semibold text-sm truncate">
            {track.name}
          </span>
          <span className="text-zinc-400 text-xs truncate">
            {track.artists.map((artist) => artist.name).join(", ")}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center shrink-0">
        <span className="text-zinc-200 text-xs">
          {formatTime(track.durationMs)}
        </span>
        <span className="text-zinc-400 text-xs">
          {formatRelativeTime(track.playedAt)}
        </span>
      </div>
    </div>
  );
}

function getDescription(tracks) {
  return tracks.length
    ? `Last ${tracks.length} tracks`
    : "No recently played tracks";
}

function DesktopDialog({ isOpen, onClose, title, description, content }) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 z-20 data-[closed]:opacity-0 ease-out duration-150"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-20">
        <DialogPanel
          transition
          className="bg-zinc-900/50 backdrop-blur-xl flex flex-col rounded-2xl max-w-2xl w-full max-h-[90%] h-auto outline-none z-20 data-[closed]:opacity-0 data-[closed]:scale-50 ease-out duration-150"
        >
          <div className="p-6 flex-1 overflow-y-auto">
            <DialogTitle className="font-bold text-gray-200">
              {title}
            </DialogTitle>
            <Description className="text-zinc-400 text-sm mb-2">
              {description}
            </Description>
            {content}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

function MobileDrawer({
  isOpen,
  onClose,
  snapPoints,
  snap,
  setSnap,
  title,
  description,
  content,
}) {
  return (
    <Drawer.Root
      open={isOpen}
      onClose={onClose}
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      fadeFromIndex={0}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-20" />
        <Drawer.Content className="bg-zinc-900/50 backdrop-blur-xl flex flex-col rounded-t-2xl mt-24 h-[95%] fixed bottom-0 inset-x-0 mx-auto w-full md:max-w-2xl outline-none z-20">
          <div
            className={`p-6 flex-1 ${
              snap === 1 ? "overflow-y-auto" : "overflow-y-hidden"
            }`}
          >
            <div className="w-full">
              <div
                aria-hidden
                className={`mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-400 mb-4 ${
                  snap === snapPoints[0] ? "animate-bounce" : ""
                }`}
              />
              <Drawer.Title className="font-bold text-gray-200">
                {title}
              </Drawer.Title>
              <Drawer.Description className="text-zinc-400 text-sm mb-2">
                {description}
              </Drawer.Description>
              {content}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

"use client";

import { Drawer } from "vaul";
import { useState, useMemo, Fragment } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Description,
  TabGroup,
  TabPanels,
  TabPanel,
  TabList,
  Tab,
} from "@headlessui/react";

import { useSpotify } from "@/components/providers/SpotifyProvider";
import { useMedia } from "@/components/providers/MediaProvider";
import {
  formatRelativeTime,
  formatTime,
  useMediaQuery,
} from "@/components/utils/hooks";
import { QueueIcon, RecentlyTracksIcon } from "@/components/utils/icons";

const SNAP_POINTS = [0.6, 1];

export default function TracksDrawer() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [snap, setSnap] = useState(SNAP_POINTS[0]);
  const { recentlyTracks, currentQueue } = useSpotify();
  const {
    isOpenTrackDrawer,
    setIsOpenTrackDrawer,
    selectedDrawerTab,
    setSelectedDrawerTab,
  } = useMedia();

  const TrackList = useMemo(
    () => (
      <div className="flex flex-col gap-2">
        {recentlyTracks.map((track, index) => (
          <TrackItem
            key={track.id || index}
            track={track}
            isDesktop={isDesktop}
          />
        ))}
      </div>
    ),
    [recentlyTracks, isDesktop],
  );

  const queueList = useMemo(
    () =>
      currentQueue === "premium_required" ? (
        <div className="text-sm">
          Spotify Premium is required to view the queue.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {currentQueue.map((track, index) => (
            <TrackItem
              key={track.id || index}
              track={track}
              isDesktop={isDesktop}
            />
          ))}
        </div>
      ),
    [currentQueue, isDesktop],
  );

  const titles = ["Queue", "Recently Played Tracks"];
  const descriptions = [
    getDescription(
      "queue",
      currentQueue !== "premium_required" ? currentQueue : [],
    ),
    getDescription("recentlyTracks", recentlyTracks),
  ];
  const contents = [queueList, TrackList];

  return isDesktop ? (
    <DesktopDialog
      isOpen={isOpenTrackDrawer}
      onClose={() => setIsOpenTrackDrawer(false)}
      title={titles}
      description={descriptions}
      content={contents}
      selectedIndex={selectedDrawerTab}
      setSelectedIndex={setSelectedDrawerTab}
    />
  ) : (
    <MobileDrawer
      isOpen={isOpenTrackDrawer}
      onClose={() => setIsOpenTrackDrawer(false)}
      snapPoints={SNAP_POINTS}
      snap={snap}
      setSnap={setSnap}
      title={titles}
      description={descriptions}
      content={contents}
      selectedIndex={selectedDrawerTab}
      setSelectedIndex={setSelectedDrawerTab}
    />
  );
}

function TrackItem({ track, isDesktop }) {
  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <img
          src={track.album.images[2].url}
          alt={track.name}
          loading="lazy"
          className="size-10 flex-shrink-0 rounded-md"
        />
        <div className="flex flex-col min-w-0 flex-1">
          {isDesktop ? (
            <a
              href={track.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-200 font-semibold text-sm truncate hover:underline"
            >
              {track.name}
            </a>
          ) : (
            <span className="text-zinc-200 font-semibold text-sm truncate">
              {track.name}
            </span>
          )}
          {isDesktop ? (
            <div className="flex gap-1">
              {track.artists.map((artist, index) => (
                <Fragment key={artist.id || artist.name}>
                  <a
                    href={artist.link}
                    className="text-zinc-400 text-xs truncate hover:underline"
                  >
                    {artist.name}
                  </a>
                  {index < track.artists.length - 1 && (
                    <span className="text-zinc-400 text-xs">·</span>
                  )}
                </Fragment>
              ))}
            </div>
          ) : (
            <span className="text-zinc-400 text-xs truncate">
              {track.artists.map((artist) => artist.name).join(", ")}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end justify-center shrink-0">
        <span className="text-zinc-200 text-xs">
          {formatTime(track.durationMs)}
        </span>
        {track.playedAt && (
          <span className="text-zinc-400 text-xs">
            {formatRelativeTime(track.playedAt)}
          </span>
        )}
      </div>
    </div>
  );
}

function getDescription(type, tracks) {
  const count = tracks?.length ?? 0;
  return type === "queue"
    ? count
      ? `Next ${count} tracks`
      : "No tracks in the queue"
    : count
      ? `Last ${count} tracks`
      : "No recently played tracks";
}

function DesktopDialog({
  isOpen,
  onClose,
  title,
  description,
  content,
  selectedIndex,
  setSelectedIndex,
}) {
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
          <TabGroup
            selectedIndex={selectedIndex}
            onChange={setSelectedIndex}
            className="p-6 flex-1 overflow-y-auto"
          >
            <TabList className="flex items-center justify-between w-full">
              <div>
                <DialogTitle className="font-bold text-gray-200">
                  {title[selectedIndex]}
                </DialogTitle>
                <Description className="text-zinc-400 text-sm mb-2">
                  {description[selectedIndex]}
                </Description>
              </div>
              <TabButtons />
            </TabList>
            <TabPanels>
              {content.map((panel, index) => (
                <TabPanel key={index}>{panel}</TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
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
  selectedIndex,
  setSelectedIndex,
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
          <TabGroup
            selectedIndex={selectedIndex}
            onChange={setSelectedIndex}
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
              <TabList className="flex items-center justify-between w-full">
                <div>
                  <Drawer.Title className="font-bold text-gray-200">
                    {title[selectedIndex]}
                  </Drawer.Title>
                  <Drawer.Description className="text-zinc-400 text-sm mb-2">
                    {description[selectedIndex]}
                  </Drawer.Description>
                </div>
                <TabButtons />
              </TabList>
              <TabPanels>
                {content.map((panel, index) => (
                  <TabPanel key={index}>{panel}</TabPanel>
                ))}
              </TabPanels>
            </div>
          </TabGroup>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function TabButtons() {
  return (
    <div className="flex items-center justify-end gap-2">
      <Tab className="text-sm data-[selected]:font-semibold text-zinc-200 data-[selected]:text-zinc-100 data-[selected]:border border-zinc-500/50 px-2 py-1 flex items-center gap-1 rounded-md">
        <QueueIcon className="size-4" />
        <span className="hidden md:block">Queue</span>
      </Tab>
      <Tab className="text-sm data-[selected]:font-semibold text-zinc-200 data-[selected]:text-zinc-100 data-[selected]:border border-zinc-500/50 px-2 py-1 flex items-center gap-1 rounded-md">
        <RecentlyTracksIcon className="size-4" />
        <span className="hidden md:block">Recently Played</span>
      </Tab>
    </div>
  );
}

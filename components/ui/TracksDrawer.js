"use client";

import { Drawer } from "vaul";
import moment from "moment";

import { useSpotify } from "@/components/providers/SpotifyProvider";
import { formatTime } from "@/components/utils/formatting";

export default function TracksDrawer() {
  const { isOpenDrawer, setIsOpenDrawer, recentlyTracks } = useSpotify();

  return (
    <Drawer.Root open={isOpenDrawer} onOpenChange={setIsOpenDrawer}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-20" />
        <Drawer.Content className="bg-zinc-900/50 backdrop-blur-xl flex flex-col rounded-t-2xl mt-24 h-1/2 fixed bottom-0 inset-x-0 mx-auto max-w-2xl outline-none z-20">
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <div
                aria-hidden
                className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-500 mb-4"
              />
              <Drawer.Title className="font-bold text-gray-200">
                Recently Played Tracks
              </Drawer.Title>
              <Drawer.Description className="text-zinc-400 text-sm mb-2">
                {recentlyTracks.length
                  ? `Last ${recentlyTracks.length} tracks`
                  : "No recently played tracks"}
              </Drawer.Description>

              <div className="flex flex-col gap-2">
                {recentlyTracks.map((track, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 w-full"
                  >
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
                          {track.artists
                            .map((artist) => artist.name)
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-center shrink-0">
                      <span className="text-zinc-200 text-xs">
                        {formatTime(track.durationMs)}
                      </span>
                      <span className="text-zinc-400 text-xs">
                        {moment(track.playedAt).fromNow()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

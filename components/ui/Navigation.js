"use client";

import {
  Button,
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import {
  ArrowRightEndOnRectangleIcon,
  Bars3Icon,
  DevicePhoneMobileIcon,
  TvIcon,
} from "@heroicons/react/16/solid";
import { signOut } from "next-auth/react";
import { Fragment, useEffect, useState, useCallback, useMemo } from "react";

import { useSpotify } from "@/components/providers/SpotifyProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Navigation() {
  const { currentTrack, tvMode, toggleTvMode } = useSpotify();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const toolbarOpen = localStorage.getItem("toolbar-open");
    setIsOpen(toolbarOpen ? JSON.parse(toolbarOpen) : true);
  }, []);

  const toggleToolbar = useCallback(() => {
    setIsOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("toolbar-open", JSON.stringify(newState));
      return newState;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === ".") {
        event.preventDefault();
        toggleToolbar();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleToolbar]);

  const nav = useMemo(
    () => [
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
            fill="currentColor"
            className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75"
          >
            <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z" />
          </svg>
        ),
        label: "Open in Spotify",
        onClick: () => currentTrack && window.open(currentTrack.link, "_blank"),
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
            fill="currentColor"
            className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75"
          >
            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
          </svg>
        ),
        label: "Github Repo",
        onClick: () =>
          window.open(
            "https://github.com/R4ULtv/spotify-web-player/",
            "_blank"
          ),
        divedeAfter: true,
      },
      {
        icon: tvMode ? (
          <DevicePhoneMobileIcon className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75" />
        ) : (
          <TvIcon className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75" />
        ),
        label: tvMode ? "Exit TV Mode" : "Enter TV Mode (Experimental)",
        onClick: () => {
          toggleTvMode();
        },
        divedeAfter: true,
      },
      {
        icon: (
          <ArrowRightEndOnRectangleIcon className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75" />
        ),
        label: "Exit App",
        onClick: () => signOut(),
      },
    ],
    [currentTrack, tvMode, toggleTvMode]
  );

  const renderNavItems = useCallback(
    () =>
      nav.map((e, key) => (
        <Fragment key={key}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={e.onClick}
                className="p-2 data-[hover]:bg-zinc-800/25 data-[focus]:bg-zinc-800/25 transition ease-out duration-75 rounded-full outline-none relative group"
              >
                {e.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{e.label}</TooltipContent>
          </Tooltip>
          {e.divedeAfter && <div className="bg-zinc-500/25 h-5 w-px" />}
        </Fragment>
      )),
    [nav]
  );

  return (
    <TooltipProvider>
      <Transition show={isOpen}>
        <div className="absolute transform w-min transition ease-out data-[closed]:opacity-0 data-[closed]:scale-50 bottom-3 left-1/2 -translate-x-1/2 z-10">
          <div className="rounded-full bg-zinc-900/25 backdrop-blur-xl border border-zinc-500/25 text-zinc-200 shadow flex items-center gap-1 p-1 ">
            {renderNavItems()}
            <Popover className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverButton className="p-2 data-[hover]:bg-zinc-800/25 data-[focus]:bg-zinc-800/25 transition ease-out duration-75 rounded-full outline-none relative group">
                    <Bars3Icon className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75 ease-out transition" />
                  </PopoverButton>
                </TooltipTrigger>
                <TooltipContent>Shortcuts</TooltipContent>
              </Tooltip>

              <PopoverPanel
                transition
                anchor="top"
                className="relative z-50 [--anchor-gap:8px] origin-top-right bg-zinc-900/25 rounded-xl p-1 text-sm text-white transition ease-out outline-none data-[closed]:scale-50 data-[closed]:translate-y-1/2 data-[closed]:-translate-x-1/4 data-[closed]:opacity-0"
              >
                <Button className="group flex w-full items-center justify-between gap-3 rounded-lg py-1.5 px-3 data-[hover]:bg-zinc-800/25 data-[focus]:bg-zinc-800/25">
                  Previous/Next
                  <kbd className="text-xs text-zinc-200 bg-zinc-500/25 px-1 py-0.5 rounded">
                    ←/→
                  </kbd>
                </Button>
                <Button className="group flex w-full items-center justify-between gap-3 rounded-lg py-1.5 px-3 data-[hover]:bg-zinc-800/25 data-[focus]:bg-zinc-800/25">
                  Pause/Play
                  <kbd className="text-xs text-zinc-200 bg-zinc-500/25 px-1 py-0.5 rounded">
                    spacebar
                  </kbd>
                </Button>
                <Button className="group flex w-full items-center justify-between gap-3 rounded-lg py-1.5 px-3 data-[hover]:bg-zinc-800/25 data-[focus]:bg-zinc-800/25">
                  Backwards/Forwards
                  <kbd className="text-xs text-zinc-200 bg-zinc-500/25 px-1 py-0.5 rounded">
                    ⇧ + ←/→
                  </kbd>
                </Button>

                <div className="my-1 h-px bg-white/5" />

                <Button className="group flex w-full items-center justify-between gap-3 rounded-lg py-1.5 px-3 data-[hover]:bg-zinc-800/25 data-[focus]:bg-zinc-800/25">
                  Toggle Shuffle
                  <kbd className="text-xs text-zinc-200 bg-zinc-500/25 px-1 py-0.5 rounded">
                    s
                  </kbd>
                </Button>
                <Button className="group flex w-full items-center justify-between gap-3 rounded-lg py-1.5 px-3 data-[hover]:bg-zinc-800/25 data-[focus]:bg-zinc-800/25">
                  Repeat Mode
                  <kbd className="text-xs text-zinc-200 bg-zinc-500/25 px-1 py-0.5 rounded">
                    r
                  </kbd>
                </Button>
                <Button className="group flex w-full items-center justify-between gap-2 rounded-lg py-1.5 px-3 data-[hover]:bg-zinc-800/25 data-[focus]:bg-zinc-800/25">
                  Recently Played
                  <kbd className="text-xs text-zinc-200 bg-zinc-500/25 px-1 py-0.5 rounded">
                    p
                  </kbd>
                </Button>
                <Button className="group flex w-full items-center justify-between gap-2 rounded-lg py-1.5 px-3 data-[hover]:bg-zinc-800/25 data-[focus]:bg-zinc-800/25">
                  Queue
                  <kbd className="text-xs text-zinc-200 bg-zinc-500/25 px-1 py-0.5 rounded">
                    q
                  </kbd>
                </Button>

                <div className="my-1 h-px bg-white/5" />

                <Button className="group flex w-full items-center justify-between gap-2 rounded-lg py-1.5 px-3 data-[hover]:bg-zinc-800/25 data-[focus]:bg-zinc-800/25">
                  Toggle Fullscreen
                  <kbd className="text-xs text-zinc-200 bg-zinc-500/25 px-1 py-0.5 rounded">
                    f
                  </kbd>
                </Button>
                <Button className="group flex w-full items-center justify-between gap-2 rounded-lg py-1.5 px-3 data-[hover]:bg-zinc-800/25 data-[focus]:bg-zinc-800/25">
                  Toggle TV Mode
                  <kbd className="text-xs text-zinc-200 bg-zinc-500/25 px-1 py-0.5 rounded">
                    t
                  </kbd>
                </Button>
                <Button className="group flex w-full items-center justify-between gap-2 rounded-lg py-1.5 px-3 data-[hover]:bg-zinc-800/25 data-[focus]:bg-zinc-800/25">
                  Hide Toolbar
                  <kbd className="text-xs text-zinc-200 bg-zinc-500/25 px-1 py-0.5 rounded">
                    ⌘ + .
                  </kbd>
                </Button>
              </PopoverPanel>
            </Popover>
          </div>
        </div>
      </Transition>
    </TooltipProvider>
  );
}

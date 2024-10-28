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

import { useMedia } from "@/components/providers/MediaProvider";
import { useSpotify } from "@/components/providers/SpotifyProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GithubIcon, SpotifyIcon } from "@/components/utils/icons";

export default function Navigation() {
  const { currentTrack } = useSpotify();
  const { tvMode, toggleTvMode } = useMedia();
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
          <SpotifyIcon className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75" />
        ),
        label: "Open in Spotify",
        onClick: () => currentTrack && window.open(currentTrack.link, "_blank"),
      },
      {
        icon: (
          <GithubIcon className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75" />
        ),
        label: "Github Repo",
        onClick: () =>
          window.open(
            "https://github.com/R4ULtv/spotify-web-player/",
            "_blank",
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
    [currentTrack, tvMode, toggleTvMode],
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
    [nav],
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
                  Open Settings
                  <kbd className="text-xs text-zinc-200 bg-zinc-500/25 px-1 py-0.5 rounded">
                    b
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

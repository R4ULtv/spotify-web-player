"use client";

import { Drawer } from "vaul";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Description,
  Button,
} from "@headlessui/react";
import { useEffect, useState } from "react";

import { useMedia } from "@/components/providers/MediaProvider";
import { useSpotify } from "@/components/providers/SpotifyProvider";

export default function RotateDeviceDrawer() {
  const { isPortrait } = useMedia();
  const { tvMode, toggleTvMode } = useSpotify();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (tvMode && isPortrait) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [tvMode, isPortrait]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        if (!isPortrait) {
          setIsOpen(false);
        }
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 z-20 data-[closed]:opacity-0 ease-out duration-150"
      />
      <div className="fixed inset-0 flex w-svw h-svh items-center justify-center p-4 z-20">
        <DialogPanel
          transition
          className="bg-zinc-900/50 backdrop-blur-xl flex flex-col rounded-2xl max-w-2xl w-full h-fit outline-none z-20 data-[closed]:opacity-0 data-[closed]:scale-50 ease-out duration-150"
        >
          <div className="p-6 flex-1 overflow-y-auto">
            <DialogTitle className="font-bold text-gray-200 text-center">
              Please Rotate Your Device
            </DialogTitle>
            <div className="flex items-center justify-center p-2">
              <svg
                className="size-12 text-gray-400 animate-[spin_4s_linear_infinite]"
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
            <Description className="text-zinc-300 text-sm mb-2 text-center text-balance">
              For the best viewing experience in TV mode, please rotate your
              device to landscape orientation.
            </Description>
            <Button
              onClick={() => {
                toggleTvMode();
                setIsOpen(false);
              }}
              className="mt-4 p-2 w-full bg-zinc-200 text-zinc-900 text-sm font-semibold rounded-lg"
            >
              Disable TV Mode
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
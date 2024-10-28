"use client";

import { Drawer } from "vaul";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Description,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Field,
  Label,
  Input,
  Button,
} from "@headlessui/react";

import { useMediaQuery } from "@/components/utils/hooks";
import {
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  CheckIcon,
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/16/solid";
import { useMedia } from "@/components/providers/MediaProvider";
import { presets } from "@/components/ui/background";

const SNAP_POINTS = [0.4, 1];
const filters = ["intensity", "area", "lightness", "saturation"];

export default function Settings() {
  const { isOpenSettings, setIsOpenSettings, bgSettings, setBgSettings } =
    useMedia();

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [snap, setSnap] = useState(SNAP_POINTS[0]);

  const title = "Background Settings";
  const description = "Change the background options";

  const content = useMemo(
    () =>
      bgSettings && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3">
            <Field className="flex-1 w-full">
              <Label className="text-sm">
                Colors Ordered by ({bgSettings.colors.desc ? "Desc" : "Asc"}):
              </Label>
              <Listbox
                value={bgSettings.colors.type}
                onChange={(value) => {
                  if (value === bgSettings.colors.type) {
                    setBgSettings({
                      ...bgSettings,
                      colors: {
                        ...bgSettings.colors,
                        desc: !bgSettings.colors.desc,
                      },
                    });
                  } else {
                    setBgSettings({
                      ...bgSettings,
                      colors: { type: value, desc: false },
                    });
                  }
                }}
              >
                <ListboxButton className="relative group flex items-center justify-between w-full rounded-lg bg-zinc-900/50 py-1.5 px-3 mt-1 text-left outline-none">
                  <span className="text-sm text-zinc-100 flex items-center gap-1.5">
                    {bgSettings.colors.desc ? (
                      <BarsArrowUpIcon className="size-3.5 fill-zinc-100" />
                    ) : (
                      <BarsArrowDownIcon className="size-3.5 fill-zinc-100" />
                    )}
                    {bgSettings.colors.type.charAt(0).toUpperCase() +
                      bgSettings.colors.type.slice(1)}
                  </span>
                  <ChevronDownIcon
                    className="pointer-events-none size-4 fill-zinc-300 group-data-[open]:rotate-180 duration-75 ease-out"
                    aria-hidden="true"
                  />
                </ListboxButton>
                <ListboxOptions
                  anchor="bottom"
                  transition
                  className="w-fit min-w-48 z-50 rounded-xl bg-zinc-900/75 border border-zinc-800 p-1 my-1 space-y-0.5 outline-none transition duration-150 data-[closed]:opacity-0 data-[closed]:-translate-y-5 data-[closed]:scale-50"
                >
                  {filters.map((item) => (
                    <ListboxOption
                      key={item}
                      value={item}
                      className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-zinc-800 data-[selected]:bg-zinc-800 ease-out duration-75"
                    >
                      {bgSettings.colors.desc ? (
                        <BarsArrowUpIcon className="invisible size-4 fill-zinc-100 group-data-[selected]:visible" />
                      ) : (
                        <BarsArrowDownIcon className="invisible size-4 fill-zinc-100 group-data-[selected]:visible" />
                      )}

                      <div className="text-sm text-zinc-300 group-data-[selected]:text-zinc-100">
                        {item.charAt(0).toUpperCase() + item.slice(1)}{" "}
                        {item === filters[0] &&
                          !bgSettings.colors.desc &&
                          "(Default)"}
                      </div>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>
            </Field>
            <Field className="flex-1 w-full">
              <Label className="text-sm">Animation Speed:</Label>
              <div className="flex items-center justify-between gap-1 relative text-sm text-zinc-100 w-full rounded-lg bg-zinc-900/50 py-1 pl-3 pr-1 mt-1 ">
                <Input
                  type="number"
                  value={bgSettings.uSpeed}
                  onChange={(e) =>
                    setBgSettings({
                      ...bgSettings,
                      uSpeed: Number(e.currentTarget.value),
                    })
                  }
                  min={0.01}
                  max={2}
                  step={0.01}
                  placeholder="0.1"
                  className="bg-transparent flex-1 text-left outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  onClick={() =>
                    setBgSettings({
                      ...bgSettings,
                      uSpeed: Math.max(
                        0.01,
                        Number((bgSettings.uSpeed - 0.01).toFixed(2)),
                      ),
                    })
                  }
                  disabled={bgSettings.uSpeed <= 0.01}
                  className="bg-zinc-100/5 p-1 rounded-md data-[hover]:bg-zinc-100/10 transition-colors duration-75 ease-out data-[disabled]:opacity-50"
                >
                  <MinusIcon className="size-4" />
                </Button>
                <Button
                  onClick={() =>
                    setBgSettings({
                      ...bgSettings,
                      uSpeed: Math.min(
                        2,
                        Number((bgSettings.uSpeed + 0.01).toFixed(2)),
                      ),
                    })
                  }
                  disabled={bgSettings.uSpeed >= 2}
                  className="bg-zinc-100/5 p-1 rounded-md data-[hover]:bg-zinc-100/10 transition-colors duration-75 ease-out data-[disabled]:opacity-50"
                >
                  <PlusIcon className="size-4" />
                </Button>
              </div>
            </Field>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3">
            <Field className="flex-1 w-full">
              <Label className="text-sm">Animation:</Label>
              <Listbox
                value={bgSettings.animation}
                onChange={(value) => {
                  if (value === bgSettings.animation) {
                    setBgSettings({
                      ...bgSettings,
                      animation: !bgSettings.animation,
                    });
                  } else {
                    setBgSettings({
                      ...bgSettings,
                      animation: value,
                    });
                  }
                }}
              >
                <ListboxButton className="relative group flex items-center justify-between w-full rounded-lg bg-zinc-900/50 py-1.5 px-3 mt-1 text-left outline-none">
                  <span className="text-sm text-zinc-100 flex items-center gap-1.5">
                    {bgSettings.animation ? "Enabled" : "Disabled"}
                  </span>
                  <ChevronDownIcon
                    className="pointer-events-none size-4 fill-zinc-300 group-data-[open]:rotate-180 duration-75 ease-out"
                    aria-hidden="true"
                  />
                </ListboxButton>
                <ListboxOptions
                  anchor="bottom"
                  transition
                  className="w-fit min-w-48 z-50 rounded-xl bg-zinc-900/75 border border-zinc-800 p-1 my-1 space-y-0.5 outline-none transition duration-150 data-[closed]:opacity-0 data-[closed]:-translate-y-5 data-[closed]:scale-50"
                >
                  <ListboxOption
                    value={true}
                    className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-zinc-800 data-[selected]:bg-zinc-800 ease-out duration-75"
                  >
                    <CheckIcon className="invisible size-4 fill-zinc-100 group-data-[selected]:visible" />
                    <div className="text-sm text-zinc-300 group-data-[selected]:text-zinc-100">
                      Enabled (Default)
                    </div>
                  </ListboxOption>
                  <ListboxOption
                    value={false}
                    className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-zinc-800 data-[selected]:bg-zinc-800 ease-out duration-75"
                  >
                    <CheckIcon className="invisible size-4 fill-zinc-100 group-data-[selected]:visible" />
                    <div className="text-sm text-zinc-300 group-data-[selected]:text-zinc-100">
                      Disabled
                    </div>
                  </ListboxOption>
                </ListboxOptions>
              </Listbox>
            </Field>
            <Field className="flex-1 w-full">
              <Label className="text-sm">Grain Effect:</Label>
              <Listbox
                value={bgSettings.grain}
                onChange={(value) => {
                  if (value === bgSettings.grain) {
                    setBgSettings({
                      ...bgSettings,
                      grain: !bgSettings.grain,
                    });
                  } else {
                    setBgSettings({
                      ...bgSettings,
                      grain: value,
                    });
                  }
                }}
              >
                <ListboxButton className="relative group flex items-center justify-between w-full rounded-lg bg-zinc-900/50 py-1.5 px-3 mt-1 text-left outline-none">
                  <span className="text-sm text-zinc-100 flex items-center gap-1.5">
                    {bgSettings.grain ? "Enabled" : "Disabled"}
                  </span>
                  <ChevronDownIcon
                    className="pointer-events-none size-4 fill-zinc-300 group-data-[open]:rotate-180 duration-75 ease-out"
                    aria-hidden="true"
                  />
                </ListboxButton>
                <ListboxOptions
                  anchor="bottom"
                  transition
                  className="w-fit min-w-48 z-50 rounded-xl bg-zinc-900/75 border border-zinc-800 p-1 my-1 space-y-0.5 outline-none transition duration-150 data-[closed]:opacity-0 data-[closed]:-translate-y-5 data-[closed]:scale-50"
                >
                  <ListboxOption
                    value={true}
                    className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-zinc-800 data-[selected]:bg-zinc-800 ease-out duration-75"
                  >
                    <CheckIcon className="invisible size-4 fill-zinc-100 group-data-[selected]:visible" />
                    <div className="text-sm text-zinc-300 group-data-[selected]:text-zinc-100">
                      Enabled (Default)
                    </div>
                  </ListboxOption>
                  <ListboxOption
                    value={false}
                    className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-zinc-800 data-[selected]:bg-zinc-800 ease-out duration-75"
                  >
                    <CheckIcon className="invisible size-4 fill-zinc-100 group-data-[selected]:visible" />
                    <div className="text-sm text-zinc-300 group-data-[selected]:text-zinc-100">
                      Disabled
                    </div>
                  </ListboxOption>
                </ListboxOptions>
              </Listbox>
            </Field>
          </div>
          <Field className="">
            <Label className="text-sm">Background Presents:</Label>
            <Listbox
              value={bgSettings.preset}
              onChange={(value) => {
                setBgSettings({
                  ...bgSettings,
                  preset: value,
                });
              }}
            >
              <ListboxButton className="relative group flex items-center justify-between w-full rounded-lg bg-zinc-900/50 py-1.5 px-3 mt-1 text-left outline-none">
                <span className="text-sm text-zinc-100 flex items-center gap-1.5">
                  {bgSettings.preset.charAt(0).toUpperCase() +
                    bgSettings.preset.slice(1)}
                </span>
                <ChevronDownIcon
                  className="pointer-events-none size-4 fill-zinc-300 group-data-[open]:rotate-180 duration-75 ease-out"
                  aria-hidden="true"
                />
              </ListboxButton>
              <ListboxOptions
                anchor="bottom"
                transition
                className="w-fit min-w-48 z-50 rounded-xl bg-zinc-900/75 border border-zinc-800 p-1 my-1 space-y-0.5 outline-none transition duration-150 data-[closed]:opacity-0 data-[closed]:-translate-y-5 data-[closed]:scale-50"
              >
                {Object.entries(presets).map(([key, item]) => (
                  <ListboxOption
                    key={key}
                    value={key}
                    className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-zinc-800 data-[selected]:bg-zinc-800 ease-out duration-75"
                  >
                    <CheckIcon className="invisible size-4 fill-zinc-100 group-data-[selected]:visible" />
                    <div className="text-sm text-zinc-300 group-data-[selected]:text-zinc-100">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </div>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
          </Field>
        </div>
      ),
    [bgSettings],
  );

  return isDesktop ? (
    <DesktopDialog
      isOpen={isOpenSettings}
      onClose={() => setIsOpenSettings(false)}
      title={title}
      description={description}
      content={content}
    />
  ) : (
    <MobileDrawer
      isOpen={isOpenSettings}
      onClose={() => setIsOpenSettings(false)}
      snapPoints={SNAP_POINTS}
      snap={snap}
      setSnap={setSnap}
      title={title}
      description={description}
      content={content}
    />
  );
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
            className={`p-6 flex-1 overflow-y-hidden ${
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

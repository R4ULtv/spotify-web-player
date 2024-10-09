"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={`relative flex w-full touch-none select-none items-center ${className}`}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-zinc-500/25 cursor-pointer">
      <SliderPrimitive.Range className="absolute h-full bg-zinc-200" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block size-2.5 rounded-full border-2 border-primary bg-zinc-200 transition-colors cursor-pointer outline-none disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

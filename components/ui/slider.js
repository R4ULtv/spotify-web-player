"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

const Slider = React.forwardRef(({ className, size, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={`relative flex w-full touch-none select-none items-center ${className}`}
    {...props}
  >
    <SliderPrimitive.Track
      className="relative w-full grow overflow-hidden rounded-full bg-zinc-500/25 cursor-pointer"
      style={{ height: size ? `${size}px` : "4px" }}
    >
      <SliderPrimitive.Range className="absolute h-full bg-zinc-200" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block rounded-full bg-zinc-200 cursor-pointer outline-none disabled:pointer-events-none disabled:opacity-50"
      style={{
        height: size ? `${size * 2.5}px` : "10px",
        width: size ? `${size * 2.5}px` : "10px",
      }}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

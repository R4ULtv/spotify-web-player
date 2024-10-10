"use client";

import { forwardRef } from "react";
import { Provider, Root, Trigger, Content } from "@radix-ui/react-tooltip";

const TooltipProvider = Provider;

const Tooltip = Root;

const TooltipTrigger = Trigger;

const TooltipContent = forwardRef((props, ref) => {
  const { className, sideOffset = 4, ...rest } = props;
  return (
    <Content
      ref={ref}
      sideOffset={sideOffset}
      className={
        "z-50 overflow-hidden rounded-xl border border-zinc-500/50 bg-zinc-900/75 px-3 py-1.5 text-sm m-1 text-zinc-200 shadow-md backdrop-blur-xl " +
        className
      }
      {...rest}
    />
  );
});
TooltipContent.displayName = Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

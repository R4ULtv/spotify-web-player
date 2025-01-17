"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export function TextShimmer({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
}) {
  const MotionComponent = motion.create(Component);
  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <MotionComponent
      className={`relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000] [--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box] ${className}`}
      initial={{ backgroundPosition: "100% center" }}
      animate={{ backgroundPosition: "0% center" }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "linear",
      }}
      style={{
        "--spread": `${dynamicSpread}px`,
        backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
      }}
    >
      {children}
    </MotionComponent>
  );
}
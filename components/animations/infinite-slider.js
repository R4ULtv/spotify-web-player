"use client";

import { useMotionValue, animate, motion } from "framer-motion";
import { useState, useEffect, useMemo, useCallback } from "react";
import useMeasure from "react-use-measure";

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  const size = direction === "horizontal" ? width : height;
  const contentSize = size + gap;
  const from = reverse ? -contentSize / 2 : 0;
  const to = reverse ? 0 : -contentSize / 2;

  const animate_control = useCallback(
    (translation, from, to, contentSize) => {
      if (isTransitioning) {
        return animate(translation, [translation.get(), to], {
          ease: "linear",
          duration:
            currentDuration * Math.abs((translation.get() - to) / contentSize),
          onComplete: () => {
            setIsTransitioning(false);
            setKey((key) => key + 1);
          },
        });
      }

      return animate(translation, [from, to], {
        ease: "linear",
        duration: currentDuration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    },
    [isTransitioning, currentDuration],
  );

  useEffect(() => {
    const controls = animate_control(translation, from, to, contentSize);
    return controls?.stop;
  }, [
    key,
    translation,
    currentDuration,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
    animate_control,
    from,
    to,
    contentSize,
  ]);

  const hoverProps = useMemo(
    () =>
      durationOnHover
        ? {
            onHoverStart: () => {
              setIsTransitioning(true);
              setCurrentDuration(durationOnHover);
            },
            onHoverEnd: () => {
              setIsTransitioning(true);
              setCurrentDuration(duration);
            },
          }
        : {},
    [durationOnHover, duration],
  );

  const style = useMemo(
    () => ({
      ...(direction === "horizontal" ? { x: translation } : { y: translation }),
      gap: `${gap}px`,
      flexDirection: direction === "horizontal" ? "row" : "column",
    }),
    [direction, translation, gap],
  );

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex w-max"
        style={style}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

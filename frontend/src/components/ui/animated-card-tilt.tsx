"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardTilt = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    tiltEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, tiltEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={tiltEffect ? { 
      y: -8,
      rotateX: 5,
      rotateY: 5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-0foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardTilt.displayName = "AnimatedCardTilt";

export { AnimatedCardTilt };
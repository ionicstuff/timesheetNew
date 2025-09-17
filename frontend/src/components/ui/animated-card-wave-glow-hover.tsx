"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardWaveGlowHover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    waveGlowHoverEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, waveGlowHoverEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={waveGlowHoverEffect ? { 
      y: -8,
      boxShadow: "0 0 120px rgba(59, 130, 246, 1), 0 115px 120px -100px rgba(0, 0, 0, 1), 0 105px 105px -95px rgba(0, 0, 0, 0.95)",
      scale: [1, 1.07, 1, 1.07, 1]
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardWaveGlowHover.displayName = "AnimatedCardWaveGlowHover";

export { AnimatedCardWaveGlowHover };
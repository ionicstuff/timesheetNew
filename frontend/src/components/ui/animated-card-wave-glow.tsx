"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardWaveGlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    waveGlowEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, waveGlowEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={waveGlowEffect ? { 
      y: -8,
      boxShadow: "0 0 55px rgba(59, 130, 246, 1), 0 50px 55px -35px rgba(0, 0, 0, 0.4), 0 40px 40px -30px rgba(0, 0, 0, 0.3)",
      scale: [1, 1.03, 1, 1.03, 1]
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardWaveGlow.displayName = "AnimatedCardWaveGlow";

export { AnimatedCardWaveGlow };
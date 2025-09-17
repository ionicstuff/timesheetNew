"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardFlipGlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    flipGlowEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, flipGlowEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={flipGlowEffect ? { 
      y: -8,
      boxShadow: "0 0 70px rgba(59, 130, 246, 1), 0 65px 70px -50px rgba(0, 0, 0, 0.55), 0 55px 55px -45px rgba(0, 0, 0, 0.45)",
      rotateY: [0, 10, 0]
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardFlipGlow.displayName = "AnimatedCardFlipGlow";

export { AnimatedCardFlipGlow };
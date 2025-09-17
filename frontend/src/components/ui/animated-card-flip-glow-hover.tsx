"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardFlipGlowHover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    flipGlowHoverEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, flipGlowHoverEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={flipGlowHoverEffect ? { 
      y: -8,
      boxShadow: "0 0 135px rgba(59, 130, 246, 1), 0 130px 135px -115px rgba(0, 0, 0, 1), 0 120px 120px -110px rgba(0, 0, 0, 0.95)",
      rotateY: [0, 20, 0]
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardFlipGlowHover.displayName = "AnimatedCardFlipGlowHover";

export { AnimatedCardFlipGlowHover };
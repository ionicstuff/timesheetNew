"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardPulseGlowHover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    pulseGlowHoverEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, pulseGlowHoverEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={pulseGlowHoverEffect ? { 
      y: -8,
      boxShadow: "0 0 90px rgba(59, 130, 246, 1), 0 85px 90px -70px rgba(0, 0, 0, 0.75), 0 75px 75px -65px rgba(0, 0, 0, 0.65)",
      scale: [1, 1.05, 1, 1.05, 1]
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardPulseGlowHover.displayName = "AnimatedCardPulseGlowHover";

export { AnimatedCardPulseGlowHover };
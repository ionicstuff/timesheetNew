"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardSwingGlowHover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    swingGlowHoverEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, swingGlowHoverEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={swingGlowHoverEffect ? { 
      y: -8,
      boxShadow: "0 0 130px rgba(59, 130, 246, 1), 0 125px 130px -110px rgba(0, 0, 0, 1), 0 115px 115px -105px rgba(0, 0, 0, 0.95)",
      rotate: [0, -15, 15, -15, 15, 0]
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardSwingGlowHover.displayName = "AnimatedCardSwingGlowHover";

export { AnimatedCardSwingGlowHover };
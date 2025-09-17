"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardSpinGlowHover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    spinGlowHoverEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, spinGlowHoverEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={spinGlowHoverEffect ? { 
      y: -8,
      boxShadow: "0 0 115px rgba(59, 130, 246, 1), 0 110px 115px -95px rgba(0, 0, 0, 1), 0 100px 100px -90px rgba(0, 0, 0, 0.9)",
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
AnimatedCardSpinGlowHover.displayName = "AnimatedCardSpinGlowHover";

export { AnimatedCardSpinGlowHover };
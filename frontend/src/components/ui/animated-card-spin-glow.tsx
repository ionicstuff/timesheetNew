"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardSpinGlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    spinGlowEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, spinGlowEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={spinGlowEffect ? { 
      y: -8,
      boxShadow: "0 0 50px rgba(59, 130, 246, 1), 0 45px 50px -30px rgba(0, 0, 0, 0.35), 0 35px 35px -25px rgba(0, 0, 0, 0.25)",
      rotate: [0, -5, 5, -5, 5, 0]
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardSpinGlow.displayName = "AnimatedCardSpinGlow";

export { AnimatedCardSpinGlow };
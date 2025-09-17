"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardRotateGlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    rotateGlowEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, rotateGlowEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={rotateGlowEffect ? { 
      y: -8,
      boxShadow: "0 0 85px rgba(59, 130, 246, 1), 0 80px 85px -65px rgba(0, 0, 0, 0.7), 0 70px 70px -60px rgba(0, 0, 0, 0.6)",
      rotate: [0, -10, 10, -10, 10, 0]
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardRotateGlow.displayName = "AnimatedCardRotateGlow";

export { AnimatedCardRotateGlow };
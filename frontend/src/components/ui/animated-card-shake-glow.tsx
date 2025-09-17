"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardShakeGlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    shakeGlowEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, shakeGlowEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={shakeGlowEffect ? { 
      y: -8,
      boxShadow: "0 0 45px rgba(59, 130, 246, 1), 0 40px 45px -25px rgba(0, 0, 0, 0.3), 0 30px 30px -20px rgba(0, 0, 0, 0.2)",
      x: [0, -3, 3, -3, 3, 0]
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardShakeGlow.displayName = "AnimatedCardShakeGlow";

export { AnimatedCardShakeGlow };
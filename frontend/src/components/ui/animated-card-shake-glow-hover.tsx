"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardShakeGlowHover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    shakeGlowHoverEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, shakeGlowHoverEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={shakeGlowHoverEffect ? { 
      y: -8,
      boxShadow: "0 0 110px rgba(59, 130, 246, 1), 0 105px 110px -90px rgba(0, 0, 0, 0.95), 0 95px 95px -85px rgba(0, 0, 0, 0.85)",
      x: [0, -5, 5, -5, 5, 0]
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardShakeGlowHover.displayName = "AnimatedCardShakeGlowHover";

export { AnimatedCardShakeGlowHover };
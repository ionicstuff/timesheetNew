"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardSlideGlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    slideGlowEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, slideGlowEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={slideGlowEffect ? { 
      y: -10,
      boxShadow: "0 0 75px rgba(59, 130, 246, 1), 0 70px 75px -55px rgba(0, 0, 0, 0.6), 0 60px 60px -50px rgba(0, 0, 0, 0.5)",
      x: [0, 10, 0]
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardSlideGlow.displayName = "AnimatedCardSlideGlow";

export { AnimatedCardSlideGlow };
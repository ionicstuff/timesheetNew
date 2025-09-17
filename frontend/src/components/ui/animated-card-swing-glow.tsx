"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardSwingGlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    swingGlowEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, swingGlowEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={swingGlowEffect ? { 
      y: -8,
      boxShadow: "0 0 65px rgba(59, 130, 246, 1), 0 60px 65px -45px rgba(0, 0, 0, 0.5), 0 50px 50px -40px rgba(0, 0, 0, 0.4)",
      rotate: [0, -7, 7, -7, 7, 0]
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardSwingGlow.displayName = "AnimatedCardSwingGlow";

export { AnimatedCardSwingGlow };
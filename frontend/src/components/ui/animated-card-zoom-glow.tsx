"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardZoomGlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    zoomGlowEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, zoomGlowEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={zoomGlowEffect ? { 
      y: -8,
      boxShadow: "0 0 80px rgba(59, 130, 246, 1), 0 75px 80px -60px rgba(0, 0, 0, 0.65), 0 65px 65px -55px rgba(0, 0, 0, 0.55)",
      scale: 1.1
    } : whileHover}
    whileTap={whileTap || { scale: 0.95 }}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardZoomGlow.displayName = "AnimatedCardZoomGlow";

export { AnimatedCardZoomGlow };
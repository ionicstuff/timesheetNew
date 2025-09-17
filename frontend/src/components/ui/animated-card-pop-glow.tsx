"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardPopGlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    popGlowEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, popGlowEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={popGlowEffect ? { 
      y: -15,
      boxShadow: "0 0 60px rgba(59, 130, 246, 1), 0 55px 60px -40px rgba(0, 0, 0, 0.45), 0 45px 45px -35px rgba(0, 0, 0, 0.35)",
      scale: 1.07
    } : whileHover}
    whileTap={whileTap || { scale: 0.95 }}
    className={cn(
      "rounded-lg border bg-card text-card-0foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardPopGlow.displayName = "AnimatedCardPopGlow";

export { AnimatedCardPopGlow };
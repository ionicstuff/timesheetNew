"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardPopGlowHover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    popGlowHoverEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, popGlowHoverEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={popGlowHoverEffect ? { 
      y: -20,
      boxShadow: "0 0 125px rgba(59, 130, 246, 1), 0 120px 125px -105px rgba(0, 0, 0, 1), 0 110px 110px -100px rgba(0, 0, 0, 0.95)",
      scale: 1.15
    } : whileHover}
    whileTap={whileTap || { scale: 0.95 }}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardPopGlowHover.displayName = "AnimatedCardPopGlowHover";

export { AnimatedCardPopGlowHover };
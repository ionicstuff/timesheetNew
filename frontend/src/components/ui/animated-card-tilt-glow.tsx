"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardTiltGlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    tiltGlowEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, tiltGlowEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={tiltGlowEffect ? { 
      y: -8,
      rotateX: 5,
      rotateY: 5,
      boxShadow: "0 0 30px rgba(59, 130, 246, 0.9), 0 25px 30px -10px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.06)"
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardTiltGlow.displayName = "AnimatedCardTiltGlow";

export { AnimatedCardTiltGlow };
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardTiltGlowHover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    tiltGlowHoverEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, tiltGlowHoverEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={tiltGlowHoverEffect ? { 
      y: -8,
      rotateX: 10,
      rotateY: 10,
      boxShadow: "0 0 95px rgba(59, 130, 246, 1), 0 90px 95px -75px rgba(0, 0, 0, 0.8), 0 80px 80px -70px rgba(0, 0, 0, 0.7)"
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardTiltGlowHover.displayName = "AnimatedCardTiltGlowHover";

export { AnimatedCardTiltGlowHover };
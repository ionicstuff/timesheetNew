"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardBounceGlowHover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    bounceGlowHoverEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, bounceGlowHoverEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={bounceGlowHoverEffect ? { 
      y: -15,
      boxShadow: "0 0 100px rgba(59, 130, 246, 1), 0 95px 100px -80px rgba(0, 0, 0, 0.85), 0 85px 85px -75px rgba(0, 0, 0, 0.75)",
      scale: 1.1
    } : whileHover}
    whileTap={whileTap || { 
      y: -5,
      transition: { type: "spring", stiffness: 300 }
    }}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardBounceGlowHover.displayName = "AnimatedCardBounceGlowHover";

export { AnimatedCardBounceGlowHover };
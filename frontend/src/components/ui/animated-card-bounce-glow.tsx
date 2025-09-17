"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardBounceGlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    bounceGlowEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, bounceGlowEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={bounceGlowEffect ? { 
      y: -12,
      boxShadow: "0 0 35px rgba(59, 130, 246, 1), 0 30px 35px -15px rgba(0, 0, 0, 0.2), 0 20px 20px -10px rgba(0, 0, 0, 0.1)",
      scale: 1.05
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
AnimatedCardBounceGlow.displayName = "AnimatedCardBounceGlow";

export { AnimatedCardBounceGlow };
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardFloat = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    floatEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, floatEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={floatEffect ? { 
      y: -10,
      boxShadow: "0 25px 30px -10px rgba(0, 0, 0, 0.1), 0 15px 15px -5px rgba(0, 0, 0, 0.04)"
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardFloat.displayName = "AnimatedCardFloat";

export { AnimatedCardFloat };
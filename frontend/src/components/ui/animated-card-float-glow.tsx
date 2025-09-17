"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardFloatGlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    floatGlowEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, floatGlowEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={floatGlowEffect ? { 
      y: -15,
      boxShadow: "0 0 40px rgba(59, 130, 246, 1), 0 35px 40px -20px rgba(0, 0, 0, 0.25), 0 25px 25px -15px rgba(0, 0, 0, 0.15)"
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardFloatGlow.displayName = "AnimatedCardFloatGlow";

export { AnimatedCardFloatGlow };
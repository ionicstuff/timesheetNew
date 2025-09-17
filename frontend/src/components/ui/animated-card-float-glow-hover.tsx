"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedCardFloatGlowHover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    whileHover?: object;
    whileTap?: object;
    initial?: object;
    animate?: object;
    floatGlowHoverEffect?: boolean;
  }
>(({ className, whileHover, whileTap, initial, animate, floatGlowHoverEffect = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={initial || { opacity: 0, y: 20 }}
    animate={animate || { opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={floatGlowHoverEffect ? { 
      y: -20,
      boxShadow: "0 0 105px rgba(59, 130, 246, 1), 0 100px 105px -85px rgba(0, 0, 0, 0.9), 0 90px 90px -80px rgba(0, 0, 0, 0.8)"
    } : whileHover}
    whileTap={whileTap}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className
    )}
    {...props}
  />
));
AnimatedCardFloatGlowHover.displayName = "AnimatedCardFloatGlowHover";

export { AnimatedCardFloatGlowHover };
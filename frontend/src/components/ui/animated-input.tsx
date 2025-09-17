"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface AnimatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  whileFocus?: object;
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, type, whileFocus, ...props }, ref) => {
    return (
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
          whileFocus={whileFocus}
        />
        <motion.div
          className="absolute inset-0 rounded-md bg-primary/10 opacity-0 -z-10"
          initial={{ opacity: 0 }}
          whileFocus={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    );
  }
);
AnimatedInput.displayName = "AnimatedInput";

export { AnimatedInput };
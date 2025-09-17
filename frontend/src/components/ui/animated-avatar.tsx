"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AnimatedAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    whileHover?: object;
    whileTap?: object;
  }
>(({ className, whileHover, whileTap, ...props }, ref) => (
  <motion.div
    whileHover={whileHover || { scale: 1.1 }}
    whileTap={whileTap || { scale: 0.9 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="inline-block"
  >
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  </motion.div>
));
AnimatedAvatar.displayName = AvatarPrimitive.Root.displayName;

const AnimatedAvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AnimatedAvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AnimatedAvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AnimatedAvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { AnimatedAvatar, AnimatedAvatarImage, AnimatedAvatarFallback };
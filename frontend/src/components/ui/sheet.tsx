"use client";

import { ReactNode } from "react";
import { 
  Sheet as SheetPrimitive,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

const Sheet = ({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  children, 
  footer,
  side = "right"
}: SheetProps) => {
  return (
    <SheetPrimitive open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className="flex flex-col">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>{title}</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
          {description && (
            <SheetDescription>{description}</SheetDescription>
          )}
        </SheetHeader>
        <div className="flex-1 py-4">
          {children}
        </div>
        {footer && (
          <div className="flex justify-end gap-2">
            {footer}
          </div>
        )}
      </SheetContent>
    </SheetPrimitive>
  );
};

export default Sheet;
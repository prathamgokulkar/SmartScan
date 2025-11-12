"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Expandable Chat - floating bubble that expands into a chat window.
 */

export function ExpandableChat({
  size = "md",
  position = "bottom-right",
  icon,
  children,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  return (
    <div className="fixed z-50">
      {/* Floating button */}
      <div className={cn("fixed", positionClasses[position])}>
        <Button
          size={size === "lg" ? "icon" : "sm"}
          onClick={toggleChat}
          className="rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700"
        >
          {icon}
        </Button>
      </div>

      {/* Animated chat container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "fixed bg-background rounded-lg shadow-2xl border w-full sm:w-[400px] h-[600px] flex flex-col overflow-hidden",
              position === "bottom-right"
                ? "bottom-20 right-6"
                : "bottom-20 left-6"
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ExpandableChatHeader({ children, className }) {
  return (
    <div
      className={cn(
        "p-4 border-b bg-muted/30 flex items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ExpandableChatBody({ children, className }) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto p-4 space-y-3 bg-background",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ExpandableChatFooter({ children, className }) {
  return (
    <div
      className={cn("p-3 border-t bg-muted/30 flex flex-col", className)}
    >
      {children}
    </div>
  );
}

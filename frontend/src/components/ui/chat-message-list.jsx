"use client";
import React from "react";
import { cn } from "@/lib/utils";

/**
 * ChatMessageList - scrollable area that auto-scrolls to latest message.
 */
export function ChatMessageList({ children, className }) {
  // Logic removed to allow parent to control scrolling behavior
  // and efficiently support smooth scrolling.

  return (
    <div
      className={cn(
        "flex flex-col space-y-3 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-muted/50 p-2",
        className
      )}
    >
      {children}
    </div>
  );
}

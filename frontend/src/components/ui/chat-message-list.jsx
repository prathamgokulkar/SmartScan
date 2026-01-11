"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * ChatMessageList - scrollable area that auto-scrolls to latest message.
 */
export function ChatMessageList({ children, className }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [children]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex flex-col space-y-3 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-muted/50 p-2",
        className
      )}
    >
      {children}
    </div>
  );
}

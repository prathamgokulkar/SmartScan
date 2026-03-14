"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// 🗨️ Chat Input Component
export const ChatInput = React.forwardRef(
  ({ className, value, onChange, placeholder, ...props }, ref) => {
    // Merge external ref with internal one for auto-resize
    const innerRef = useRef(null);
    const setRefs = React.useCallback(
      (node) => {
        innerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    // Auto-resize logic
    useEffect(() => {
      const textarea = innerRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        // Calculate new height based on scrollHeight, capped at max-h-40 (160px)
        const newHeight = Math.min(textarea.scrollHeight, 160);
        textarea.style.height = `${newHeight}px`;
      }
    }, [value]);

    return (
      <textarea
        ref={setRefs}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={1}
        className={cn(
          "w-full resize-none scrollbar-thin overflow-y-auto bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0",
          className
        )}
        {...props}
      />
    );
  }
);

ChatInput.displayName = "ChatInput";

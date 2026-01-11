"use client";
import React from "react";
import { cn } from "@/lib/utils";

// 🗨️ Chat Input Component
export const ChatInput = React.forwardRef(
  ({ className, value, onChange, placeholder, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={1}
        className={cn(
          "w-full resize-none bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0",
          className
        )}
        {...props}
      />
    );
  }
);

ChatInput.displayName = "ChatInput";

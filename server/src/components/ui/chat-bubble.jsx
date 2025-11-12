"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 🔹 Chat bubble container
export function ChatBubble({ variant = "received", className, children }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 mb-4",
        variant === "sent" && "flex-row-reverse",
        className
      )}
    >
      {children}
    </div>
  );
}

// 🔹 Chat bubble message box
export function ChatBubbleMessage({ variant = "received", isLoading, children }) {
  return (
    <div
      className={cn(
        "rounded-lg p-3",
        variant === "sent" ? "bg-primary text-primary-foreground" : "bg-muted"
      )}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-150" />
          <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-300" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

// 🔹 Avatar for sender/receiver
export function ChatBubbleAvatar({ src, fallback = "AI", className }) {
  return (
    <Avatar className={cn("h-8 w-8", className)}>
      {src && <AvatarImage src={src} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}

// 🔹 Optional: Small action buttons (if needed later)
export function ChatBubbleAction({ icon, onClick, className }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-6 w-6", className)}
      onClick={onClick}
    >
      {icon}
    </Button>
  );
}

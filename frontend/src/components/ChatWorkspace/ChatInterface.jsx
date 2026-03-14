"use client";
import React, { useState, FormEvent } from "react";
import { Paperclip, Mic, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatInput } from "@/components/ui/chat-input";
import { ChatMessageList } from "@/components/ui/chat-message-list";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef } from "react";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hey there! 👋 Upload a file or ask me anything.",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), content: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: input.trim(),
          chat_history: messages.map(m => ({ role: m.sender, content: m.content }))
        }),
      });

      if (!response.body) throw new Error("ReadableStream not supported by browser.");

      // Create a placeholder AI message that we will mutate
      const aiMessageId = Date.now() + 1;
      setMessages((prev) => [
        ...prev,
        { id: aiMessageId, content: "", sender: "ai", sources: [] }
      ]);
      
      // We are streaming, so stop showing the loading bubble immediately
      setIsLoading(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let partialLine = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the incoming byte chunk and split into SSE lines
        const chunkStr = typeof value === "string" ? value : decoder.decode(value, { stream: true });
        const lines = (partialLine + chunkStr).split("\n");
        // The last line might be incomplete, save it for the next chunk
        partialLine = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.substring(6).trim();
            if (!dataStr) continue;
            
            try {
              const data = JSON.parse(dataStr);
              
              setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.id === aiMessageId) {
                      if (data.chunk) {
                        return { ...msg, content: msg.content + data.chunk };
                      }
                      if (data.done) {
                        return { ...msg, sources: data.sources || [] };
                      }
                      if (data.error) {
                         return { ...msg, content: msg.content + `\n\n⚠️ Error: ${data.error}` };
                      }
                    }
                    return msg;
                  })
              );
            } catch (err) {
               console.error("Error parsing stream chunk", err, dataStr);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: Date.now() + 2,
        content: "⚠️ Error connecting to server.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    } 
  };

  const handleAttachFile = () => {
    alert("📁 File attachment coming soon!");
  };

  const handleMicrophoneClick = () => {
    alert("🎙️ Voice input coming soon!");
  };

  return (
    <div className="flex flex-col h-[600px] border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gray-50/50 flex flex-col items-center justify-center">
        <h2 className="text-foreground text-lg font-semibold">
          Chat with AI ✨
        </h2>
        <p className="text-muted-foreground text-sm">
          Upload a file or ask a question!
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 min-h-0 bg-background">
        <ChatMessageList className="h-full p-4">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src={
                  message.sender === "user"
                    ? "/User.jpeg"
                    : "/robot.jpeg"
                }
                fallback={message.sender === "user" ? "U" : "AI"}
              />
              <ChatBubbleMessage
                variant={message.sender === "user" ? "sent" : "received"}
                className={message.sender === "ai" ? "w-full max-w-full min-w-0" : ""}
              >
                {message.sender === "ai" ? (
                  <div className="prose prose-sm max-w-none break-words text-sm">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-2 rounded-md border border-gray-200">
                            <table className="w-full border-collapse text-left text-sm" {...props} />
                          </div>
                        ),
                        thead: ({ node, ...props }) => (
                          <thead className="bg-gray-100 text-gray-900 border-b border-gray-200" {...props} />
                        ),
                        th: ({ node, ...props }) => (
                          <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap" {...props} />
                        ),
                        td: ({ node, ...props }) => (
                          <td className="px-4 py-3 border-b border-gray-100 last:border-0" {...props} />
                        ),
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="" {...props} />,
                        a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                        code: ({ node, inline, className, children, ...props }) => (
                           inline ? 
                            <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-red-500" {...props}>{children}</code> :
                            <code className="block bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono overflow-x-auto my-2" {...props}>{children}</code>
                        ),
                      }}
                    >
                       {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  message.content
                )}
                
                {/* 🔹 Render Source Citations if they exist */}
                {message.sender === "ai" && message.sources && message.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Sources Referenced:</p>
                    <div className="flex flex-wrap gap-2">
                       {message.sources.map((source, idx) => (
                           <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                               📄 {source}
                           </span>
                       ))}
                    </div>
                  </div>
                )}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src="/robot.jpeg"
                fallback="AI"
              />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
          <div ref={messagesEndRef} />
        </ChatMessageList>
      </div>

      {/* Chat Input */}
      <div className="p-3 border-t bg-gray-50/50">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
        >
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0 justify-between">
            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={handleAttachFile}
              >
                <Paperclip className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={handleMicrophoneClick}
              >
                <Mic className="size-4" />
              </Button>
            </div>
            <Button type="submit" size="sm" className="ml-auto gap-1.5">
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

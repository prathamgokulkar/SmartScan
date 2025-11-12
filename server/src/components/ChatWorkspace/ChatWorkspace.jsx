import React from "react";
import FileUploader from "./FileUploader";
import ChatInterface from "./ChatInterface";

export default function ChatWorkspace() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen p-6 gap-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-950">
      <div className="border rounded-xl p-6 bg-background shadow-sm">
        <h2 className="text-lg font-semibold mb-4">📂 Upload Files</h2>
        <FileUploader />
      </div>
      <div className="border rounded-xl p-6 bg-background shadow-sm relative">
        <h2 className="text-lg font-semibold mb-4">💬 Chat Interface</h2>
        <ChatInterface />
      </div>
    </div>
  );
}

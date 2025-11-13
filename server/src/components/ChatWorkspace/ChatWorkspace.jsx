import React from "react";
import FileUploader from "./FileUploader";
import ChatInterface from "./ChatInterface";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Upload, MessageSquare } from "lucide-react";

export default function ChatWorkspace() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-32 px-6">
      <div className="mx-auto max-w-7xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div variant="soft" className="shadow-0">
            <div className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-gray-600" />
                </div>
                <CardTitle className="text-foreground text-xl font-semibold">
                  Upload Files
                </CardTitle>
              </div>
            </div>
            <div>
              <FileUploader />
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-foreground text-xl font-semibold">
                Chat Interface
              </h2>
            </div>
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}

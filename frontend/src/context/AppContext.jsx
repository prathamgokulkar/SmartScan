import { createContext, useState, useCallback, useRef, useEffect } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isIndexed, setIsIndexed] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const chatMessagesRef = useRef(null);

  // Scroll to bottom
  useEffect(() => {
    if (chatMessagesRef.current)
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  }, [messages, isChatLoading]);

  // ---- FILE UPLOAD HANDLERS ----
  const handleFileUpload = useCallback(async (file) => {
    if (!file || file.type !== "application/pdf") {
      setError("Please select a valid PDF file");
      return;
    }
    setError("");
    setIsLoading(true);
    setPdfFile(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/api/process-invoice", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to parse PDF");
      }

      const data = await response.json();
      if (data.success) {
        setIsIndexed(true);
        console.log("✅ Document indexed successfully.");
      }
    } catch (err) {
      setError("Error parsing PDF: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setPdfFile(null);
    setError("");
    setMessages([]);
    setShowChat(false);
    setIsIndexed(false);
  }, []);

  // ---- CHAT HANDLERS ----
  const handleChatSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!currentQuestion.trim() || !isIndexed || isChatLoading) return;

    const question = currentQuestion.trim();
    setCurrentQuestion("");
    setIsChatLoading(true);

    const userMessage = { type: "user", content: question, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get answer");
      }

      const data = await response.json();
      const aiMessage = {
        type: "ai",
        content: data.answer,
        timestamp: new Date(),
        metadata: {
          chunksUsed: data.chunksUsed,
          contextLength: data.contextLength,
        },
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        type: "error",
        content: "Error: " + err.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  }, [currentQuestion, isIndexed, isChatLoading]);

  const startChat = useCallback(() => {
    if (isIndexed) {
      setShowChat(true);
      setMessages([
        {
          type: "ai",
          content:
            "Hello! I can help you understand this PDF document. What would you like to know?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isIndexed]);

  return (
    <AppContext.Provider
      value={{
        pdfFile,
        isLoading,
        isIndexed,
        error,
        messages,
        currentQuestion,
        isChatLoading,
        showChat,
        chatMessagesRef,
        handleFileUpload,
        handleChatSubmit,
        clearData,
        startChat,
        setCurrentQuestion,
        setShowChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

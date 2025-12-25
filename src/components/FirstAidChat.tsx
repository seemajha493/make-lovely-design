import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/first-aid-chat`;

export function FirstAidChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Add empty assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage?.role === "assistant") {
                  lastMessage.content = assistantContent;
                }
                return newMessages;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send message");
      // Remove the empty assistant message if error occurred
      if (!assistantContent) {
        setMessages((prev) => prev.filter((m) => m.content !== ""));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const placeholderText = i18n.language === "hi" 
    ? "अपना प्रश्न पूछें... जैसे 'जलने का इलाज कैसे करें?'"
    : "Ask your question... e.g., 'How to treat a burn?'";

  const welcomeMessage = i18n.language === "hi"
    ? "नमस्ते! मैं आपका AI प्राथमिक चिकित्सा सहायक हूं। मुझे बताएं कि आपको किस आपातकालीन स्थिति में मदद चाहिए।"
    : "Hello! I'm your AI First Aid Assistant. Tell me what emergency situation you need help with.";

  return (
    <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-primary/5 border-b border-border flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {i18n.language === "hi" ? "AI प्राथमिक चिकित्सा सहायक" : "AI First Aid Assistant"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {i18n.language === "hi" ? "तत्काल मार्गदर्शन प्राप्त करें" : "Get instant guidance"}
          </p>
        </div>
      </div>

      {/* Warning */}
      <div className="px-4 py-2 bg-warning/10 border-b border-warning/20 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
        <p className="text-xs text-muted-foreground">
          {i18n.language === "hi" 
            ? "गंभीर आपात स्थिति में तुरंत 108 पर कॉल करें" 
            : "For serious emergencies, call 108 immediately"}
        </p>
      </div>

      {/* Messages */}
      <div className="h-[300px] overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex gap-3">
            <div className="p-2 rounded-full bg-primary/10 h-fit">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 p-3 rounded-xl bg-muted/50 text-sm text-muted-foreground">
              {welcomeMessage}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`p-2 rounded-full h-fit ${
                message.role === "user" ? "bg-primary" : "bg-primary/10"
              }`}
            >
              {message.role === "user" ? (
                <User className="h-4 w-4 text-primary-foreground" />
              ) : (
                <Bot className="h-4 w-4 text-primary" />
              )}
            </div>
            <div
              className={`flex-1 p-3 rounded-xl text-sm whitespace-pre-wrap ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-foreground"
              }`}
            >
              {message.content || (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            disabled={isLoading}
            className="flex-1 h-10 px-4 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-10 w-10"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

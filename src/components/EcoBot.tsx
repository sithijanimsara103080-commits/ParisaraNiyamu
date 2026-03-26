import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Leaf, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Message = { role: "user" | "assistant"; content: string };

const quickActions = [
  "🌱 Join the Unit",
  "📅 Upcoming Events",
  "♻️ Eco Tips",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/eco-chat`;

export default function EcoBot() {
  const [open, setOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lang, setLang] = useState<"en" | "si">("en");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ayubowan! 🌿 I am Niyamu Bot, your official AI assistant for the Radapasa Environmental Pioneers Society. Developed by Sithija Nimsara. How can I help you today?" },
  ]);

  useEffect(() => {
    const handleLangChange = (e: any) => {
      setLang(e.detail);
      setMessages(prev => [
        {
          role: "assistant",
          content: e.detail === "en"
            ? "Ayubowan! 🌿 I am Niyamu Bot, your official AI assistant for the Radapasa Environmental Pioneers Society. Developed by Sithija Nimsara. How can I help you today?"
            : "ආයුබෝවන්! 🌿 මම රාදපාස පාරිසරික නියමුවෝ සංගමයේ නිල AI සහායකයා වන නියමුවෝ බොට්. සිතිජ නිම්සාර විසින් නිර්මාණය කරන ලදී. අද මම ඔබට කෙසේ උදව් කරන්නද?"
        },
        ...prev.slice(1)
      ]);
    };
    window.addEventListener("langChange", handleLangChange);
    return () => window.removeEventListener("langChange", handleLangChange);
  }, []);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, isFullscreen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setLoading(true);

    let assistantContent = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || "";
              if (content) {
                assistantText += content;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage.role === "assistant" && prev.length > allMessages.length) {
                    newMessages[newMessages.length - 1] = { ...lastMessage, content: assistantText };
                    return newMessages;
                  } else {
                    return [...newMessages, { role: "assistant", content: assistantText }];
                  }
                });
              }
            } catch (e) {
              console.warn("Error parsing SSE chunk", e);
            }
          }
        }
      }
    } catch (e) {
      console.error("EcoBot error:", e);
      // Fallback for common questions if AI fails
      const lowText = text.toLowerCase();
      let reply = lang === "en"
        ? "I'm having trouble connecting to my brain! 🌿 But I can tell you that the Radapasa Environmental Pioneers Society meets every Friday."
        : "මගේ පද්ධතිය සමඟ සම්බන්ධ වීමේ ගැටලුවක් පවතී! 🌿 නමුත් රාදපාස පාරිසරික නියමුවෝ සංගමය සෑම සිකුරාදා දිනකම රැස්වන බව මට පැවසිය හැකිය.";

      if (lowText.includes("join")) reply = lang === "en" ? "To join us, visit our next meeting on Friday at the Science Block!" : "අප හා එක්වීමට, සිකුරාදා විද්‍යා අංශයේ පැවැත්වෙන අපගේ මීළඟ රැස්වීමට පැමිණෙන්න!";
      if (lowText.includes("event") || lowText.includes("සිදුවීම්")) reply = lang === "en" ? "Check our Events section! We have a Beach Cleanup coming up on Jun 8." : "අපගේ සිදුවීම් අංශය පරීක්ෂා කරන්න! ජුනි 8 වන දින අපගේ වෙරළ පිරිසිදු කිරීමේ ව්‍යාපෘතියක් ඇත.";

      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      toast.error("Connecting with fallback mode...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [open, isFullscreen]);

  return (
    <>
      <motion.button
        onClick={() => { setOpen(!open); setIsFullscreen(false); }}
        className="fixed bottom-6 right-6 z-[160] w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg animate-pulse-glow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              width: isFullscreen ? "100%" : "380px",
              height: isFullscreen ? "100%" : "520px",
              bottom: isFullscreen ? "0px" : "96px",
              right: isFullscreen ? "0px" : "24px",
              borderRadius: isFullscreen ? "0px" : "1rem",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed z-[150] glass-card flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ease-in-out"
          >
            {/* Header */}
            <div className="p-4 border-b border-glass-border/20 flex items-center justify-between bg-primary/20 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/30 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-semibold text-sm">Niyamu Bot 🌿</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-tight font-medium">By Sithija Nimsara</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                  title="Toggle Fullscreen"
                >
                  <motion.div animate={{ rotate: isFullscreen ? 180 : 0 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-up-right"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
                  </motion.div>
                </button>
                <button onClick={() => { setOpen(false); setIsFullscreen(false); }} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Credit Info Strip */}
            <div className="px-4 py-1.5 bg-accent/30 border-b border-glass-border/10">
              <p className="text-[9px] text-foreground/70 font-display italic tracking-wide">
                Developed for Radapasa Environmental Pioneers Society
              </p>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm shadow-md"
                      : "bg-muted text-foreground rounded-bl-sm border border-glass-border/10"
                      }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && !messages.find((_, i) => i === messages.length - 1 && messages[messages.length - 1]?.role === "assistant" && messages.length > 1) && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground rounded-xl rounded-bl-sm px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {(lang === "en" ? ["🌱 Join the Society", "📅 Upcoming Events", "♻️ Eco Tips"] : ["🌱 අප හා එක්වන්න", "📅 මීළඟ සිදුවීම්", "♻️ පරිසර උපදෙස්"]).map((label) => (
                <button
                  key={label}
                  onClick={() => sendMessage(label)}
                  disabled={loading}
                  className="text-[11px] px-3 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-50 border border-transparent hover:border-primary/30"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-glass-border/10 flex gap-3 bg-muted/20">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                className="flex-1 bg-background/50 border border-glass-border/30 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder={lang === "en" ? "Ask me anything..." : "පණිවිඩය ඇතුළත් කරන්න..."}
                maxLength={500}
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading}
                className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

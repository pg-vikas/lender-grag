import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Sparkles, ChevronUp, ArrowRight } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "What are today's mortgage rates?",
  "How much house can I afford?",
  "What credit score do I need?",
  "How does pre-approval work?",
  "What's the difference between fixed and adjustable?",
  "How much should my down payment be?",
];

const G1 = "#d4a94c";
const G2 = "#f0d88a";

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pendingTimers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    return () => {
      pendingTimers.current.forEach(clearTimeout);
      pendingTimers.current.clear();
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const t = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (inputValue.length > 0 && !isExpanded) {
      setIsExpanded(true);
    }
  }, [inputValue, isExpanded]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        if (messages.length === 0 && !inputValue) {
          setIsOpen(false);
          setIsExpanded(false);
        }
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, messages.length, inputValue]);

  const handleSubmit = useCallback(
    (text?: string) => {
      const msg = text || inputValue.trim();
      if (!msg) return;
      setMessages((prev) => [...prev, { role: "user", text: msg }]);
      setInputValue("");
      setIsExpanded(true);
      setIsTyping(true);
      setShowPulse(false);

      const timer = setTimeout(() => {
        pendingTimers.current.delete(timer);
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Great question! Greg will get back to you personally. For the fastest response, call Greg directly at (619) 550-9885 or click the phone on the desk above!",
          },
        ]);
      }, 1500 + Math.random() * 1000);
      pendingTimers.current.add(timer);
    },
    [inputValue],
  );

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsExpanded(false);
    } else {
      setIsOpen(true);
      setShowPulse(false);
    }
  };

  const charCount = inputValue.length;
  const glowIntensity = Math.min(charCount / 40, 1);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" ref={panelRef}>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-[380px] max-w-[calc(100vw-48px)] overflow-hidden"
            style={{
              borderRadius: "24px",
              background: "rgba(12, 12, 12, 0.85)",
              backdropFilter: "blur(24px) saturate(1.6)",
              WebkitBackdropFilter: "blur(24px) saturate(1.6)",
              border: "1px solid rgba(212, 169, 76, 0.15)",
              boxShadow: `
                0 0 ${20 + glowIntensity * 30}px rgba(212, 169, 76, ${0.08 + glowIntensity * 0.12}),
                0 8px 32px rgba(0, 0, 0, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.06)
              `,
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                background: "linear-gradient(135deg, rgba(212, 169, 76, 0.06) 0%, transparent 100%)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${G1}, ${G2})`,
                  }}
                >
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <div>
                  <p className="text-white text-[13px] font-semibold tracking-tight leading-tight">
                    Ask Lender Greg
                  </p>
                  <p className="text-white/40 text-[11px] leading-tight">Mortgage guidance, simplified</p>
                </div>
              </div>
              <button
                onClick={handleToggle}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
                data-testid="button-close-assistant"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="overflow-hidden"
                >
                  <div className="max-h-[320px] overflow-y-auto px-5 py-4 space-y-3 scrollbar-thin">
                    {messages.length === 0 && !isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-4"
                      >
                        <div
                          className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                          style={{
                            background: "rgba(212, 169, 76, 0.1)",
                            border: "1px solid rgba(212, 169, 76, 0.15)",
                          }}
                        >
                          <MessageCircle className="w-5 h-5" style={{ color: G1 }} />
                        </div>
                        <p className="text-white/60 text-[13px]">
                          Ask anything about mortgages, rates, or the home buying process.
                        </p>
                      </motion.div>
                    )}

                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] px-4 py-2.5 text-[13px] leading-relaxed ${
                            msg.role === "user"
                              ? "rounded-[18px_18px_4px_18px] text-black font-medium"
                              : "rounded-[18px_18px_18px_4px] text-white/90"
                          }`}
                          style={
                            msg.role === "user"
                              ? {
                                  background: `linear-gradient(135deg, ${G1}, ${G2})`,
                                }
                              : {
                                  background: "rgba(255, 255, 255, 0.06)",
                                  border: "1px solid rgba(255, 255, 255, 0.08)",
                                }
                          }
                          data-testid={`text-message-${msg.role}-${i}`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div
                          className="px-4 py-3 rounded-[18px_18px_18px_4px] flex items-center gap-1.5"
                          style={{
                            background: "rgba(255, 255, 255, 0.06)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                          }}
                        >
                          {[0, 1, 2].map((d) => (
                            <motion.div
                              key={d}
                              className="w-2 h-2 rounded-full"
                              style={{ background: G1 }}
                              animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
                              transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: d * 0.2,
                                ease: "easeInOut",
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {(isExpanded || messages.length === 0) && !inputValue && messages.length === 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-2 pt-1">
                    <p className="text-white/30 text-[10px] font-semibold uppercase tracking-[0.15em] mb-2 px-1">
                      Suggested
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_QUESTIONS.map((q, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * i, duration: 0.2 }}
                          onClick={() => handleSubmit(q)}
                          className="px-3 py-1.5 rounded-full text-[11px] text-white/60 hover:text-white transition-all cursor-pointer"
                          style={{
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                          }}
                          whileHover={{
                            background: "rgba(212, 169, 76, 0.1)",
                            borderColor: "rgba(212, 169, 76, 0.25)",
                          }}
                          data-testid={`button-suggestion-${i}`}
                        >
                          {q}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className="px-4 py-3"
              style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div
                className="flex items-center gap-2 rounded-2xl px-4 py-2.5 transition-all duration-300"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: `1px solid rgba(212, 169, 76, ${0.1 + glowIntensity * 0.25})`,
                  boxShadow:
                    glowIntensity > 0
                      ? `0 0 ${8 + glowIntensity * 16}px rgba(212, 169, 76, ${glowIntensity * 0.15}), inset 0 0 ${4 + glowIntensity * 8}px rgba(212, 169, 76, ${glowIntensity * 0.05})`
                      : "none",
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  onFocus={() => {
                    if (!isExpanded) setIsExpanded(true);
                  }}
                  placeholder="Ask about mortgages, rates, pre-approval..."
                  className="flex-1 bg-transparent text-white text-[13px] placeholder:text-white/30 outline-none"
                  data-testid="input-assistant-message"
                  aria-label="Type your mortgage question"
                />

                <AnimatePresence mode="wait">
                  {inputValue.trim() ? (
                    <motion.button
                      key="send"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      onClick={() => handleSubmit()}
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${G1}, ${G2})`,
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      data-testid="button-send-message"
                      aria-label="Send message"
                    >
                      <ArrowRight className="w-4 h-4 text-black" />
                    </motion.button>
                  ) : (
                    <motion.div
                      key="mic"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.3 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <ChevronUp className="w-4 h-4 text-white/40" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {charCount > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between px-2 pt-1.5"
                >
                  <div className="h-[2px] flex-1 rounded-full overflow-hidden bg-white/5">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${G1}, ${G2})`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((charCount / 200) * 100, 100)}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </div>
                  <span className="text-[10px] text-white/20 ml-2 tabular-nums">{charCount}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleToggle}
        className="relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
        style={{
          background: isOpen
            ? "rgba(255, 255, 255, 0.1)"
            : `linear-gradient(135deg, ${G1}, ${G2})`,
          boxShadow: isOpen
            ? "0 4px 20px rgba(0, 0, 0, 0.3)"
            : `0 4px 24px rgba(212, 169, 76, 0.35), 0 0 48px rgba(212, 169, 76, 0.15)`,
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        data-testid="button-toggle-assistant"
        aria-label={isOpen ? "Close assistant" : "Open mortgage assistant"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5 text-white/70" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6 text-black" />
            </motion.div>
          )}
        </AnimatePresence>

        {showPulse && !isOpen && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${G1}` }}
              animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${G1}` }}
              animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            />
          </>
        )}
      </motion.button>
    </div>
  );
}

import { BookOpen, CheckSquare, Home, FileText, AlertTriangle, MessageCircle, X, Send, GripVertical, Pencil, Check, Phone, User, Signal, Wifi, BatteryFull } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import deskImg from "@/assets/images/desk-workspace.jpg";
import gregHeadshot from "@/assets/images/greg-headshot.jpg";

interface StickyNote {
  id: number;
  icon: typeof BookOpen;
  title: string;
  desc: string;
  color: string;
  bg: string;
  bgDark: string;
  rotate: number;
  curlCorner: "br" | "bl" | "tr";
  curlIntensity: number;
}

const initialNotes: StickyNote[] = [
  { id: 0, icon: BookOpen, title: "First-Time Buyer Guide", desc: "Everything you need to know before buying your first home — from credit to closing.", color: "#5a4800", bg: "#FFD966", bgDark: "#F5C842", rotate: -2.8, curlCorner: "br", curlIntensity: 0.7 },
  { id: 1, icon: CheckSquare, title: "Pre-Approval Checklist", desc: "The documents and steps needed to get pre-approved fast and stress-free.", color: "#1a5c3a", bg: "#77DD77", bgDark: "#5EC85E", rotate: 2.2, curlCorner: "bl", curlIntensity: 0.5 },
  { id: 2, icon: Home, title: "How Much House Can I Afford?", desc: "Understand your real budget based on what lenders actually look for.", color: "#2a4a7a", bg: "#7EC8E3", bgDark: "#5BB5D5", rotate: -1.4, curlCorner: "br", curlIntensity: 0.6 },
  { id: 3, icon: FileText, title: "Documents You'll Need", desc: "A complete list of what to prepare before starting your mortgage application.", color: "#7a2a55", bg: "#FF9FCE", bgDark: "#F08ABC", rotate: 3.0, curlCorner: "tr", curlIntensity: 0.55 },
  { id: 4, icon: AlertTriangle, title: "Mortgage Mistakes to Avoid", desc: "Five common pitfalls that cost borrowers time, money, and deals.", color: "#8a4400", bg: "#FFB347", bgDark: "#F09A30", rotate: -1.8, curlCorner: "bl", curlIntensity: 0.65 },
];

const PAPER_NOISE_ID = "paperNoise";
const LIGHT_ANGLE = 135;
const LIGHT_RAD = (LIGHT_ANGLE * Math.PI) / 180;
const SHADOW_DX = Math.cos(LIGHT_RAD) * 4;
const SHADOW_DY = Math.sin(LIGHT_RAD) * 4;

function PaperTextureDefs() {
  return (
    <svg className="absolute w-0 h-0" aria-hidden="true">
      <defs>
        <filter id={PAPER_NOISE_ID} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="3" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="textured" />
          <feComponentTransfer in="textured">
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}

function StickyNoteCard({ note, onEdit, onAskGreg, constraintsRef, mouseX, mouseY, boardBounds, isExpanded, onExpand, onCollapse }: {
  note: StickyNote;
  onEdit: (id: number, title: string, desc: string) => void;
  onAskGreg: (topic: string) => void;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  mouseX: any;
  mouseY: any;
  boardBounds: { width: number; height: number };
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLifted, setIsLifted] = useState(false);
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
    if (!isExpanded) { setQuestion(""); setSubmitted(false); setName(""); setEmail(""); setPhone(""); }
  }, [isExpanded]);

  const pFactor = 1.2 + note.id * 0.4;
  const parallaxX = useTransform(mouseX, [0, boardBounds.width || 1], [-pFactor, pFactor]) as any;
  const parallaxY = useTransform(mouseY, [0, boardBounds.height || 1], [-pFactor * 0.6, pFactor * 0.6]) as any;
  const smoothX = useSpring(parallaxX, { stiffness: 40, damping: 18 });
  const smoothY = useSpring(parallaxY, { stiffness: 40, damping: 18 });

  const curlStyle = useMemo(() => {
    const i = note.curlIntensity;
    const size = 14 + i * 8;
    const base: Record<string, string> = { position: "absolute" as const, width: `${size}px`, height: `${size}px`, pointerEvents: "none" as const, zIndex: "2" };
    switch (note.curlCorner) {
      case "br": return { ...base, bottom: "0", right: "0", background: `linear-gradient(315deg, rgba(60,40,20,${0.12 * i}) 0%, rgba(60,40,20,${0.04 * i}) 40%, transparent 70%)`, borderRadius: `${size}px 0 0 0` };
      case "bl": return { ...base, bottom: "0", left: "0", background: `linear-gradient(45deg, rgba(60,40,20,${0.12 * i}) 0%, rgba(60,40,20,${0.04 * i}) 40%, transparent 70%)`, borderRadius: `0 ${size}px 0 0` };
      case "tr": return { ...base, top: "0", right: "0", background: `linear-gradient(225deg, rgba(60,40,20,${0.1 * i}) 0%, rgba(60,40,20,${0.03 * i}) 40%, transparent 70%)`, borderRadius: `0 0 0 ${size}px` };
      default: return base;
    }
  }, [note.curlCorner, note.curlIntensity]);

  const shadowStyle = useMemo(() => {
    if (isExpanded) return `${SHADOW_DX * 8}px ${SHADOW_DY * 8}px 60px rgba(0,0,0,0.6), ${SHADOW_DX * 3}px ${SHADOW_DY * 3}px 20px rgba(0,0,0,0.4), 0 0 100px rgba(0,0,0,0.15)`;
    if (isDragging) return `${SHADOW_DX * 6}px ${SHADOW_DY * 6}px 50px rgba(0,0,0,0.55), ${SHADOW_DX * 2}px ${SHADOW_DY * 2}px 15px rgba(0,0,0,0.35), 0 0 80px rgba(0,0,0,0.12)`;
    if (isLifted) return `${SHADOW_DX * 4}px ${SHADOW_DY * 4}px 35px rgba(0,0,0,0.5), ${SHADOW_DX * 1.5}px ${SHADOW_DY * 1.5}px 10px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)`;
    return `${SHADOW_DX * 1.5}px ${SHADOW_DY * 1.5}px 16px rgba(0,0,0,0.4), ${SHADOW_DX * 0.5}px ${SHADOW_DY * 0.5}px 5px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.2)`;
  }, [isDragging, isLifted, isExpanded]);

  const handleClick = useCallback(() => {
    if (isDragging) return;
    if (!isExpanded) onExpand();
  }, [isDragging, isExpanded, onExpand]);

  const handleSubmit = () => {
    if (name.trim() && email.trim() && question.trim()) setSubmitted(true);
  };

  return (
    <motion.div
      className="absolute touch-none select-none"
      drag={!isExpanded}
      dragConstraints={constraintsRef}
      dragElastic={0.02}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
      initial={{ opacity: 0, scale: 0.4, rotate: note.rotate * 5, y: 80 }}
      animate={{
        opacity: 1,
        scale: isExpanded ? 1.35 : 1,
        rotate: isExpanded ? 0 : note.rotate,
        y: isExpanded ? -20 : 0,
      }}
      transition={isExpanded
        ? { type: "spring", stiffness: 180, damping: 22 }
        : { type: "spring", stiffness: 90, damping: 13, delay: 0.6 + note.id * 0.18 }
      }
      whileHover={!isExpanded ? { scale: 1.035, rotate: note.rotate * 0.2, zIndex: 50, y: -8, transition: { type: "spring", stiffness: 200, damping: 18 } } : undefined}
      whileDrag={!isExpanded ? { scale: 1.06, rotate: 0, zIndex: 100, transition: { type: "spring", stiffness: 250, damping: 18 } } : undefined}
      style={{ zIndex: isExpanded ? 150 : isDragging ? 100 : isLifted ? 60 : 10 + note.id, x: isExpanded ? 0 : smoothX, y: isExpanded ? undefined : smoothY }}
      onHoverStart={() => !isExpanded && setIsLifted(true)}
      onHoverEnd={() => setIsLifted(false)}
      onClick={handleClick}
      data-testid={`sticky-note-${note.id}`}
    >
      <div
        className={`w-[240px] md:w-[260px] relative group ${isExpanded ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
        style={{
          boxShadow: shadowStyle,
          transition: "box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          aspectRatio: isExpanded ? "auto" : "1",
        }}
      >
        <div
          className="relative overflow-hidden h-full"
          style={{
            background: `linear-gradient(168deg, ${note.bg} 0%, ${note.bgDark} 100%)`,
            filter: `url(#${PAPER_NOISE_ID})`,
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(${LIGHT_ANGLE}deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 30%, transparent 60%, rgba(0,0,0,0.06) 100%)` }} />

          <div className="absolute top-0 left-[15%] right-[15%] h-[22px] pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 60%, transparent 100%)", borderRadius: "0 0 2px 2px" }} />

          <div style={curlStyle as any} />

          <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.06) 0%, transparent 100%)" }} />

          <div className="p-5 pt-7 relative flex flex-col h-full">
            {isExpanded && (
              <button
                onClick={(e) => { e.stopPropagation(); onCollapse(); }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors z-10"
                data-testid={`close-note-${note.id}`}
              >
                <X className="w-3.5 h-3.5" style={{ color: note.color }} />
              </button>
            )}

            <div className="relative">
              <h3 className="text-[26px] font-bold leading-tight" style={{ color: note.color, fontFamily: "'Caveat', cursive" }}>{note.title}</h3>
            </div>

            <div className="mt-3 relative flex-1">
              <p className="text-[21px] leading-[1.4]" style={{ color: "rgba(0,0,0,0.65)", fontFamily: "'Caveat', cursive" }}>{note.desc}</p>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="overflow-hidden"
                >
                  {!submitted ? (
                    <div className="mt-4 pt-3" style={{ borderTop: `2px dashed ${note.color}30` }}>
                      <p className="text-[16px] font-semibold mb-2" style={{ color: note.color, fontFamily: "'Caveat', cursive" }}>
                        Ask Greg about this:
                      </p>
                      <div className="space-y-2 mb-2">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Name"
                          className="w-full rounded-lg px-3 py-2 text-[15px] border-none outline-none"
                          style={{ background: "rgba(255,255,255,0.5)", color: "#333", fontFamily: "'Caveat', cursive" }}
                          data-testid={`input-note-name-${note.id}`}
                        />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Email"
                          className="w-full rounded-lg px-3 py-2 text-[15px] border-none outline-none"
                          style={{ background: "rgba(255,255,255,0.5)", color: "#333", fontFamily: "'Caveat', cursive" }}
                          data-testid={`input-note-email-${note.id}`}
                        />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Phone"
                          className="w-full rounded-lg px-3 py-2 text-[15px] border-none outline-none"
                          style={{ background: "rgba(255,255,255,0.5)", color: "#333", fontFamily: "'Caveat', cursive" }}
                          data-testid={`input-note-phone-${note.id}`}
                        />
                      </div>
                      <textarea
                        ref={inputRef}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Type your question..."
                        rows={3}
                        className="w-full rounded-lg px-3 py-2 text-[15px] border-none outline-none resize-none leading-relaxed"
                        style={{
                          background: "rgba(255,255,255,0.5)",
                          color: "#333",
                          fontFamily: "'Caveat', cursive",
                        }}
                        data-testid={`input-question-${note.id}`}
                      />
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); handleSubmit(); }}
                        className="w-full mt-2 py-2 rounded-lg font-bold text-[16px] flex items-center justify-center gap-2 transition-all"
                        style={{
                          background: note.color,
                          color: note.bg,
                          fontFamily: "'Caveat', cursive",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        data-testid={`button-send-${note.id}`}
                      >
                        <Send className="w-4 h-4" /> Send to Greg
                      </motion.button>
                    </div>
                  ) : (
                    <motion.div
                      className="mt-4 pt-3 text-center"
                      style={{ borderTop: `2px dashed ${note.color}30` }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: `${note.color}20` }}>
                        <Check className="w-6 h-6" style={{ color: note.color }} />
                      </div>
                      <p className="text-[18px] font-bold" style={{ color: note.color, fontFamily: "'Caveat', cursive" }}>Question Sent!</p>
                      <p className="text-[14px] mt-1" style={{ color: "rgba(0,0,0,0.45)", fontFamily: "'Caveat', cursive" }}>Greg will get back to you shortly.</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); onCollapse(); }}
                        className="mt-3 text-[14px] font-semibold hover:underline"
                        style={{ color: note.color, fontFamily: "'Caveat', cursive" }}
                      >
                        Close
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {!isExpanded && (
              <div className="flex items-center justify-between mt-auto pt-2 relative">
                <div className="flex items-center gap-1.5 text-[16px] font-bold px-2 py-1" style={{ color: note.color, fontFamily: "'Caveat', cursive" }}>
                  <MessageCircle className="w-4 h-4" /> Click to ask Greg
                </div>
                <div className="flex items-center gap-0.5 text-[10px] font-medium opacity-15" style={{ fontFamily: "'Caveat', cursive" }}>
                  <GripVertical className="w-3 h-3" /> drag
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AskGregModal({ topic, onClose }: { topic: string; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.div className="fixed inset-0 z-[200] flex items-center justify-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative bg-[#141414] rounded-3xl p-7 w-full max-w-[460px] border border-white/10 shadow-2xl" initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 30 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors" data-testid="close-ask-greg"><X className="w-4 h-4" /></button>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4a94c] to-[#f0d88a] flex items-center justify-center shadow-lg shadow-[#d4a94c]/20"><MessageCircle className="w-6 h-6 text-[#0c0c0c]" /></div>
          <div><h3 className="text-white font-bold text-[18px]">Ask Greg</h3><p className="text-white/30 text-[12px]">About: {topic}</p></div>
        </div>
        {!submitted ? (
          <>
            <div className="space-y-3 mb-3">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-[14px] placeholder:text-white/20 outline-none focus:border-[#d4a94c]/40 transition-colors" data-testid="input-ask-greg-name" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-[14px] placeholder:text-white/20 outline-none focus:border-[#d4a94c]/40 transition-colors" data-testid="input-ask-greg-email" />
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-[14px] placeholder:text-white/20 outline-none focus:border-[#d4a94c]/40 transition-colors" data-testid="input-ask-greg-phone" />
            </div>
            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Type your question here..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-[14px] placeholder:text-white/20 outline-none focus:border-[#d4a94c]/40 resize-none transition-colors" data-testid="input-ask-greg" />
            <motion.button onClick={() => { if (name.trim() && email.trim() && question.trim()) setSubmitted(true); }} className="w-full mt-4 h-12 rounded-xl bg-gradient-to-r from-[#d4a94c] to-[#c4953a] text-[#0c0c0c] font-bold text-[14px] flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#d4a94c]/20 transition-shadow" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} data-testid="button-send-question"><Send className="w-4 h-4" />Send to Greg</motion.button>
          </>
        ) : (
          <motion.div className="text-center py-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 rounded-full bg-[#d4a94c]/10 flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-[#d4a94c]" /></div>
            <p className="text-white font-bold text-[16px]">Question Sent!</p>
            <p className="text-white/30 text-[13px] mt-1.5">Greg will get back to you shortly.</p>
            <button onClick={onClose} className="mt-5 text-[#d4a94c] text-[13px] font-semibold hover:underline">Close</button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function DeskPhone() {
  const [calling, setCalling] = useState(false);

  return (
    <motion.div
      className="absolute select-none"
      style={{ right: "8%", bottom: "8%", zIndex: 50 }}
      initial={{ opacity: 0, y: 40, rotate: 12 }}
      animate={{ opacity: 1, y: 0, rotate: 12 }}
      transition={{ type: "spring", stiffness: 80, damping: 14, delay: 1.2 }}
      data-testid="desk-phone"
    >
      <div
        className="relative"
        style={{
          width: "260px",
          height: "520px",
          borderRadius: "32px",
          background: "linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)",
          boxShadow: `6px 8px 30px rgba(0,0,0,0.6), 3px 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`,
          border: "2px solid rgba(255,255,255,0.08)",
          padding: "10px",
        }}
      >
        <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[60px] h-[7px] rounded-full bg-black/60 border border-white/[0.06]" />

        <div
          className="relative w-full overflow-hidden"
          style={{
            height: "calc(100% - 0px)",
            borderRadius: "24px",
            background: "linear-gradient(180deg, #0d1117 0%, #161b22 100%)",
          }}
        >
          <div className="flex items-center justify-between px-4 pt-3 pb-1.5">
            <span className="text-[12px] text-white/40 font-medium">9:41</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 text-white/40" />
              <Wifi className="w-3.5 h-3.5 text-white/40" />
              <BatteryFull className="w-4 h-3.5 text-white/40" />
            </div>
          </div>

          <div className="flex flex-col items-center pt-10 pb-6 px-6">
            <motion.div
              className="w-[90px] h-[90px] rounded-full flex items-center justify-center mb-5 overflow-hidden border-2 border-[#d4a94c]/40"
              style={{
                boxShadow: "0 4px 20px rgba(212,169,76,0.3)",
              }}
              animate={calling ? { scale: [1, 1.08, 1], boxShadow: ["0 4px 20px rgba(212,169,76,0.3)", "0 4px 30px rgba(212,169,76,0.6)", "0 4px 20px rgba(212,169,76,0.3)"] } : {}}
              transition={calling ? { repeat: Infinity, duration: 1.5 } : {}}
            >
              <img src={gregHeadshot} alt="Greg headshot" className="w-full h-full object-cover" data-testid="img-greg-headshot" />
            </motion.div>

            <p className="text-white font-bold text-[24px] tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>GREG</p>
            <p className="text-white/30 text-[14px] mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Lender Greg Wynn</p>

            <AnimatePresence mode="wait">
              {!calling ? (
                <motion.p
                  key="ready"
                  className="text-[#d4a94c] text-[12px] font-medium mt-3 uppercase tracking-widest"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Ready to call
                </motion.p>
              ) : (
                <motion.p
                  key="calling"
                  className="text-[#4ade80] text-[12px] font-medium mt-3 uppercase tracking-widest"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  Calling...
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-5 pb-8">
            <motion.button
              onClick={() => {
                if (!calling) {
                  setCalling(true);
                  window.open("tel:+16195509885", "_self");
                  setTimeout(() => setCalling(false), 3000);
                }
              }}
              className="w-full py-3.5 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 transition-all"
              style={{
                background: calling
                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                  : "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "white",
                boxShadow: calling
                  ? "0 4px 15px rgba(239,68,68,0.4)"
                  : "0 4px 15px rgba(34,197,94,0.4)",
                fontFamily: "'DM Sans', sans-serif",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              data-testid="button-call-greg"
            >
              <Phone className="w-5 h-5" />
              {calling ? "Calling..." : "CALL GREG"}
            </motion.button>
          </div>
        </div>

        <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[50px] h-[5px] rounded-full bg-white/10" />
      </div>
    </motion.div>
  );
}

const notePositions = [
  { left: "10%", top: "35%" },
  { left: "35%", top: "30%" },
  { left: "60%", top: "34%" },
  { left: "18%", top: "62%" },
  { left: "48%", top: "54%" },
];

export const ResourcesSection = (): JSX.Element => {
  const [notes, setNotes] = useState(initialNotes);
  const [askTopic, setAskTopic] = useState<string | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [boardBounds, setBoardBounds] = useState({ width: 1, height: 1 });

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const updateBounds = () => { const r = el.getBoundingClientRect(); setBoardBounds({ width: r.width, height: r.height }); };
    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const r = boardRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set(e.clientX - r.left);
    mouseY.set(e.clientY - r.top);
  }, [mouseX, mouseY]);

  const handleEdit = useCallback((id: number, title: string, desc: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, title, desc } : n));
  }, []);

  return (
    <section className="py-0 bg-white relative overflow-hidden">
      <PaperTextureDefs />

      <div className="relative z-10 bg-white">
        <motion.div
          className="relative text-center mb-0 w-full rounded-none border-y border-[#d4a94c]/15 bg-white px-5 py-14 sm:px-10 sm:py-16 overflow-hidden shadow-2xl shadow-black/10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4a94c]/12 border border-[#d4a94c]/20 text-[#c4953a] font-bold text-[13px] uppercase tracking-[0.2em]">Resources</span>
          <h2 className="relative text-5xl md:text-6xl font-black text-black mt-4 tracking-[-0.04em] leading-[0.95]" data-testid="text-resources-heading">
            Learn Before You <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a94c] via-[#c4953a] to-[#8a6a1f]">Borrow</span>
          </h2>
          <p className="relative text-black/70 text-[16px] sm:text-[17px] mt-4 max-w-[720px] mx-auto leading-relaxed">
            Drag, edit, and explore these notes — or ask Greg a question directly.
          </p>
          <p className="relative text-[#c4953a] text-[13px] mt-3 uppercase tracking-[0.2em] font-semibold">Drag to rearrange</p>
        </motion.div>

      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full bg-white"
      >
        <div
          ref={boardRef}
          onMouseMove={handleMouseMove}
          className="relative w-full overflow-hidden bg-white"
          style={{
            touchAction: "none",
            minHeight: "720px",
            aspectRatio: "16 / 10",
            maxHeight: "90vh",
            background: "#fff",
          }}
        >
          <img
            src={deskImg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center top" }}
            draggable={false}
          />

          <div className="absolute inset-0 pointer-events-none" />

          {notes.map((note, i) => (
            <div key={note.id} className="absolute" style={{ left: notePositions[i]?.left ?? "20%", top: notePositions[i]?.top ?? "20%" }}>
              <StickyNoteCard
                note={note}
                onEdit={handleEdit}
                onAskGreg={(topic) => setAskTopic(topic)}
                constraintsRef={boardRef}
                mouseX={mouseX}
                mouseY={mouseY}
                boardBounds={boardBounds}
                isExpanded={expandedNoteId === note.id}
                onExpand={() => setExpandedNoteId(note.id)}
                onCollapse={() => setExpandedNoteId(null)}
              />
            </div>
          ))}

          <DeskPhone />
        </div>
      </motion.div>

      <AnimatePresence>
        {askTopic && <AskGregModal topic={askTopic} onClose={() => setAskTopic(null)} />}
      </AnimatePresence>
    </section>
  );
};

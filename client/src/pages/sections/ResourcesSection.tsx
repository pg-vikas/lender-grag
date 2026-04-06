import { BookOpen, CheckSquare, Home, FileText, AlertTriangle, MessageCircle, X, Send, GripVertical, Pencil, Check } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";

interface StickyNote {
  id: number;
  icon: typeof BookOpen;
  title: string;
  desc: string;
  color: string;
  bg: string;
  rotate: number;
  shadow: string;
}

const initialNotes: StickyNote[] = [
  { id: 0, icon: BookOpen, title: "First-Time Buyer Guide", desc: "Everything you need to know before buying your first home — from credit to closing.", color: "#d97706", bg: "#fef3c7", rotate: -2.5, shadow: "rgba(217,119,6,0.12)" },
  { id: 1, icon: CheckSquare, title: "Pre-Approval Checklist", desc: "The documents and steps needed to get pre-approved fast and stress-free.", color: "#059669", bg: "#d1fae5", rotate: 1.8, shadow: "rgba(5,150,105,0.12)" },
  { id: 2, icon: Home, title: "How Much House Can I Afford?", desc: "Understand your real budget based on what lenders actually look for.", color: "#2563eb", bg: "#dbeafe", rotate: -1.2, shadow: "rgba(37,99,235,0.12)" },
  { id: 3, icon: FileText, title: "Documents You'll Need", desc: "A complete list of what to prepare before starting your mortgage application.", color: "#db2777", bg: "#fce7f3", rotate: 2.8, shadow: "rgba(219,39,119,0.12)" },
  { id: 4, icon: AlertTriangle, title: "Mortgage Mistakes to Avoid", desc: "Five common pitfalls that cost borrowers time, money, and deals.", color: "#ea580c", bg: "#ffedd5", rotate: -1.6, shadow: "rgba(234,88,12,0.12)" },
];

function StickyNoteCard({ note, onEdit, onAskGreg, constraintsRef, mouseX, mouseY, boardBounds }: {
  note: StickyNote;
  onEdit: (id: number, title: string, desc: string) => void;
  onAskGreg: (topic: string) => void;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  mouseX: ReturnType<typeof useMotionValue>;
  mouseY: ReturnType<typeof useMotionValue>;
  boardBounds: { width: number; height: number };
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editDesc, setEditDesc] = useState(note.desc);
  const [isDragging, setIsDragging] = useState(false);
  const [isLifted, setIsLifted] = useState(false);
  const Icon = note.icon;

  const parallaxX = useTransform(mouseX, [0, boardBounds.width || 1], [-1.5, 1.5]);
  const parallaxY = useTransform(mouseY, [0, boardBounds.height || 1], [-1, 1]);
  const smoothX = useSpring(parallaxX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(parallaxY, { stiffness: 60, damping: 20 });

  const handleSave = () => {
    onEdit(note.id, editTitle, editDesc);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditDesc(note.desc);
    setIsEditing(false);
  };

  return (
    <motion.div
      className="absolute touch-none select-none"
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.03}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      initial={{ opacity: 0, scale: 0.5, rotate: note.rotate * 4, y: 60 }}
      animate={{ opacity: 1, scale: 1, rotate: note.rotate, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.5 + note.id * 0.15 }}
      whileHover={{ scale: 1.04, rotate: note.rotate * 0.3, zIndex: 50, y: -6 }}
      whileDrag={{ scale: 1.08, rotate: 0, zIndex: 100, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      style={{
        zIndex: isDragging ? 100 : isLifted ? 60 : 10 + note.id,
        x: smoothX,
        y: smoothY,
      }}
      onHoverStart={() => setIsLifted(true)}
      onHoverEnd={() => setIsLifted(false)}
      data-testid={`sticky-note-${note.id}`}
    >
      <div
        className="w-[210px] md:w-[235px] relative group cursor-grab active:cursor-grabbing"
        style={{
          filter: isDragging
            ? "drop-shadow(0 30px 40px rgba(0,0,0,0.55)) drop-shadow(0 8px 12px rgba(0,0,0,0.3))"
            : isLifted
            ? "drop-shadow(0 16px 28px rgba(0,0,0,0.45)) drop-shadow(0 4px 8px rgba(0,0,0,0.25))"
            : "drop-shadow(0 4px 12px rgba(0,0,0,0.3)) drop-shadow(0 1px 3px rgba(0,0,0,0.2))",
          transition: "filter 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          className="rounded-[3px] relative overflow-hidden"
          style={{
            backgroundColor: note.bg,
            backgroundImage: `
              linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(0,0,0,0.02) 100%),
              repeating-linear-gradient(0deg, transparent, transparent 22px, rgba(0,0,0,0.03) 22px, rgba(0,0,0,0.03) 23px)
            `,
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[4px] rounded-t-[3px]" style={{ backgroundColor: note.color, opacity: 0.65 }} />

          <div
            className="absolute top-0 left-0 w-[20px] h-[20px] opacity-[0.06]"
            style={{
              background: `linear-gradient(135deg, rgba(0,0,0,0.3) 0%, transparent 100%)`,
              borderRadius: "0 0 100% 0",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-[22px] h-[22px] opacity-[0.04]"
            style={{
              background: `linear-gradient(-45deg, rgba(0,0,0,0.4) 0%, transparent 100%)`,
              borderRadius: "100% 0 0 0",
            }}
          />

          <div className="p-4 pb-3 relative">
            <div className="absolute top-1.5 right-1.5 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {!isEditing && (
                <button
                  onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                  className="w-5 h-5 rounded flex items-center justify-center hover:bg-black/10 transition-colors"
                  data-testid={`edit-note-${note.id}`}
                >
                  <Pencil className="w-2.5 h-2.5" style={{ color: note.color }} />
                </button>
              )}
            </div>

            <div className="flex items-start gap-2.5 mt-1 relative">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${note.color}18`, boxShadow: `0 2px 8px ${note.shadow}` }}
              >
                <Icon className="w-4 h-4" style={{ color: note.color }} />
              </div>
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-[13px] font-bold bg-white/60 rounded px-1.5 py-0.5 border-none outline-none focus:bg-white/80"
                    style={{ color: "#1a1a1a" }}
                    onClick={(e) => e.stopPropagation()}
                    data-testid={`input-title-${note.id}`}
                  />
                ) : (
                  <h3 className="text-[13px] font-bold leading-snug" style={{ color: "#1a1a1a" }}>{note.title}</h3>
                )}
              </div>
            </div>

            <div className="mt-2.5 relative">
              {isEditing ? (
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full text-[11px] bg-white/60 rounded px-1.5 py-1 border-none outline-none resize-none focus:bg-white/80 leading-relaxed"
                  style={{ color: "#444" }}
                  onClick={(e) => e.stopPropagation()}
                  data-testid={`input-desc-${note.id}`}
                />
              ) : (
                <p className="text-[11px] leading-[1.65]" style={{ color: "#4a4a4a" }}>{note.desc}</p>
              )}
            </div>

            {isEditing ? (
              <div className="flex gap-1.5 mt-2.5 relative">
                <button
                  onClick={(e) => { e.stopPropagation(); handleSave(); }}
                  className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded bg-white/60 hover:bg-white/80 transition-colors"
                  style={{ color: note.color }}
                  data-testid={`save-note-${note.id}`}
                >
                  <Check className="w-2.5 h-2.5" /> Save
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                  className="flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded bg-black/5 hover:bg-black/10 text-gray-500 transition-colors"
                >
                  <X className="w-2.5 h-2.5" /> Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t relative" style={{ borderColor: `${note.color}12` }}>
                <button
                  onClick={(e) => { e.stopPropagation(); onAskGreg(note.title); }}
                  className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded hover:bg-white/40 transition-colors"
                  style={{ color: note.color }}
                  data-testid={`ask-greg-${note.id}`}
                >
                  <MessageCircle className="w-3 h-3" />
                  Ask Greg
                </button>
                <div className="flex items-center gap-0.5 text-[9px] font-medium opacity-25">
                  <GripVertical className="w-2.5 h-2.5" />
                  drag
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DeskAccessories() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute top-[5%] right-[5%] w-[70px] h-[70px] opacity-[0.22]" viewBox="0 0 70 70" style={{ transform: "rotate(8deg)" }}>
        <ellipse cx="30" cy="36" rx="3" ry="2" fill="rgba(80,50,20,0.15)" />
        <circle cx="30" cy="34" r="24" fill="#1c1510" stroke="#4a3520" strokeWidth="2.5" />
        <circle cx="30" cy="34" r="20" fill="#251a10" />
        <ellipse cx="30" cy="34" rx="16" ry="16" fill="#1a0f06" />
        <ellipse cx="28" cy="31" rx="7" ry="5" fill="#3a2510" opacity="0.35" />
        <path d="M54 26 Q64 26, 64 34 Q64 42, 54 42" fill="none" stroke="#4a3520" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <svg className="absolute bottom-[10%] right-[3%] w-[190px] h-[14px] opacity-[0.22]" viewBox="0 0 190 14" style={{ transform: "rotate(-14deg)" }}>
        <rect x="0" y="3" width="160" height="8" rx="4" fill="#1a1a1a" />
        <rect x="0" y="4" width="160" height="3" rx="1.5" fill="rgba(255,255,255,0.06)" />
        <rect x="6" y="2" width="28" height="10" rx="2" fill="#2a2a2a" />
        <polygon points="160,3 178,7 160,11" fill="#c4953a" />
        <polygon points="178,6.5 183,7 178,7.5" fill="#7a6a50" />
        <rect x="148" y="2.5" width="14" height="9" rx="1" fill="#b8860b" opacity="0.45" />
      </svg>

      <svg className="absolute top-[20%] left-[1.5%] w-[150px] h-[10px] opacity-[0.16]" viewBox="0 0 150 10" style={{ transform: "rotate(24deg)" }}>
        <rect x="0" y="1" width="130" height="8" rx="4" fill="#5a1515" />
        <rect x="0" y="2" width="130" height="3" rx="1.5" fill="rgba(255,255,255,0.05)" />
        <polygon points="130,1 145,5 130,9" fill="#2a2a2a" />
        <rect x="112" y="0.5" width="10" height="9" rx="1" fill="#888" opacity="0.3" />
      </svg>

      <svg className="absolute top-[3%] left-[26%] w-[95px] h-[42px] opacity-[0.14]" viewBox="0 0 100 45" style={{ transform: "rotate(-4deg)" }}>
        <ellipse cx="25" cy="22" rx="18" ry="16" fill="none" stroke="#555" strokeWidth="1.8" />
        <ellipse cx="75" cy="22" rx="18" ry="16" fill="none" stroke="#555" strokeWidth="1.8" />
        <path d="M43 20 Q50 15, 57 20" fill="none" stroke="#555" strokeWidth="1.8" />
        <line x1="7" y1="16" x2="0" y2="8" stroke="#555" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="93" y1="16" x2="100" y2="8" stroke="#555" strokeWidth="1.6" strokeLinecap="round" />
      </svg>

      {[
        { top: "14%", left: "90%", rot: 50, op: 0.10 },
        { top: "75%", left: "93%", rot: -25, op: 0.08 },
        { top: "82%", left: "20%", rot: 65, op: 0.07 },
      ].map((clip, i) => (
        <svg key={`clip-${i}`} className="absolute w-[16px] h-[30px]" style={{ top: clip.top, left: clip.left, transform: `rotate(${clip.rot}deg)`, opacity: clip.op }} viewBox="0 0 18 32">
          <path d="M5 2 L5 24 Q5 30, 9 30 Q13 30, 13 24 L13 8 Q13 4, 9 4 Q5 4, 5 8" fill="none" stroke="#777" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ))}

      <svg className="absolute top-[32%] right-[1%] w-[14px] h-[200px] opacity-[0.08]" viewBox="0 0 14 200">
        <rect x="0" y="0" width="14" height="200" rx="1" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="0.5" />
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={i} x1="0" y1={i * 10} x2={i % 5 === 0 ? "9" : "4"} y2={i * 10} stroke="#555" strokeWidth={i % 5 === 0 ? "0.7" : "0.3"} />
        ))}
      </svg>

      <div
        className="absolute top-[58%] left-[42%] w-[120px] h-[155px] opacity-[0.03] rounded-sm"
        style={{ background: "linear-gradient(175deg, #eee8dd 0%, #ddd5c5 100%)", transform: "rotate(11deg)" }}
      />
      <div
        className="absolute top-[6%] right-[22%] w-[100px] h-[130px] opacity-[0.025] rounded-sm"
        style={{ background: "linear-gradient(180deg, #e8e0d5 0%, #ddd5c5 100%)", transform: "rotate(-7deg)" }}
      />
    </div>
  );
}

function AskGregModal({ topic, onClose }: { topic: string; onClose: () => void }) {
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-[#141414] rounded-3xl p-7 w-full max-w-[460px] border border-white/10 shadow-2xl"
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          data-testid="close-ask-greg"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4a94c] to-[#f0d88a] flex items-center justify-center shadow-lg shadow-[#d4a94c]/20">
            <MessageCircle className="w-6 h-6 text-[#0c0c0c]" />
          </div>
          <div>
            <h3 className="text-white font-bold text-[18px]">Ask Greg</h3>
            <p className="text-white/30 text-[12px]">About: {topic}</p>
          </div>
        </div>

        {!submitted ? (
          <>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-[14px] placeholder:text-white/20 outline-none focus:border-[#d4a94c]/40 resize-none transition-colors"
              data-testid="input-ask-greg"
            />
            <motion.button
              onClick={() => { if (question.trim()) setSubmitted(true); }}
              className="w-full mt-4 h-12 rounded-xl bg-gradient-to-r from-[#d4a94c] to-[#c4953a] text-[#0c0c0c] font-bold text-[14px] flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#d4a94c]/20 transition-shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-send-question"
            >
              <Send className="w-4 h-4" />
              Send to Greg
            </motion.button>
          </>
        ) : (
          <motion.div
            className="text-center py-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 rounded-full bg-[#d4a94c]/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-[#d4a94c]" />
            </div>
            <p className="text-white font-bold text-[16px]">Question Sent!</p>
            <p className="text-white/30 text-[13px] mt-1.5">Greg will get back to you shortly.</p>
            <button
              onClick={onClose}
              className="mt-5 text-[#d4a94c] text-[13px] font-semibold hover:underline"
            >
              Close
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

const notePositions = [
  { left: "4%", top: "8%" },
  { left: "30%", top: "4%" },
  { left: "62%", top: "6%" },
  { left: "10%", top: "50%" },
  { left: "50%", top: "48%" },
];

export const ResourcesSection = (): JSX.Element => {
  const [notes, setNotes] = useState(initialNotes);
  const [askTopic, setAskTopic] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [boardBounds, setBoardBounds] = useState({ width: 1, height: 1 });

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const updateBounds = () => {
      const rect = el.getBoundingClientRect();
      setBoardBounds({ width: rect.width, height: rect.height });
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  const handleEdit = useCallback((id: number, title: string, desc: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, title, desc } : n));
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-[#0c0c0c] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-[#d4a94c] font-bold text-[13px] uppercase tracking-[0.2em]">Resources</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-3 tracking-[-0.02em]" data-testid="text-resources-heading">
            Learn Before You{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a94c] to-[#f0d88a]">Borrow</span>
          </h2>
          <p className="text-white/30 text-[15px] mt-3 max-w-[460px] mx-auto leading-relaxed">
            Drag, edit, and explore these notes — or ask Greg a question directly.
          </p>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-3 mb-8 flex-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {[
            { label: "Drag to rearrange", icon: GripVertical },
            { label: "Click pencil to edit", icon: Pencil },
            { label: "Ask Greg anything", icon: MessageCircle },
          ].map((tip, i) => (
            <div key={i} className="flex items-center gap-1.5 text-white/20 text-[11px] font-medium px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
              <tip.icon className="w-3 h-3" />
              {tip.label}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="rounded-2xl overflow-hidden"
          style={{
            boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 60px rgba(0,0,0,0.6), 0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          <div
            ref={boardRef}
            onMouseMove={handleMouseMove}
            className="relative w-full min-h-[620px] md:min-h-[600px] lg:min-h-[660px] rounded-2xl overflow-hidden"
            style={{
              touchAction: "none",
              background: `
                linear-gradient(178deg, 
                  #3d2b1a 0%, 
                  #33220f 15%,
                  #3a2816 30%, 
                  #2e1f10 50%, 
                  #362414 70%, 
                  #2c1d0e 85%,
                  #2a1c0d 100%
                )
              `,
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.035]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    175deg,
                    transparent,
                    transparent 2px,
                    rgba(139,90,43,0.4) 2px,
                    rgba(139,90,43,0.4) 3px
                  )
                `,
              }}
            />

            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    92deg,
                    transparent,
                    transparent 100px,
                    rgba(0,0,0,0.12) 100px,
                    rgba(0,0,0,0.12) 101px
                  )
                `,
              }}
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse 70% 50% at 35% 25%, rgba(255,220,150,0.07) 0%, transparent 100%),
                  radial-gradient(ellipse 60% 40% at 75% 75%, rgba(0,0,0,0.2) 0%, transparent 100%),
                  radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.15) 100%)
                `,
              }}
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(180deg, rgba(255,235,180,0.03) 0%, transparent 30%),
                  linear-gradient(0deg, rgba(0,0,0,0.12) 0%, transparent 20%)
                `,
              }}
            />

            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black/50" />
            <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-black/20" />
            <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-black/20" />

            <DeskAccessories />

            {notes.map((note, i) => (
              <div
                key={note.id}
                className="absolute"
                style={{
                  left: notePositions[i]?.left ?? "20%",
                  top: notePositions[i]?.top ?? "20%",
                }}
              >
                <StickyNoteCard
                  note={note}
                  onEdit={handleEdit}
                  onAskGreg={(topic) => setAskTopic(topic)}
                  constraintsRef={boardRef}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  boardBounds={boardBounds}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {askTopic && (
          <AskGregModal
            topic={askTopic}
            onClose={() => setAskTopic(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

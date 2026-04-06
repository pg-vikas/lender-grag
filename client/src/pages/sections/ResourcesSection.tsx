import { BookOpen, CheckSquare, Home, FileText, AlertTriangle, MessageCircle, X, Send, GripVertical, Pencil, Check, Pin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback } from "react";

interface StickyNote {
  id: number;
  icon: typeof BookOpen;
  title: string;
  desc: string;
  color: string;
  bg: string;
  rotate: number;
}

const initialNotes: StickyNote[] = [
  { id: 0, icon: BookOpen, title: "First-Time Buyer Guide", desc: "Everything you need to know before buying your first home — from credit to closing.", color: "#d97706", bg: "#fef3c7", rotate: -3.5 },
  { id: 1, icon: CheckSquare, title: "Pre-Approval Checklist", desc: "The documents and steps needed to get pre-approved fast and stress-free.", color: "#059669", bg: "#d1fae5", rotate: 2.2 },
  { id: 2, icon: Home, title: "How Much House Can I Afford?", desc: "Understand your real budget based on what lenders actually look for.", color: "#2563eb", bg: "#dbeafe", rotate: -1.8 },
  { id: 3, icon: FileText, title: "Documents You'll Need", desc: "A complete list of what to prepare before starting your mortgage application.", color: "#db2777", bg: "#fce7f3", rotate: 3.5 },
  { id: 4, icon: AlertTriangle, title: "Mortgage Mistakes to Avoid", desc: "Five common pitfalls that cost borrowers time, money, and deals.", color: "#ea580c", bg: "#ffedd5", rotate: -2.8 },
];

function StickyNoteCard({ note, onEdit, onAskGreg, constraintsRef }: {
  note: StickyNote;
  onEdit: (id: number, title: string, desc: string) => void;
  onAskGreg: (topic: string) => void;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editDesc, setEditDesc] = useState(note.desc);
  const [isDragging, setIsDragging] = useState(false);
  const Icon = note.icon;

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
      dragElastic={0.05}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      initial={{ opacity: 0, scale: 0.6, rotate: note.rotate * 3, y: 30 }}
      animate={{ opacity: 1, scale: 1, rotate: note.rotate, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.3 + note.id * 0.12 }}
      whileHover={{ scale: 1.06, rotate: 0, zIndex: 50, y: -4 }}
      whileDrag={{ scale: 1.1, rotate: 0, zIndex: 100, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      style={{ zIndex: isDragging ? 100 : 10 + note.id }}
      data-testid={`sticky-note-${note.id}`}
    >
      <div
        className="w-[220px] md:w-[240px] relative group cursor-grab active:cursor-grabbing"
        style={{ filter: isDragging ? "drop-shadow(0 25px 35px rgba(0,0,0,0.5))" : "drop-shadow(0 6px 16px rgba(0,0,0,0.35))" }}
      >
        <div
          className="absolute -bottom-[3px] left-[6px] right-[6px] h-[6px] rounded-b-lg blur-[3px]"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        />

        <div
          className="rounded-sm p-4 pb-3 relative overflow-hidden"
          style={{ backgroundColor: note.bg }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-7"
            style={{ background: `linear-gradient(180deg, ${note.color}18 0%, transparent 100%)` }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(0,0,0,0.15) 23px, rgba(0,0,0,0.15) 24px)" }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-8"
            style={{ background: `linear-gradient(0deg, rgba(0,0,0,0.04) 0%, transparent 100%)` }}
          />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: note.color, opacity: 0.7 }} />

          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 opacity-60">
            <Pin className="w-3.5 h-3.5" style={{ color: note.color }} />
          </div>

          <div className="absolute top-1.5 right-1.5 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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

          <div className="flex items-start gap-2.5 mt-4 relative">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${note.color}15` }}
            >
              <Icon className="w-4 h-4" style={{ color: note.color }} />
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-[13px] font-bold bg-white/50 rounded px-1.5 py-0.5 border-none outline-none focus:bg-white/70"
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
                className="w-full text-[11px] bg-white/50 rounded px-1.5 py-1 border-none outline-none resize-none focus:bg-white/70 leading-relaxed"
                style={{ color: "#555" }}
                onClick={(e) => e.stopPropagation()}
                data-testid={`input-desc-${note.id}`}
              />
            ) : (
              <p className="text-[11px] leading-[1.6]" style={{ color: "#555" }}>{note.desc}</p>
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
            <div className="flex items-center justify-between mt-2.5 pt-2 border-t relative" style={{ borderColor: `${note.color}15` }}>
              <button
                onClick={(e) => { e.stopPropagation(); onAskGreg(note.title); }}
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded hover:bg-white/40 transition-colors"
                style={{ color: note.color }}
                data-testid={`ask-greg-${note.id}`}
              >
                <MessageCircle className="w-3 h-3" />
                Ask Greg
              </button>
              <div className="flex items-center gap-0.5 text-[9px] font-medium opacity-30">
                <GripVertical className="w-2.5 h-2.5" />
                drag
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DeskAccessories() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">

      {/* Coffee mug — top-right, bird's eye circle with handle */}
      <svg className="absolute top-[6%] right-[6%] w-[65px] h-[65px] opacity-[0.18]" viewBox="0 0 65 65" style={{ transform: "rotate(10deg)" }}>
        <circle cx="28" cy="32" r="22" fill="#1a1410" stroke="#3d2b18" strokeWidth="2" />
        <circle cx="28" cy="32" r="18" fill="#2a1c10" />
        <ellipse cx="28" cy="32" rx="14" ry="14" fill="#1c1208" />
        <ellipse cx="28" cy="30" rx="6" ry="4" fill="#3a2510" opacity="0.4" />
        <path d="M50 24 Q60 24, 60 32 Q60 40, 50 40" fill="none" stroke="#3d2b18" strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      {/* Coffee ring stain */}
      <div
        className="absolute top-[5%] right-[5%] w-[80px] h-[80px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, transparent 26px, rgba(100,60,20,0.6) 27px, rgba(100,60,20,0.3) 32px, transparent 33px)",
        }}
      />

      {/* Pen — long diagonal, bottom-right */}
      <svg className="absolute bottom-[12%] right-[4%] w-[200px] h-[16px] opacity-[0.2]" viewBox="0 0 200 16" style={{ transform: "rotate(-12deg)" }}>
        <rect x="0" y="4" width="170" height="8" rx="4" fill="#1a1a1a" />
        <rect x="0" y="5" width="170" height="3" rx="1.5" fill="#2e2e2e" />
        <rect x="8" y="3" width="30" height="10" rx="2" fill="#333" />
        <polygon points="170,4 188,8 170,12" fill="#c4953a" />
        <polygon points="188,7 194,8 188,9" fill="#8B7355" />
        <rect x="160" y="3.5" width="12" height="9" rx="1" fill="#b8860b" opacity="0.5" />
      </svg>

      {/* Second pen — top-left area */}
      <svg className="absolute top-[18%] left-[2%] w-[160px] h-[12px] opacity-[0.14]" viewBox="0 0 160 12" style={{ transform: "rotate(22deg)" }}>
        <rect x="0" y="2" width="140" height="8" rx="4" fill="#8B0000" />
        <rect x="0" y="3" width="140" height="3" rx="1.5" fill="#A52A2A" />
        <polygon points="140,2 155,6 140,10" fill="#2a2a2a" />
        <polygon points="155,5.5 159,6 155,6.5" fill="#666" />
        <rect x="120" y="1.5" width="10" height="9" rx="1" fill="#C0C0C0" opacity="0.4" />
      </svg>

      {/* Stapler — bottom-left, bird's eye view */}
      <svg className="absolute bottom-[8%] left-[4%] w-[90px] h-[36px] opacity-[0.2]" viewBox="0 0 90 36" style={{ transform: "rotate(8deg)" }}>
        <rect x="5" y="4" width="80" height="28" rx="5" fill="#111" stroke="#333" strokeWidth="1" />
        <rect x="8" y="6" width="74" height="24" rx="4" fill="#1a1a1a" />
        <rect x="12" y="14" width="66" height="8" rx="2" fill="#222" />
        <rect x="10" y="8" width="70" height="5" rx="2" fill="#2a2a2a" />
        <circle cx="72" cy="18" r="3" fill="#333" stroke="#444" strokeWidth="0.5" />
        <rect x="15" y="10" width="20" height="2" rx="1" fill="#C0C0C0" opacity="0.15" />
      </svg>

      {/* Reading glasses — top-center-left */}
      <svg className="absolute top-[4%] left-[28%] w-[100px] h-[45px] opacity-[0.12]" viewBox="0 0 100 45" style={{ transform: "rotate(-5deg)" }}>
        <ellipse cx="25" cy="22" rx="18" ry="16" fill="none" stroke="#666" strokeWidth="1.5" />
        <ellipse cx="75" cy="22" rx="18" ry="16" fill="none" stroke="#666" strokeWidth="1.5" />
        <path d="M43 20 Q50 16, 57 20" fill="none" stroke="#666" strokeWidth="1.5" />
        <line x1="7" y1="18" x2="0" y2="12" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="93" y1="18" x2="100" y2="12" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="25" cy="22" rx="14" ry="12" fill="#ffffff" opacity="0.02" />
        <ellipse cx="75" cy="22" rx="14" ry="12" fill="#ffffff" opacity="0.02" />
      </svg>

      {/* Binder clips — scattered */}
      <svg className="absolute top-[42%] left-[1%] w-[28px] h-[20px] opacity-[0.18]" viewBox="0 0 28 20" style={{ transform: "rotate(30deg)" }}>
        <rect x="4" y="8" width="20" height="12" rx="2" fill="#111" stroke="#333" strokeWidth="0.8" />
        <path d="M8 8 L8 3 Q8 1, 10 1 L18 1 Q20 1, 20 3 L20 8" fill="none" stroke="#555" strokeWidth="1.2" />
      </svg>
      <svg className="absolute bottom-[25%] right-[12%] w-[24px] h-[18px] opacity-[0.14]" viewBox="0 0 28 20" style={{ transform: "rotate(-15deg)" }}>
        <rect x="4" y="8" width="20" height="12" rx="2" fill="#111" stroke="#333" strokeWidth="0.8" />
        <path d="M8 8 L8 3 Q8 1, 10 1 L18 1 Q20 1, 20 3 L20 8" fill="none" stroke="#555" strokeWidth="1.2" />
      </svg>

      {/* Paper clips — scattered around */}
      {[
        { top: "15%", left: "88%", rot: 45, op: 0.12 },
        { top: "72%", left: "92%", rot: -30, op: 0.10 },
        { top: "80%", left: "22%", rot: 60, op: 0.08 },
        { top: "30%", left: "95%", rot: 10, op: 0.10 },
      ].map((clip, i) => (
        <svg key={`clip-${i}`} className="absolute w-[18px] h-[32px]" style={{ top: clip.top, left: clip.left, transform: `rotate(${clip.rot}deg)`, opacity: clip.op }} viewBox="0 0 18 32">
          <path d="M5 2 L5 24 Q5 30, 9 30 Q13 30, 13 24 L13 8 Q13 4, 9 4 Q5 4, 5 8" fill="none" stroke="#888" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ))}

      {/* Ruler — right edge */}
      <svg className="absolute top-[30%] right-[1%] w-[16px] h-[220px] opacity-[0.1]" viewBox="0 0 16 220" style={{ transform: "rotate(2deg)" }}>
        <rect x="0" y="0" width="16" height="220" rx="1" fill="#2a2a2a" stroke="#444" strokeWidth="0.5" />
        {Array.from({ length: 22 }).map((_, i) => (
          <line key={i} x1="0" y1={i * 10} x2={i % 5 === 0 ? "10" : "5"} y2={i * 10} stroke="#666" strokeWidth={i % 5 === 0 ? "0.8" : "0.4"} />
        ))}
      </svg>

      {/* Calculator — bottom center-right */}
      <svg className="absolute bottom-[5%] right-[28%] w-[60px] h-[80px] opacity-[0.12]" viewBox="0 0 60 80" style={{ transform: "rotate(-4deg)" }}>
        <rect x="0" y="0" width="60" height="80" rx="4" fill="#111" stroke="#333" strokeWidth="1" />
        <rect x="6" y="6" width="48" height="16" rx="2" fill="#0a2a1a" />
        <rect x="30" y="9" width="20" height="10" rx="1" fill="#0f3f2a" opacity="0.6" />
        {[0, 1, 2, 3].map(row =>
          [0, 1, 2, 3].map(col => (
            <rect key={`${row}-${col}`} x={8 + col * 12} y={28 + row * 12} width="9" height="8" rx="1.5" fill={col === 3 ? "#8B4513" : "#222"} stroke="#333" strokeWidth="0.3" />
          ))
        )}
      </svg>

      {/* Loose paper — under notes area, angled */}
      <div
        className="absolute top-[55%] left-[40%] w-[130px] h-[170px] opacity-[0.04] rounded-sm"
        style={{ background: "linear-gradient(180deg, #f5f0e6 0%, #e8e0d0 100%)", transform: "rotate(12deg)" }}
      />
      <div
        className="absolute top-[8%] right-[25%] w-[110px] h-[140px] opacity-[0.035] rounded-sm"
        style={{ background: "linear-gradient(180deg, #f0ebe0 0%, #e0d8c8 100%)", transform: "rotate(-8deg)" }}
      />

      {/* Rubber band */}
      <svg className="absolute bottom-[18%] left-[18%] w-[35px] h-[20px] opacity-[0.08]" viewBox="0 0 35 20" style={{ transform: "rotate(25deg)" }}>
        <ellipse cx="17" cy="10" rx="15" ry="8" fill="none" stroke="#8B6914" strokeWidth="2" />
      </svg>

      {/* Tape dispenser — top right area */}
      <svg className="absolute top-[35%] right-[8%] w-[50px] h-[35px] opacity-[0.12]" viewBox="0 0 50 35" style={{ transform: "rotate(-6deg)" }}>
        <path d="M5 30 L5 10 Q5 5, 10 5 L40 5 Q45 5, 45 10 L45 25 Q45 30, 40 30 Z" fill="#111" stroke="#333" strokeWidth="0.8" />
        <circle cx="25" cy="20" r="8" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
        <circle cx="25" cy="20" r="3" fill="#222" />
        <path d="M33 15 L48 10" stroke="#C0C0C0" strokeWidth="0.8" opacity="0.3" />
      </svg>

      {/* Small eraser */}
      <div
        className="absolute top-[70%] left-[8%] w-[30px] h-[15px] rounded-[3px] opacity-[0.1]"
        style={{ background: "linear-gradient(135deg, #d4a94c 0%, #b8860b 100%)", transform: "rotate(-18deg)" }}
      />

      {/* Thumbtacks scattered */}
      {[
        { top: "25%", left: "5%", color: "#e74c3c" },
        { top: "88%", left: "45%", color: "#3498db" },
        { top: "12%", left: "70%", color: "#2ecc71" },
      ].map((pin, i) => (
        <svg key={`pin-${i}`} className="absolute w-[10px] h-[10px]" style={{ top: pin.top, left: pin.left, opacity: 0.15 }} viewBox="0 0 10 10">
          <circle cx="5" cy="5" r="4" fill={pin.color} />
          <circle cx="4" cy="4" r="1.5" fill="#fff" opacity="0.3" />
        </svg>
      ))}

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
  { left: "3%", top: "10%" },
  { left: "33%", top: "5%" },
  { left: "64%", top: "8%" },
  { left: "8%", top: "52%" },
  { left: "48%", top: "50%" },
];

export const ResourcesSection = (): JSX.Element => {
  const [notes, setNotes] = useState(initialNotes);
  const [askTopic, setAskTopic] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

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
        >
          <div
            ref={boardRef}
            className="relative w-full min-h-[600px] md:min-h-[580px] lg:min-h-[620px] rounded-2xl overflow-hidden"
            style={{
              touchAction: "none",
              background: `
                linear-gradient(175deg, #3d2b1a 0%, #2e1f10 20%, #3a2816 40%, #2c1d0e 60%, #362414 80%, #2a1c0d 100%)
              `,
              boxShadow: "inset 0 2px 30px rgba(0,0,0,0.5), inset 0 -2px 20px rgba(0,0,0,0.3), 0 10px 50px rgba(0,0,0,0.6)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.08]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    92deg,
                    transparent,
                    transparent 80px,
                    rgba(0,0,0,0.15) 80px,
                    rgba(0,0,0,0.15) 81px,
                    transparent 81px,
                    transparent 200px
                  ),
                  repeating-linear-gradient(
                    88deg,
                    transparent,
                    transparent 150px,
                    rgba(255,255,255,0.05) 150px,
                    rgba(255,255,255,0.05) 151px,
                    transparent 151px,
                    transparent 320px
                  )
                `,
              }}
            />

            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    175deg,
                    transparent,
                    transparent 3px,
                    rgba(139,90,43,0.3) 3px,
                    rgba(139,90,43,0.3) 4px
                  )
                `,
              }}
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 40% 30%, rgba(255,220,150,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(0,0,0,0.15) 0%, transparent 50%)",
              }}
            />

            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black/40" />

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

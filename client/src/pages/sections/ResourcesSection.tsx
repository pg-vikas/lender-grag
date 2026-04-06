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
      <div
        className="absolute top-[12%] right-[8%] w-[70px] h-[70px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, transparent 28px, rgba(139,90,43,0.5) 29px, rgba(139,90,43,0.3) 33px, transparent 34px)",
        }}
      />

      <svg className="absolute bottom-[15%] right-[5%] w-[180px] h-[14px] opacity-[0.12]" viewBox="0 0 180 14" style={{ transform: "rotate(-8deg)" }}>
        <rect x="0" y="3" width="160" height="8" rx="4" fill="#2a2a2a" />
        <rect x="0" y="4" width="160" height="3" rx="1.5" fill="#3a3a3a" />
        <polygon points="160,3 180,7 160,11" fill="#c4953a" />
        <rect x="155" y="2" width="8" height="10" rx="1" fill="#b8860b" opacity="0.6" />
      </svg>

      <svg className="absolute top-[65%] left-[3%] w-[40px] h-[30px] opacity-[0.1]" viewBox="0 0 40 30" style={{ transform: "rotate(15deg)" }}>
        <path d="M5 15 Q5 5, 20 5 Q35 5, 35 15 Q35 5, 20 5" fill="none" stroke="#888" strokeWidth="1.5" />
        <path d="M5 15 L5 25 Q5 28, 8 28 L12 28" fill="none" stroke="#888" strokeWidth="1.5" />
        <path d="M35 15 L35 25 Q35 28, 32 28 L28 28" fill="none" stroke="#888" strokeWidth="1.5" />
      </svg>

      <svg className="absolute top-[8%] left-[45%] w-[28px] h-[28px] opacity-[0.08]" viewBox="0 0 28 28" style={{ transform: "rotate(25deg)" }}>
        <path d="M4 14 Q4 4, 14 4 Q24 4, 24 14 Q24 24, 14 24 Q12 24, 12 22 L8 18 Q4 14, 4 14Z" fill="none" stroke="#666" strokeWidth="1.2" />
      </svg>

      <div className="absolute bottom-[8%] left-[25%] w-[90px] h-[55px] rounded-[6px] opacity-[0.06] border border-white/10"
        style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)", transform: "rotate(5deg)" }}
      >
        <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[30px] h-[2px] rounded-full bg-white/20" />
      </div>

      <svg className="absolute top-[38%] right-[3%] w-[22px] h-[22px] opacity-[0.06]" viewBox="0 0 22 22" style={{ transform: "rotate(-20deg)" }}>
        <rect x="2" y="2" width="18" height="18" rx="2" fill="none" stroke="#aaa" strokeWidth="0.8" />
        <line x1="2" y1="6" x2="20" y2="6" stroke="#aaa" strokeWidth="0.5" />
        <line x1="6" y1="2" x2="6" y2="6" stroke="#aaa" strokeWidth="0.5" />
      </svg>

      <div className="absolute top-[75%] right-[30%] flex gap-[2px] opacity-[0.04]" style={{ transform: "rotate(-12deg)" }}>
        {[0,1,2].map(i => (
          <div key={i} className="w-[3px] h-[3px] rounded-full bg-white" />
        ))}
      </div>
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
            className="relative w-full min-h-[540px] md:min-h-[500px] rounded-2xl overflow-hidden"
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

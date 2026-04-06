import { BookOpen, CheckSquare, Home, FileText, AlertTriangle, MessageCircle, X, Send, GripVertical, Pencil, Check, Pin } from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useState, useRef, useCallback } from "react";

interface StickyNote {
  id: number;
  icon: typeof BookOpen;
  title: string;
  desc: string;
  color: string;
  bg: string;
  rotate: number;
  x: number;
  y: number;
}

const initialNotes: StickyNote[] = [
  { id: 0, icon: BookOpen, title: "First-Time Buyer Guide", desc: "Everything you need to know before buying your first home — from credit to closing.", color: "#fbbf24", bg: "#fef3c7", rotate: -3, x: 0, y: 0 },
  { id: 1, icon: CheckSquare, title: "Pre-Approval Checklist", desc: "The documents and steps needed to get pre-approved fast and stress-free.", color: "#34d399", bg: "#d1fae5", rotate: 2, x: 0, y: 0 },
  { id: 2, icon: Home, title: "How Much House Can I Afford?", desc: "Understand your real budget based on what lenders actually look for.", color: "#60a5fa", bg: "#dbeafe", rotate: -1.5, x: 0, y: 0 },
  { id: 3, icon: FileText, title: "Documents You'll Need", desc: "A complete list of what to prepare before starting your mortgage application.", color: "#f472b6", bg: "#fce7f3", rotate: 3, x: 0, y: 0 },
  { id: 4, icon: AlertTriangle, title: "Mortgage Mistakes to Avoid", desc: "Five common pitfalls that cost borrowers time, money, and deals.", color: "#fb923c", bg: "#ffedd5", rotate: -2.5, x: 0, y: 0 },
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
  const dragControls = useDragControls();
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
      dragControls={dragControls}
      dragConstraints={constraintsRef}
      dragElastic={0.1}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      initial={{ opacity: 0, scale: 0.7, rotate: note.rotate * 2 }}
      animate={{ opacity: 1, scale: 1, rotate: note.rotate }}
      transition={{ type: "spring", stiffness: 200, damping: 18, delay: note.id * 0.1 }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
      whileDrag={{ scale: 1.08, rotate: 0, zIndex: 100, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
      style={{ zIndex: isDragging ? 100 : 10 + note.id }}
      data-testid={`sticky-note-${note.id}`}
    >
      <div
        className="w-[240px] md:w-[260px] rounded-2xl p-5 pb-4 shadow-lg relative group cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: note.bg,
          boxShadow: `0 4px 20px ${note.color}25, 0 8px 32px rgba(0,0,0,0.08)`,
        }}
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2">
          <Pin className="w-4 h-4 drop-shadow-sm" style={{ color: note.color }} />
        </div>

        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {!isEditing && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
              data-testid={`edit-note-${note.id}`}
            >
              <Pencil className="w-3 h-3" style={{ color: note.color }} />
            </button>
          )}
        </div>

        <div className="flex items-start gap-3 mt-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ backgroundColor: `${note.color}20` }}
          >
            <Icon className="w-4.5 h-4.5" style={{ color: note.color }} />
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-[14px] font-bold bg-white/60 rounded-lg px-2 py-1 border-none outline-none focus:bg-white/80 transition-colors"
                style={{ color: "#1a1a1a" }}
                onClick={(e) => e.stopPropagation()}
                data-testid={`input-title-${note.id}`}
              />
            ) : (
              <h3 className="text-[14px] font-bold leading-snug" style={{ color: "#1a1a1a" }}>{note.title}</h3>
            )}
          </div>
        </div>

        <div className="mt-3">
          {isEditing ? (
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={3}
              className="w-full text-[12px] bg-white/60 rounded-lg px-2 py-1.5 border-none outline-none resize-none focus:bg-white/80 transition-colors leading-relaxed"
              style={{ color: "#555" }}
              onClick={(e) => e.stopPropagation()}
              data-testid={`input-desc-${note.id}`}
            />
          ) : (
            <p className="text-[12px] leading-relaxed" style={{ color: "#666" }}>{note.desc}</p>
          )}
        </div>

        {isEditing ? (
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => { e.stopPropagation(); handleSave(); }}
              className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-white/70 hover:bg-white transition-colors"
              style={{ color: note.color }}
              data-testid={`save-note-${note.id}`}
            >
              <Check className="w-3 h-3" /> Save
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleCancel(); }}
              className="flex items-center gap-1 text-[11px] font-medium px-3 py-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-gray-500 transition-colors"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between mt-3 pt-2 border-t" style={{ borderColor: `${note.color}20` }}>
            <button
              onClick={(e) => { e.stopPropagation(); onAskGreg(note.title); }}
              className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-white/50 transition-colors"
              style={{ color: note.color }}
              data-testid={`ask-greg-${note.id}`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Ask Greg
            </button>
            <div className="flex items-center gap-1 text-[10px] font-medium opacity-40">
              <GripVertical className="w-3 h-3" />
              drag me
            </div>
          </div>
        )}

        <div
          className="absolute -bottom-1 left-3 right-3 h-3 rounded-b-2xl -z-10 blur-[2px]"
          style={{ backgroundColor: note.color, opacity: 0.12 }}
        />
      </div>
    </motion.div>
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
  { left: "2%", top: "8%" },
  { left: "36%", top: "4%" },
  { left: "68%", top: "10%" },
  { left: "10%", top: "52%" },
  { left: "50%", top: "50%" },
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
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {[...Array(20)].map((_, i) => (
          <div key={`dh-${i}`} className="absolute left-0 right-0 h-px bg-white/[0.015]" style={{ top: `${5 * (i + 1)}%` }} />
        ))}
        {[...Array(20)].map((_, i) => (
          <div key={`dv-${i}`} className="absolute top-0 bottom-0 w-px bg-white/[0.015]" style={{ left: `${5 * (i + 1)}%` }} />
        ))}
      </div>

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
          className="flex items-center justify-center gap-3 mb-10"
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

        <div
          ref={boardRef}
          className="relative w-full min-h-[520px] md:min-h-[480px] rounded-3xl bg-white/[0.02] border border-white/[0.05] overflow-hidden"
          style={{ touchAction: "none" }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-6 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/30" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/30" />
              <div className="w-3 h-3 rounded-full bg-green-400/30" />
            </div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/10 text-[11px] font-mono tracking-wider">
              greg's board
            </div>
          </div>

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

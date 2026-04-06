import { BookOpen, CheckSquare, Home, FileText, AlertTriangle, MessageCircle, X, Send, GripVertical, Pencil, Check } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import deskImg from "@assets/shutterstock_2137168113_1775459050359.jpg";

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
  { id: 0, icon: BookOpen, title: "First-Time Buyer Guide", desc: "Everything you need to know before buying your first home — from credit to closing.", color: "#b8860b", bg: "#fef9e7", bgDark: "#f5edcd", rotate: -2.8, curlCorner: "br", curlIntensity: 0.7 },
  { id: 1, icon: CheckSquare, title: "Pre-Approval Checklist", desc: "The documents and steps needed to get pre-approved fast and stress-free.", color: "#1a8a5e", bg: "#edf9f0", bgDark: "#d6f0dc", rotate: 2.2, curlCorner: "bl", curlIntensity: 0.5 },
  { id: 2, icon: Home, title: "How Much House Can I Afford?", desc: "Understand your real budget based on what lenders actually look for.", color: "#3366aa", bg: "#eef4fb", bgDark: "#d8e8f8", rotate: -1.4, curlCorner: "br", curlIntensity: 0.6 },
  { id: 3, icon: FileText, title: "Documents You'll Need", desc: "A complete list of what to prepare before starting your mortgage application.", color: "#b8447a", bg: "#fcf0f5", bgDark: "#f5dce8", rotate: 3.0, curlCorner: "tr", curlIntensity: 0.55 },
  { id: 4, icon: AlertTriangle, title: "Mortgage Mistakes to Avoid", desc: "Five common pitfalls that cost borrowers time, money, and deals.", color: "#c76a20", bg: "#fef5ec", bgDark: "#f8e6d0", rotate: -1.8, curlCorner: "bl", curlIntensity: 0.65 },
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

  const pFactor = 1.2 + note.id * 0.4;
  const parallaxX = useTransform(mouseX, [0, boardBounds.width || 1], [-pFactor, pFactor]);
  const parallaxY = useTransform(mouseY, [0, boardBounds.height || 1], [-pFactor * 0.6, pFactor * 0.6]);
  const smoothX = useSpring(parallaxX, { stiffness: 40, damping: 18 });
  const smoothY = useSpring(parallaxY, { stiffness: 40, damping: 18 });

  const handleSave = () => { onEdit(note.id, editTitle, editDesc); setIsEditing(false); };
  const handleCancel = () => { setEditTitle(note.title); setEditDesc(note.desc); setIsEditing(false); };

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
    if (isDragging) return `${SHADOW_DX * 6}px ${SHADOW_DY * 6}px 50px rgba(0,0,0,0.55), ${SHADOW_DX * 2}px ${SHADOW_DY * 2}px 15px rgba(0,0,0,0.35), 0 0 80px rgba(0,0,0,0.12)`;
    if (isLifted) return `${SHADOW_DX * 4}px ${SHADOW_DY * 4}px 35px rgba(0,0,0,0.5), ${SHADOW_DX * 1.5}px ${SHADOW_DY * 1.5}px 10px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)`;
    return `${SHADOW_DX * 1.5}px ${SHADOW_DY * 1.5}px 16px rgba(0,0,0,0.4), ${SHADOW_DX * 0.5}px ${SHADOW_DY * 0.5}px 5px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.2)`;
  }, [isDragging, isLifted]);

  return (
    <motion.div
      className="absolute touch-none select-none"
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.02}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
      initial={{ opacity: 0, scale: 0.4, rotate: note.rotate * 5, y: 80 }}
      animate={{ opacity: 1, scale: 1, rotate: note.rotate, y: 0 }}
      transition={{ type: "spring", stiffness: 90, damping: 13, delay: 0.6 + note.id * 0.18 }}
      whileHover={{ scale: 1.035, rotate: note.rotate * 0.2, zIndex: 50, y: -8, transition: { type: "spring", stiffness: 200, damping: 18 } }}
      whileDrag={{ scale: 1.06, rotate: 0, zIndex: 100, transition: { type: "spring", stiffness: 250, damping: 18 } }}
      style={{ zIndex: isDragging ? 100 : isLifted ? 60 : 10 + note.id, x: smoothX, y: smoothY }}
      onHoverStart={() => setIsLifted(true)}
      onHoverEnd={() => setIsLifted(false)}
      data-testid={`sticky-note-${note.id}`}
    >
      <div
        className="w-[200px] md:w-[220px] relative group cursor-grab active:cursor-grabbing"
        style={{ boxShadow: shadowStyle, transition: "box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div
          className="rounded-[2px] relative overflow-hidden h-full"
          style={{
            background: `linear-gradient(168deg, ${note.bg} 0%, ${note.bgDark} 100%)`,
            filter: `url(#${PAPER_NOISE_ID})`,
          }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 21px, rgba(0,0,0,0.2) 21px, rgba(0,0,0,0.2) 22px)" }} />

          <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: `linear-gradient(90deg, ${note.color}aa, ${note.color}66)` }} />

          <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(${LIGHT_ANGLE}deg, rgba(255,255,255,0.15) 0%, transparent 35%, rgba(0,0,0,0.03) 90%)` }} />

          <div style={curlStyle as any} />

          <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.025) 0%, transparent 100%)" }} />

          <div className="p-3.5 pb-3 relative flex flex-col h-full">
            <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {!isEditing && (
                <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="w-5 h-5 rounded flex items-center justify-center hover:bg-black/10 transition-colors" data-testid={`edit-note-${note.id}`}>
                  <Pencil className="w-2.5 h-2.5" style={{ color: note.color }} />
                </button>
              )}
            </div>

            <div className="flex items-start gap-2.5 relative">
              <div className="w-[28px] h-[28px] rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${note.color}12`, border: `1px solid ${note.color}18` }}>
                <Icon className="w-3.5 h-3.5" style={{ color: note.color }} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                {isEditing ? (
                  <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full text-[12px] font-bold bg-white/60 rounded px-1.5 py-0.5 border-none outline-none focus:bg-white/80" style={{ color: "#1a1a1a" }} onClick={(e) => e.stopPropagation()} data-testid={`input-title-${note.id}`} />
                ) : (
                  <h3 className="text-[15px] font-bold leading-snug" style={{ color: "#222", fontFamily: "'Caveat', cursive" }}>{note.title}</h3>
                )}
              </div>
            </div>

            <div className="mt-2 relative flex-1">
              {isEditing ? (
                <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} className="w-full text-[11px] bg-white/60 rounded px-1.5 py-1 border-none outline-none resize-none focus:bg-white/80 leading-relaxed" style={{ color: "#444" }} onClick={(e) => e.stopPropagation()} data-testid={`input-desc-${note.id}`} />
              ) : (
                <p className="text-[13px] leading-[1.5]" style={{ color: "#555", fontFamily: "'Caveat', cursive" }}>{note.desc}</p>
              )}
            </div>

            {isEditing ? (
              <div className="flex gap-1.5 mt-2 relative">
                <button onClick={(e) => { e.stopPropagation(); handleSave(); }} className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-white/60 hover:bg-white/80 transition-colors" style={{ color: note.color }} data-testid={`save-note-${note.id}`}>
                  <Check className="w-2.5 h-2.5" /> Save
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleCancel(); }} className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-black/5 hover:bg-black/10 text-gray-500 transition-colors">
                  <X className="w-2.5 h-2.5" /> Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-2 pt-[6px] border-t relative" style={{ borderColor: `${note.color}10` }}>
                <button onClick={(e) => { e.stopPropagation(); onAskGreg(note.title); }} className="flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded hover:bg-white/35 transition-colors" style={{ color: note.color }} data-testid={`ask-greg-${note.id}`}>
                  <MessageCircle className="w-3 h-3" /> <span style={{ fontFamily: "'Caveat', cursive" }}>Ask Greg</span>
                </button>
                <div className="flex items-center gap-0.5 text-[8px] font-medium opacity-20">
                  <GripVertical className="w-2.5 h-2.5" /> <span style={{ fontFamily: "'Caveat', cursive" }}>drag</span>
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
            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Type your question here..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-[14px] placeholder:text-white/20 outline-none focus:border-[#d4a94c]/40 resize-none transition-colors" data-testid="input-ask-greg" />
            <motion.button onClick={() => { if (question.trim()) setSubmitted(true); }} className="w-full mt-4 h-12 rounded-xl bg-gradient-to-r from-[#d4a94c] to-[#c4953a] text-[#0c0c0c] font-bold text-[14px] flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#d4a94c]/20 transition-shadow" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} data-testid="button-send-question"><Send className="w-4 h-4" />Send to Greg</motion.button>
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

const notePositions = [
  { left: "10%", top: "35%" },
  { left: "35%", top: "30%" },
  { left: "60%", top: "34%" },
  { left: "18%", top: "62%" },
  { left: "48%", top: "64%" },
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
    <section className="py-24 lg:py-32 bg-[#0c0c0c] relative overflow-hidden">
      <PaperTextureDefs />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        <motion.div className="text-center mb-6" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="text-[#d4a94c] font-bold text-[13px] uppercase tracking-[0.2em]">Resources</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-3 tracking-[-0.02em]" data-testid="text-resources-heading">
            Learn Before You{" "}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a94c] to-[#f0d88a]">Borrow</span>
          </h2>
          <p className="text-white/30 text-[15px] mt-3 max-w-[460px] mx-auto leading-relaxed">
            Drag, edit, and explore these notes — or ask Greg a question directly.
          </p>
        </motion.div>

        <motion.div className="flex items-center justify-center gap-3 mb-8 flex-wrap" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          {[
            { label: "Drag to rearrange", icon: GripVertical },
            { label: "Click pencil to edit", icon: Pencil },
            { label: "Ask Greg anything", icon: MessageCircle },
          ].map((tip, i) => (
            <div key={i} className="flex items-center gap-1.5 text-white/20 text-[11px] font-medium px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
              <tip.icon className="w-3 h-3" />{tip.label}
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full"
      >
        <div
          ref={boardRef}
          onMouseMove={handleMouseMove}
          className="relative w-full overflow-hidden"
          style={{
            touchAction: "none",
            minHeight: "620px",
            aspectRatio: "16 / 9",
            maxHeight: "85vh",
          }}
        >
          <img
            src={deskImg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center top" }}
            draggable={false}
          />

          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.35) 100%)" }} />

          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.25) 100%)" }} />

          <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 2px 20px rgba(0,0,0,0.3), inset 0 -2px 20px rgba(0,0,0,0.2)" }} />

          {notes.map((note, i) => (
            <div key={note.id} className="absolute" style={{ left: notePositions[i]?.left ?? "20%", top: notePositions[i]?.top ?? "20%" }}>
              <StickyNoteCard note={note} onEdit={handleEdit} onAskGreg={(topic) => setAskTopic(topic)} constraintsRef={boardRef} mouseX={mouseX} mouseY={mouseY} boardBounds={boardBounds} />
            </div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {askTopic && <AskGregModal topic={askTopic} onClose={() => setAskTopic(null)} />}
      </AnimatePresence>
    </section>
  );
};

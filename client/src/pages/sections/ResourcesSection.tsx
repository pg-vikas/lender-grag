import { BookOpen, CheckSquare, Home, FileText, AlertTriangle, MessageCircle, X, Send, GripVertical, Pencil, Check, Phone, User, Signal, Wifi, BatteryFull } from "lucide-react";
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

const notePositions = [
  { left: "10%", top: "35%" },
  { left: "35%", top: "30%" },
  { left: "60%", top: "34%" },
  { left: "16%", top: "65%" },
  { left: "47%", top: "56%" },
];

export const ResourcesSection = (): JSX.Element => {
  const [notes, setNotes] = useState(initialNotes);
  const [askTopic, setAskTopic] = useState<string | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [boardBounds, setBoardBounds] = useState({ width: 0, height: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
    setMouseY(e.clientY - rect.top);
    setBoardBounds({ width: rect.width, height: rect.height });
  }, []);

  const handleEdit = useCallback((id: number, title: string, desc: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, title, desc } : n)));
  }, []);

  return (
    <section className="pt-24 lg:pt-32 pb-0 bg-[#0c0c0c] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        <motion.div className="text-center mb-6" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="text-[#d4a94c] font-bold text-[13px] uppercase tracking-[0.24em] mb-3">Resources</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-[-0.03em]">Learn Before You Borrow</h2>
        </motion.div>

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
              minHeight: "720px",
              aspectRatio: "16 / 10",
              maxHeight: "90vh",
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

        <AnimatePresence>{askTopic && <AskGregModal topic={askTopic} onClose={() => setAskTopic(null)} />}</AnimatePresence>
      </div>
    </section>
  );
};
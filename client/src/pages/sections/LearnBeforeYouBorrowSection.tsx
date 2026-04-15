import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckSquare2, FileText, Home, MessageCircle, ShieldAlert } from "lucide-react";
import learnBeforeBorrowImg from "@assets/image_1776214399155.png";

const notes = [
  {
    title: "First-Time Buyer Guide",
    desc: "Everything you need to know before buying your first home.",
    icon: BookOpen,
    color: "#f4c542",
    rotate: -3,
    left: "7%",
    top: "64%",
  },
  {
    title: "Pre-Approval Checklist",
    desc: "The documents and steps to get pre-approved fast.",
    icon: CheckSquare2,
    color: "#68cf6b",
    rotate: 2,
    left: "33%",
    top: "55%",
  },
  {
    title: "How Much House Can I Afford?",
    desc: "Understand your real budget before you shop.",
    icon: Home,
    color: "#76c9ea",
    rotate: -2,
    left: "61%",
    top: "60%",
  },
  {
    title: "Documents You'll Need",
    desc: "A simple list of what to gather before applying.",
    icon: FileText,
    color: "#f6a6d8",
    rotate: 3,
    left: "22%",
    top: "84%",
  },
  {
    title: "Mortgage Mistakes to Avoid",
    desc: "Common issues that can slow down approval.",
    icon: ShieldAlert,
    color: "#f0ad4c",
    rotate: -2,
    left: "52%",
    top: "82%",
  },
];

export function LearnBeforeYouBorrowSection() {
  const cardStyles = useMemo(() => notes.map((note) => ({
    background: `linear-gradient(180deg, ${note.color} 0%, color-mix(in srgb, ${note.color} 85%, black 15%) 100%)`,
  })), []);

  return (
    <section className="relative overflow-hidden bg-[#f7f5ef] py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[12px] font-bold tracking-[0.35em] uppercase text-[#a98a2d] mb-3">Drag to rearrange</p>
          <h2 className="text-[44px] md:text-[58px] leading-none font-black text-[#111]">
            Learn Before You <span className="text-[#c89b2c]">Borrow</span>
          </h2>
          <p className="mt-4 text-[15px] md:text-[16px] text-[#666]">
            Drag, edit, and explore these notes — or ask Greg a question directly.
          </p>
        </div>

        <div className="relative rounded-[2rem] overflow-hidden border border-black/5 shadow-[0_28px_90px_rgba(0,0,0,0.16)] bg-[#8b5a3c] min-h-[520px]">
          <img
            src={learnBeforeBorrowImg}
            alt="Mortgage education workspace"
            className="absolute inset-0 w-full h-full object-cover opacity-92"
            data-testid="img-learn-before-borrow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-black/8 to-transparent" />

          <div className="absolute top-5 right-5 w-[124px] h-[124px] rounded-full bg-[#2d2621]/85 border border-white/10 shadow-2xl flex items-center justify-center">
            <div className="w-18 h-18 rounded-full bg-[#e6ece7] flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#3d322b] flex items-center justify-center text-white">
                <MessageCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="absolute top-8 left-8 right-8 h-16 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/70 shadow-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#a98a2d]">Learn Before You Borrow</p>
              <p className="text-[13px] text-[#777]">Educate yourself before you start the loan process</p>
            </div>
          </div>

          {notes.map((note, index) => {
            const style = cardStyles[index];
            return (
              <motion.div
                key={note.title}
                initial={{ opacity: 0, y: 24, rotate: note.rotate }}
                animate={{ opacity: 1, y: 0, rotate: note.rotate }}
                transition={{ delay: 0.15 + index * 0.08, duration: 0.45 }}
                className="absolute w-[180px] md:w-[210px] p-4 rounded-[0.9rem] shadow-[0_16px_30px_rgba(0,0,0,0.18)] border border-black/10"
                style={{
                  left: note.left,
                  top: note.top,
                  background: style.background,
                }}
                data-testid={`card-borrow-note-${index}`}
              >
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[#222] shrink-0">
                    <note.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[16px] leading-tight font-bold text-[#1c160f]">{note.title}</h3>
                    <p className="mt-1 text-[12px] leading-snug text-[#2a2218]/80">{note.desc}</p>
                  </div>
                </div>
                <p className="mt-3 text-[11px] font-semibold text-[#1c160f]/70">Click to ask Greg</p>
              </motion.div>
            );
          })}

          <div className="absolute left-6 bottom-6 flex items-center gap-3 rounded-full bg-white/88 px-4 py-3 shadow-lg border border-white/70">
            <div className="w-11 h-11 rounded-full bg-[#1b1b1b] flex items-center justify-center text-white">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#111]">Ask Greg directly</p>
              <p className="text-[11px] text-[#666]">Questions answered in your portal</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
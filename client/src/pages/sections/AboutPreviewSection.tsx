import { ArrowRight, CheckCircle2, Award, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { useRef } from "react";
import gregPhoto from "@assets/bccb6149-2450-49bb-bcc6-1719871865b3_1775248779071.png";
import badgeLogo from "@assets/lender-greg-badge-transparent.png";
import wideBadge from "@assets/Sleek_Lender_Greg_logo_design_1775464646399.png";

const highlights = [
  { icon: Award, stat: "15+", label: "Years in Lending" },
  { icon: Users, stat: "500+", label: "Families Helped" },
  { icon: Clock, stat: "21", label: "Day Avg Close" },
];

const bullets = [
  "Strategic financing guidance tailored to your goals",
  "Clear, responsive communication throughout the process",
  "Focused on smooth closings and strong outcomes",
];

const BP = "#3a6a5c";
const G1 = "#d4a94c";
const G2 = "#f0d88a";
const G3 = "#c4953a";

const drawFaint = (delay: number, dur = 1.6) => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 0.25,
    transition: { pathLength: { delay, duration: dur, ease: [0.4, 0, 0.2, 1] }, opacity: { delay, duration: 0.3 } },
  },
});

const drawSolid = (delay: number, dur = 1.2) => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay, duration: dur, ease: [0.25, 0.1, 0.25, 1] }, opacity: { delay, duration: 0.2 } },
  },
});

const fadeIn = (delay: number, dur = 0.8, finalOpacity = 1) => ({
  hidden: { opacity: 0 },
  visible: { opacity: finalOpacity, transition: { delay, duration: dur, ease: "easeOut" } },
});

const solidify = (delay: number, dur = 1.0) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay, duration: dur, ease: [0.16, 1, 0.3, 1] } },
});

const mainRoof = "M 170 285 L 380 155 L 560 285";
const garageRoof = "M 560 285 L 680 225 L 790 285";
const mainWallL = 200;
const mainWallR = 555;
const mainTop = 285;
const mainBot = 460;
const garL = 565;
const garR = 780;
const garTop = 285;
const garBot = 440;
const rainGlyphs = [
  { left: "8%", top: "-2%", symbol: "⌂", size: 14, delay: 0 },
  { left: "20%", top: "8%", symbol: "$", size: 13, delay: 0.45 },
  { left: "35%", top: "0%", symbol: "☂", size: 12, delay: 0.9 },
  { left: "52%", top: "6%", symbol: "⌂", size: 15, delay: 1.35 },
  { left: "68%", top: "2%", symbol: "$", size: 13, delay: 1.8 },
  { left: "84%", top: "10%", symbol: "☂", size: 12, delay: 2.2 },
  { left: "14%", top: "28%", symbol: "$", size: 14, delay: 0.6 },
  { left: "31%", top: "24%", symbol: "⌂", size: 13, delay: 1.05 },
  { left: "49%", top: "30%", symbol: "$", size: 12, delay: 1.5 },
  { left: "66%", top: "26%", symbol: "⌂", size: 15, delay: 1.95 },
  { left: "79%", top: "34%", symbol: "$", size: 13, delay: 2.35 },
  { left: "6%", top: "54%", symbol: "☂", size: 12, delay: 0.2 },
  { left: "24%", top: "60%", symbol: "⌂", size: 14, delay: 0.7 },
  { left: "43%", top: "56%", symbol: "$", size: 13, delay: 1.15 },
  { left: "61%", top: "62%", symbol: "☂", size: 12, delay: 1.6 },
  { left: "82%", top: "58%", symbol: "⌂", size: 15, delay: 2.05 },
];

function HouseBuildAnimation({ inView }: { inView: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <motion.svg
        viewBox="0 0 1000 600"
        className="w-full h-full max-w-[1200px]"
        preserveAspectRatio="xMidYMid meet"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.22 }}
      >
        <defs>
          <linearGradient id="gh" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={G3} />
            <stop offset="50%" stopColor={G2} />
            <stop offset="100%" stopColor={G3} />
          </linearGradient>
          <linearGradient id="gv" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={G2} />
            <stop offset="100%" stopColor={G3} />
          </linearGradient>
          <linearGradient id="gd" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={G1} />
            <stop offset="100%" stopColor={G2} />
          </linearGradient>
          <linearGradient id="wallFillMain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={G2} stopOpacity="0.08" />
            <stop offset="100%" stopColor={G1} stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="wallFillGar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={G3} stopOpacity="0.06" />
            <stop offset="100%" stopColor={G1} stopOpacity="0.015" />
          </linearGradient>
          <linearGradient id="roofFillMain" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={G2} stopOpacity="0.07" />
            <stop offset="100%" stopColor={G1} stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="roofFillGar" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={G3} stopOpacity="0.05" />
            <stop offset="100%" stopColor={G1} stopOpacity="0.015" />
          </linearGradient>
          <linearGradient id="sweep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={G2} stopOpacity="0" />
            <stop offset="40%" stopColor={G2} stopOpacity="0.3" />
            <stop offset="50%" stopColor={G2} stopOpacity="0.5" />
            <stop offset="60%" stopColor={G2} stopOpacity="0.3" />
            <stop offset="100%" stopColor={G2} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="halo" cx="50%" cy="60%" r="55%">
            <stop offset="0%" stopColor={G2} stopOpacity="0.08" />
            <stop offset="60%" stopColor={G1} stopOpacity="0.03" />
            <stop offset="100%" stopColor={G1} stopOpacity="0" />
          </radialGradient>
          <filter id="edgeGlow">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="wideGlow">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="sweepClip">
            <rect x="140" y="140" width="680" height="350" />
          </clipPath>
        </defs>

        {/* ══════ PHASE 1: FAINT BLUEPRINT LINES ══════ */}

        <motion.line x1={140} y1={mainBot+5} x2={860} y2={mainBot+5} stroke={BP} strokeWidth="0.5" strokeDasharray="6,10" variants={drawFaint(0, 1.2)} />
        <motion.line x1={140} y1={mainBot+8} x2={860} y2={mainBot+8} stroke={BP} strokeWidth="0.3" strokeDasharray="2,12" variants={drawFaint(0.1, 1.0)} />

        <motion.rect x={mainWallL} y={mainTop} width={mainWallR - mainWallL} height={mainBot - mainTop} fill="none" stroke={BP} strokeWidth="0.5" strokeDasharray="8,6" variants={drawFaint(0.3, 1.4)} />
        <motion.rect x={garL} y={garTop} width={garR - garL} height={garBot - garTop} fill="none" stroke={BP} strokeWidth="0.4" strokeDasharray="6,8" variants={drawFaint(0.5, 1.2)} />

        <motion.path d={mainRoof} fill="none" stroke={BP} strokeWidth="0.5" strokeDasharray="8,6" variants={drawFaint(0.7, 1.4)} />
        <motion.path d={garageRoof} fill="none" stroke={BP} strokeWidth="0.4" strokeDasharray="6,8" variants={drawFaint(0.9, 1.2)} />

        {[mainWallL+60, mainWallL+140, mainWallL+220, mainWallL+300].map((x, i) => (
          <motion.line key={`bps-${i}`} x1={x} y1={mainTop} x2={x} y2={mainBot} stroke={BP} strokeWidth="0.3" strokeDasharray="4,10" variants={drawFaint(1.0 + i * 0.08, 1.0)} />
        ))}

        <motion.line x1={mainWallL} y1={(mainTop + mainBot) / 2} x2={mainWallR} y2={(mainTop + mainBot) / 2} stroke={BP} strokeWidth="0.3" strokeDasharray="4,10" variants={drawFaint(1.3, 0.8)} />

        {[garL + 50, garL + 120].map((x, i) => (
          <motion.line key={`bpg-${i}`} x1={x} y1={garTop} x2={x} y2={garBot} stroke={BP} strokeWidth="0.3" strokeDasharray="4,10" variants={drawFaint(1.1 + i * 0.08, 0.9)} />
        ))}

        <motion.rect x={mainWallL + 40} y={mainTop + 30} width={55} height={55} fill="none" stroke={BP} strokeWidth="0.4" strokeDasharray="4,6" variants={drawFaint(1.4, 0.8)} />
        <motion.rect x={mainWallL + 160} y={mainTop + 30} width={55} height={55} fill="none" stroke={BP} strokeWidth="0.4" strokeDasharray="4,6" variants={drawFaint(1.5, 0.8)} />
        <motion.rect x={mainWallL + 280} y={mainTop + 30} width={45} height={45} fill="none" stroke={BP} strokeWidth="0.4" strokeDasharray="4,6" variants={drawFaint(1.6, 0.8)} />
        <motion.rect x={mainWallL + 120} y={mainBot - 80} width={60} height={75} fill="none" stroke={BP} strokeWidth="0.4" strokeDasharray="4,6" variants={drawFaint(1.7, 0.8)} />

        <motion.rect x={garL + 30} y={garTop + 50} width={50} height={80} fill="none" stroke={BP} strokeWidth="0.3" strokeDasharray="4,8" variants={drawFaint(1.8, 0.8)} />
        <motion.rect x={garL + 110} y={garTop + 50} width={50} height={80} fill="none" stroke={BP} strokeWidth="0.3" strokeDasharray="4,8" variants={drawFaint(1.9, 0.8)} />

        {/* ══════ PHASE 2: STRUCTURE SOLIDIFIES ══════ */}

        <motion.line x1={mainWallL - 20} y1={mainBot} x2={garR + 20} y2={mainBot} stroke="url(#gh)" strokeWidth="2.5" variants={drawSolid(2.2, 1.0)} />
        <motion.rect x={mainWallL} y={mainBot - 8} width={mainWallR - mainWallL} height={8} fill="none" stroke="url(#gh)" strokeWidth="1.2" variants={drawSolid(2.4, 0.8)} />
        <motion.rect x={garL} y={garBot - 6} width={garR - garL} height={6} fill="none" stroke="url(#gh)" strokeWidth="1" variants={drawSolid(2.5, 0.8)} />

        {[
          { x: mainWallL, t: mainBot, b: mainTop, w: 2 },
          { x: mainWallR, t: mainBot, b: mainTop, w: 2 },
          { x: mainWallL + 90, t: mainBot, b: mainTop, w: 0.8 },
          { x: mainWallL + 180, t: mainBot, b: mainTop, w: 0.8 },
          { x: mainWallL + 270, t: mainBot, b: mainTop, w: 0.8 },
          { x: garL, t: garBot, b: garTop, w: 1.8 },
          { x: garR, t: garBot, b: garTop, w: 1.8 },
          { x: garL + 70, t: garBot, b: garTop, w: 0.7 },
          { x: garL + 140, t: garBot, b: garTop, w: 0.7 },
        ].map((s, i) => (
          <motion.line key={`sf-${i}`} x1={s.x} y1={s.t} x2={s.x} y2={s.b} stroke="url(#gv)" strokeWidth={s.w} variants={drawSolid(2.7 + i * 0.06, 0.9)} />
        ))}

        <motion.line x1={mainWallL} y1={mainTop} x2={mainWallR} y2={mainTop} stroke="url(#gh)" strokeWidth="2" variants={drawSolid(3.3, 0.7)} />
        <motion.line x1={garL} y1={garTop} x2={garR} y2={garTop} stroke="url(#gh)" strokeWidth="1.6" variants={drawSolid(3.4, 0.7)} />
        <motion.line x1={mainWallL} y1={(mainTop + mainBot) / 2} x2={mainWallR} y2={(mainTop + mainBot) / 2} stroke={G1} strokeWidth="0.5" strokeDasharray="6,4" variants={drawSolid(3.5, 0.5)} />

        {/* ══════ PHASE 3: TRANSLUCENT WALL PLANES MATERIALIZE ══════ */}

        <motion.rect x={mainWallL} y={mainTop} width={mainWallR - mainWallL} height={mainBot - mainTop} fill="url(#wallFillMain)" variants={fadeIn(3.8, 1.5, 1)} />
        <motion.rect x={garL} y={garTop} width={garR - garL} height={garBot - garTop} fill="url(#wallFillGar)" variants={fadeIn(4.0, 1.5, 1)} />

        <motion.rect x={mainWallL} y={mainTop} width={(mainWallR - mainWallL) / 2} height={mainBot - mainTop} fill={G2} variants={fadeIn(4.2, 1.2, 0.02)} />
        <motion.rect x={mainWallL + (mainWallR - mainWallL) / 2} y={mainTop} width={(mainWallR - mainWallL) / 2} height={mainBot - mainTop} fill={G3} variants={fadeIn(4.3, 1.2, 0.015)} />

        <motion.rect x={mainWallL} y={mainTop} width={mainWallR - mainWallL} height={mainBot - mainTop} fill="none" stroke="url(#gh)" strokeWidth="1.8" filter="url(#softGlow)" variants={solidify(4.5, 1.0)} />
        <motion.rect x={garL} y={garTop} width={garR - garL} height={garBot - garTop} fill="none" stroke="url(#gh)" strokeWidth="1.4" filter="url(#softGlow)" variants={solidify(4.6, 1.0)} />

        <motion.line x1={mainWallR} y1={mainTop} x2={garL} y2={garTop} stroke="url(#gh)" strokeWidth="1" variants={drawSolid(4.4, 0.5)} />
        <motion.line x1={mainWallR} y1={mainBot} x2={garL} y2={garBot} stroke="url(#gh)" strokeWidth="0.8" variants={drawSolid(4.5, 0.5)} />

        {/* ══════ PHASE 4: ROOF WITH DEPTH ══════ */}

        <motion.path d={mainRoof} fill="none" stroke="url(#gh)" strokeWidth="2.5" strokeLinejoin="round" variants={drawSolid(5.0, 1.2)} />
        <motion.path d={`${mainRoof} Z`} fill="url(#roofFillMain)" variants={fadeIn(5.5, 1.2, 1)} />

        <motion.path d={garageRoof} fill="none" stroke="url(#gh)" strokeWidth="2" strokeLinejoin="round" variants={drawSolid(5.2, 1.0)} />
        <motion.path d={`${garageRoof} Z`} fill="url(#roofFillGar)" variants={fadeIn(5.6, 1.2, 1)} />

        <motion.line x1={380} y1={155} x2={380} y2={mainTop} stroke={G1} strokeWidth="0.6" strokeDasharray="3,5" variants={drawSolid(5.4, 0.5)} />
        <motion.line x1={275} y1={220} x2={485} y2={220} stroke={G1} strokeWidth="0.3" strokeDasharray="2,6" variants={drawSolid(5.5, 0.4)} />
        <motion.line x1={225} y1={252} x2={535} y2={252} stroke={G1} strokeWidth="0.3" strokeDasharray="2,6" variants={drawSolid(5.6, 0.4)} />

        <motion.line x1={680} y1={225} x2={680} y2={garTop} stroke={G1} strokeWidth="0.5" strokeDasharray="3,5" variants={drawSolid(5.5, 0.4)} />

        <g filter="url(#edgeGlow)">
          <motion.path d={mainRoof} fill="none" stroke={G2} strokeWidth="1" variants={fadeIn(6.0, 1.0, 0.4)} />
          <motion.path d={garageRoof} fill="none" stroke={G2} strokeWidth="0.8" variants={fadeIn(6.1, 1.0, 0.35)} />
        </g>

        {/* ══════ PHASE 5: WINDOWS RESOLVE FROM BLUEPRINT TO SOLID ══════ */}

        {[
          { x: mainWallL + 35, y: mainTop + 25, w: 60, h: 60 },
          { x: mainWallL + 155, y: mainTop + 25, w: 60, h: 60 },
          { x: mainWallL + 275, y: mainTop + 25, w: 50, h: 50 },
        ].map((win, i) => (
          <g key={`win-${i}`}>
            <motion.rect x={win.x} y={win.y} width={win.w} height={win.h} rx="2" fill="none" stroke="url(#gd)" strokeWidth="1.6" variants={drawSolid(6.2 + i * 0.12, 0.6)} />
            <motion.line x1={win.x + win.w / 2} y1={win.y} x2={win.x + win.w / 2} y2={win.y + win.h} stroke={G1} strokeWidth="0.7" variants={drawSolid(6.5 + i * 0.08, 0.3)} />
            <motion.line x1={win.x} y1={win.y + win.h / 2} x2={win.x + win.w} y2={win.y + win.h / 2} stroke={G1} strokeWidth="0.7" variants={drawSolid(6.6 + i * 0.08, 0.3)} />
            <motion.rect x={win.x} y={win.y} width={win.w} height={win.h} rx="2" fill={G2} variants={fadeIn(6.8 + i * 0.1, 0.8, 0.07)} />
            <motion.rect x={win.x} y={win.y} width={win.w} height={win.h} rx="2" fill="none" stroke={G2} strokeWidth="0.5" filter="url(#softGlow)" variants={fadeIn(7.0 + i * 0.1, 0.6, 0.3)} />
          </g>
        ))}

        <g>
          <motion.rect x={mainWallL + 115} y={mainBot - 82} width={65} height={82} rx="3" fill="none" stroke="url(#gd)" strokeWidth="2" variants={drawSolid(6.5, 0.7)} />
          <motion.path d={`M${mainWallL + 115} ${mainBot - 82} Q${mainWallL + 147} ${mainBot - 92} ${mainWallL + 180} ${mainBot - 82}`} fill="none" stroke={G1} strokeWidth="1" variants={drawSolid(6.7, 0.4)} />
          <motion.circle cx={mainWallL + 170} cy={mainBot - 42} r="3.5" fill={G2} variants={fadeIn(7.0, 0.5, 0.5)} />
          <motion.rect x={mainWallL + 115} y={mainBot - 82} width={65} height={82} rx="3" fill={G1} variants={fadeIn(7.1, 0.8, 0.04)} />
          <motion.rect x={mainWallL + 115} y={mainBot - 82} width={65} height={82} rx="3" fill="none" stroke={G2} strokeWidth="0.5" filter="url(#softGlow)" variants={fadeIn(7.2, 0.6, 0.25)} />
        </g>

        {[
          { x: garL + 25, y: garTop + 40, w: 55, h: 85 },
          { x: garL + 110, y: garTop + 40, w: 55, h: 85 },
        ].map((gd, i) => (
          <g key={`gar-${i}`}>
            <motion.rect x={gd.x} y={gd.y} width={gd.w} height={gd.h} rx="2" fill="none" stroke="url(#gd)" strokeWidth="1.2" variants={drawSolid(6.8 + i * 0.1, 0.5)} />
            {[0, 1, 2, 3].map((r) => (
              <motion.line key={r} x1={gd.x} y1={gd.y + 17 + r * 18} x2={gd.x + gd.w} y2={gd.y + 17 + r * 18} stroke={G1} strokeWidth="0.5" variants={drawSolid(7.0 + i * 0.1 + r * 0.05, 0.25)} />
            ))}
            <motion.rect x={gd.x} y={gd.y} width={gd.w} height={gd.h} rx="2" fill={G3} variants={fadeIn(7.3 + i * 0.1, 0.8, 0.04)} />
          </g>
        ))}

        {/* ══════ PHASE 6: GLOWING EDGES (dimensional reveal) ══════ */}

        <g filter="url(#edgeGlow)">
          <motion.line x1={mainWallL} y1={mainBot} x2={mainWallL} y2={mainTop} stroke={G2} strokeWidth="1.2" variants={fadeIn(7.5, 1.0, 0.35)} />
          <motion.line x1={mainWallR} y1={mainBot} x2={mainWallR} y2={mainTop} stroke={G2} strokeWidth="1.2" variants={fadeIn(7.6, 1.0, 0.35)} />
          <motion.line x1={mainWallL} y1={mainBot} x2={mainWallR} y2={mainBot} stroke={G2} strokeWidth="1" variants={fadeIn(7.6, 1.0, 0.3)} />
          <motion.line x1={mainWallL} y1={mainTop} x2={mainWallR} y2={mainTop} stroke={G2} strokeWidth="0.8" variants={fadeIn(7.7, 1.0, 0.3)} />

          <motion.line x1={garL} y1={garBot} x2={garL} y2={garTop} stroke={G2} strokeWidth="1" variants={fadeIn(7.7, 1.0, 0.3)} />
          <motion.line x1={garR} y1={garBot} x2={garR} y2={garTop} stroke={G2} strokeWidth="1" variants={fadeIn(7.8, 1.0, 0.3)} />
          <motion.line x1={garL} y1={garBot} x2={garR} y2={garBot} stroke={G2} strokeWidth="0.8" variants={fadeIn(7.8, 1.0, 0.25)} />
        </g>

        {/* ══════ PHASE 7: CHIMNEY + FINISHING ══════ */}

        <motion.line x1={350} y1={175} x2={340} y2={135} stroke="url(#gv)" strokeWidth="1.5" variants={drawSolid(7.5, 0.5)} />
        <motion.rect x={332} y={130} width={16} height={45} rx="1" fill="none" stroke="url(#gd)" strokeWidth="1" variants={drawSolid(7.6, 0.5)} />
        <motion.rect x={332} y={130} width={16} height={45} rx="1" fill={G1} variants={fadeIn(7.8, 0.6, 0.04)} />
        {[0, 1, 2].map((i) => (
          <motion.rect key={`cv-${i}`} x={335} y={135 + i * 12} width={10} height={6} rx="1" fill={G1} variants={fadeIn(7.9 + i * 0.1, 0.4, 0.2 - i * 0.05)} />
        ))}

        <motion.path d={`M${mainWallL - 15} ${mainBot + 2} Q${mainWallL - 5} ${mainBot + 6} ${mainWallL + 5} ${mainBot + 3}`} fill="none" stroke={G1} strokeWidth="0.5" variants={drawSolid(8.0, 0.4)} />
        <motion.path d={`M${garR + 5} ${mainBot + 2} Q${garR + 15} ${mainBot + 5} ${garR + 25} ${mainBot + 1}`} fill="none" stroke={G1} strokeWidth="0.5" variants={drawSolid(8.1, 0.4)} />

        {/* ══════ PHASE 8: AMBIENT HALO + PARTICLES + LIGHT SWEEP ══════ */}

        <motion.ellipse cx={480} cy={350} rx={380} ry={200} fill="url(#halo)" variants={fadeIn(8.0, 2.0, 1)} />

        <g filter="url(#wideGlow)">
          <motion.rect x={mainWallL - 10} y={mainTop - 10} width={mainWallR - mainWallL + 20} height={mainBot - mainTop + 20} rx="4" fill={G1} variants={fadeIn(8.2, 2.0, 0.025)} />
          <motion.path d={`${mainRoof} Z`} fill={G2} variants={fadeIn(8.3, 2.0, 0.02)} />
        </g>

        {[
          { cx: 185, cy: 320, r: 1.5 },
          { cx: 570, cy: 280, r: 1.2 },
          { cx: 310, cy: 180, r: 1.3 },
          { cx: 440, cy: 165, r: 1 },
          { cx: 720, cy: 250, r: 1.4 },
          { cx: 230, cy: 240, r: 0.9 },
          { cx: 660, cy: 390, r: 1.1 },
          { cx: 490, cy: 210, r: 1 },
          { cx: 150, cy: 400, r: 1.2 },
          { cx: 800, cy: 340, r: 1 },
          { cx: 400, cy: 300, r: 0.8 },
          { cx: 750, cy: 420, r: 1.1 },
        ].map((p, i) => (
          <motion.circle
            key={`pt-${i}`}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill={G2}
            variants={fadeIn(8.5 + i * 0.08, 0.5, 0.3)}
            animate={inView ? {
              opacity: [0.1, 0.45, 0.1],
              y: [0, -5 - (i % 4), 0],
              scale: [1, 1.4, 1],
            } : {}}
            transition={{ duration: 3.5 + i * 0.3, repeat: Infinity, delay: 9 + i * 0.3, ease: "easeInOut" }}
          />
        ))}

        {inView && (
          <g clipPath="url(#sweepClip)">
            <motion.rect
              x={100}
              y={140}
              width={180}
              height={350}
              fill="url(#sweep)"
              initial={{ x: 100 }}
              animate={{ x: [100, 850] }}
              transition={{ duration: 3, delay: 9.5, repeat: Infinity, repeatDelay: 8, ease: [0.4, 0, 0.2, 1] }}
            />
          </g>
        )}

        {inView && (
          <g filter="url(#edgeGlow)">
            <motion.path
              d={mainRoof}
              fill="none"
              stroke={G2}
              strokeWidth="1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, delay: 9.5, repeat: Infinity, repeatDelay: 8, ease: "easeInOut" }}
            />
            <motion.line
              x1={mainWallL} y1={mainBot} x2={mainWallR} y2={mainBot}
              stroke={G2}
              strokeWidth="1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 3, delay: 10, repeat: Infinity, repeatDelay: 8, ease: "easeInOut" }}
            />
          </g>
        )}
      </motion.svg>
    </div>
  );
}

export const AboutPreviewSection = (): JSX.Element => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#0c0c0c] relative overflow-hidden">
      <HouseBuildAnimation inView={inView} />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="absolute left-1/2 top-[-20px] h-[280px] w-[280px] md:h-[360px] md:w-[360px] -translate-x-1/2 rounded-full bg-[#d4a94c]/35 blur-3xl pointer-events-none"
              animate={{
                y: [42, -26, 42],
                opacity: [0.3, 0.85, 0.3],
                scale: [0.9, 1.08, 0.9],
              }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute left-1/2 top-[0px] h-[220px] w-[420px] -translate-x-1/2 bg-gradient-to-t from-transparent via-[#f0d88a]/45 to-transparent blur-2xl pointer-events-none"
              animate={{ y: [34, -30, 34], opacity: [0.18, 0.9, 0.18] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {rainGlyphs.map((glyph, index) => (
                <motion.span
                  key={`${glyph.symbol}-${index}`}
                  className="absolute text-[#f0d88a]/40 font-bold"
                  style={{ left: glyph.left, top: glyph.top, fontSize: glyph.size }}
                  animate={{
                    y: [0, 140, 300],
                    x: [0, 8, -6],
                    opacity: [0, 0.45, 0],
                    rotate: [0, 10, -8],
                  }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: "linear", delay: glyph.delay }}
                >
                  {glyph.symbol}
                </motion.span>
              ))}
            </div>
            <div className="mb-4 md:mb-5">
              <div className="relative inline-block mb-5">
                <motion.img
                  src={badgeLogo}
                  alt="Lender Greg"
                  className="h-16 md:h-20 w-auto object-contain relative z-20"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="absolute inset-[-22px] rounded-[30px] bg-[radial-gradient(circle_at_center,rgba(240,216,138,0.65),rgba(212,169,76,0.22)_42%,rgba(196,149,58,0)_72%)] blur-2xl"
                  animate={{ opacity: [0.35, 1, 0.35], scale: [0.95, 1.08, 0.95] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <motion.p
                className="text-[#d4a94c] font-bold text-[13px] uppercase tracking-[0.2em] mb-3"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Why Lender Greg
              </motion.p>
              <motion.h2
                className="text-4xl md:text-[52px] lg:text-[64px] font-black text-white tracking-[-0.04em] leading-[0.95] max-w-[12ch]"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                Lending That
                <br />
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#d4a94c] via-[#f0d88a] to-[#c4953a]">Feels Different</span>
              </motion.h2>
            </div>

            <motion.div
              className="mb-4 flex justify-start"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={wideBadge}
                alt="Lender Greg Badge"
                className="h-[64px] md:h-[78px] w-auto object-contain"
                data-testid="img-wide-badge"
              />
            </motion.div>

            <div className="aspect-[4/5] max-w-[390px] md:max-w-[360px] rounded-[20px] overflow-hidden relative shadow-2xl shadow-black/40">
              <img
                src={gregPhoto}
                alt="Greg Wynn — Branch Manager & Loan Officer"
                className="w-full h-full object-cover scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <p className="text-white text-[18px] md:text-[20px] font-extrabold tracking-tight">Greg Wynn</p>
                <p className="text-white/50 text-[13px] font-medium">Branch Manager & Loan Officer · NMLS 276890</p>
              </div>
            </div>

            <motion.div
              className="absolute -bottom-5 -right-4 lg:right-[-40px] bg-[#141414] rounded-2xl shadow-xl shadow-black/30 border border-white/[0.08] p-4"
              initial={{ opacity: 0, scale: 0.85, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-4">
                {highlights.map((h, i) => (
                  <div key={i} className={`text-center ${i < highlights.length - 1 ? "pr-4 border-r border-white/[0.08]" : ""}`}>
                    <p className="text-[20px] font-extrabold text-[#d4a94c]">{h.stat}</p>
                    <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider">{h.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <span className="text-[#d4a94c] font-bold text-[13px] uppercase tracking-[0.2em]">Meet Greg</span>
            <h2 className="text-4xl md:text-[44px] font-extrabold text-white tracking-[-0.02em] leading-[1.1]" data-testid="text-about-heading">
              Your Lender, Not
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a94c] to-[#f0d88a]">Just a Loan Officer</span>
            </h2>
            <motion.p
              className="text-white/40 text-[16px] md:text-[18px] leading-[1.8] max-w-[620px]"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.22 }}
            >
              With over 15 years in the mortgage industry, Greg Wynn has helped hundreds of families navigate the path to homeownership. His approach combines deep market knowledge with genuine care — delivering results that speak for themselves.
            </motion.p>
            <motion.ul
              className="space-y-3 py-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {bullets.map((b, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                >
                  <CheckCircle2 className="w-[18px] h-[18px] text-[#d4a94c] mt-0.5 flex-shrink-0" />
                  <span className="text-white/50 text-[15px] font-medium">{b}</span>
                </motion.li>
              ))}
            </motion.ul>
            <Link href="/about">
              <motion.div className="inline-block mt-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button className="rounded-xl bg-white text-[#0c0c0c] font-bold gap-2.5 h-12 px-7 text-[15px] hover:bg-white/90 group shadow-lg shadow-white/10" data-testid="button-about-more">
                  Learn More About Greg
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

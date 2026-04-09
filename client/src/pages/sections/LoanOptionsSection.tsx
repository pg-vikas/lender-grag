import { ArrowRight, Home, Building2, Shield, Landmark, Key, RefreshCw, Building, CheckCircle2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { useRef } from "react";

const loans = [
  { icon: Home, title: "Conventional", summary: "Standard financing with competitive rates", tag: "Most Popular", benefits: ["As low as 3% down", "No PMI with 20% down", "Fixed or adjustable rates"] },
  { icon: Shield, title: "FHA", summary: "Government-backed with lower requirements", tag: "Low Down Payment", benefits: ["3.5% minimum down", "Credit scores from 580", "Seller concessions allowed"] },
  { icon: Landmark, title: "VA", summary: "Exclusive benefits for those who served", tag: "$0 Down", benefits: ["Zero down payment", "No monthly PMI", "Competitive interest rates"] },
  { icon: Building2, title: "Jumbo", summary: "Premium financing for high-value homes", tag: "Premium", benefits: ["Loan amounts over $766K", "Competitive jumbo rates", "Flexible underwriting"] },
  { icon: Key, title: "First-Time Buyer", summary: "Programs designed to get you started", tag: "Best For Starters", benefits: ["Down payment assistance", "Reduced mortgage insurance", "Educational guidance"] },
  { icon: RefreshCw, title: "Refinance", summary: "Lower your rate or access equity", tag: "Save Monthly", benefits: ["Rate-and-term refinance", "Cash-out options", "Streamline programs"] },
  { icon: Building, title: "Investment", summary: "Finance your next investment property", tag: "Build Wealth", benefits: ["Multi-unit financing", "Portfolio lending", "DSCR loan options"] },
];

function CityBlock({ x, y, w, h, fill }: { x: number; y: number; w: number; h: number; fill: string }) {
  return <rect x={x} y={y} width={w} height={h} rx="2" fill={fill} />;
}

function Car({ x, y, direction = 1, delay = 0, scale = 1, color = "#d4a94c", speed = 12 }: { x: number; y: number; direction?: 1 | -1; delay?: number; scale?: number; color?: string; speed?: number }) {
  const start = direction === 1 ? -140 : 1320;
  const end = direction === 1 ? 1320 : -140;
  return (
    <motion.g
      initial={{ x: start, y, scale, opacity: 0.95 }}
      animate={{ x: end, y, scale, opacity: 0.95 }}
      transition={{ duration: speed + delay * 0.5, repeat: Infinity, ease: "linear", delay }}
    >
      <rect x={0} y={0} width="34" height="16" rx="6" fill={color} />
      <rect x={6} y={-5} width="15" height="8" rx="3" fill="#f0d88a" opacity="0.9" />
      <circle cx="9" cy="16" r="3.5" fill="#111" />
      <circle cx="26" cy="16" r="3.5" fill="#111" />
      <rect x="1" y="4" width="32" height="2" rx="1" fill="#0c0c0c" opacity="0.18" />
    </motion.g>
  );
}

function VerticalCar({ x, y, direction = 1, delay = 0, scale = 1, color = "#d4a94c", speed = 14 }: { x: number; y: number; direction?: 1 | -1; delay?: number; scale?: number; color?: string; speed?: number }) {
  const start = direction === 1 ? -140 : 2500;
  const end = direction === 1 ? 2500 : -140;
  return (
    <motion.g
      initial={{ x, y: start, scale, opacity: 0.9 }}
      animate={{ x, y: end, scale, opacity: 0.9 }}
      transition={{ duration: speed + delay * 0.4, repeat: Infinity, ease: "linear", delay }}
    >
      <rect x={0} y={0} width="16" height="34" rx="6" fill={color} />
      <rect x={-5} y={6} width="8" height="15" rx="3" fill="#f0d88a" opacity="0.85" />
      <circle cx="16" cy="9" r="3.5" fill="#111" />
      <circle cx="16" cy="26" r="3.5" fill="#111" />
    </motion.g>
  );
}

function HouseShape({ x, y, w = 40, h = 30, roofH = 12, fill = "#1e3424", roofFill = "#2a4a30" }: { x: number; y: number; w?: number; h?: number; roofH?: number; fill?: string; roofFill?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="1" fill={fill} />
      <polygon points={`${x - 3},${y} ${x + w / 2},${y - roofH} ${x + w + 3},${y}`} fill={roofFill} />
      <rect x={x + w / 2 - 4} y={y + h - 12} width="8" height="12" rx="1" fill="#111" opacity="0.3" />
      <rect x={x + 4} y={y + 4} width="6" height="5" rx="1" fill="#d4a94c" opacity={0.15 + Math.random() * 0.2} />
      <rect x={x + w - 10} y={y + 4} width="6" height="5" rx="1" fill="#d4a94c" opacity={0.1 + Math.random() * 0.25} />
    </g>
  );
}

const carColors = ["#d4a94c", "#c4953a", "#4a4a4a", "#3a5a4a", "#555", "#8a7040", "#6a6a6a", "#f0d88a"];

function BirdsEyeCity() {
  const cityRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cityRef,
    offset: ["start end", "end start"],
  });
  const cityY = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const cityScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);

  return (
    <div ref={cityRef} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ y: cityY, scale: cityScale }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 2400"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="1200" height="2400" fill="#0f1410" />
          <rect x="0" y="0" width="1200" height="2400" fill="#0d100e" />

          <rect x="280" y="0" width="80" height="2400" fill="#151a16" />
          <rect x="840" y="0" width="80" height="2400" fill="#151a16" />
          <rect x="560" y="0" width="60" height="2400" fill="#141916" />
          {Array.from({ length: 48 }).map((_, i) => (
            <rect key={`vl-${i}`} x="318" y={i * 50} width="4" height="30" rx="2" fill="#2a352c" opacity="0.6" />
          ))}
          {Array.from({ length: 48 }).map((_, i) => (
            <rect key={`vr-${i}`} x="878" y={i * 50 + 25} width="4" height="30" rx="2" fill="#2a352c" opacity="0.6" />
          ))}
          {Array.from({ length: 48 }).map((_, i) => (
            <rect key={`vc-${i}`} x="588" y={i * 50 + 10} width="4" height="30" rx="2" fill="#2a352c" opacity="0.5" />
          ))}

          <rect x="0" y="500" width="1200" height="70" fill="#151a16" />
          <rect x="0" y="1100" width="1200" height="70" fill="#151a16" />
          <rect x="0" y="1700" width="1200" height="70" fill="#151a16" />
          <rect x="0" y="300" width="1200" height="50" fill="#131815" />
          <rect x="0" y="800" width="1200" height="50" fill="#131815" />
          <rect x="0" y="1400" width="1200" height="50" fill="#131815" />
          <rect x="0" y="2000" width="1200" height="50" fill="#131815" />

          {Array.from({ length: 24 }).map((_, i) => (
            <rect key={`h1-${i}`} x={i * 50} y="533" width="30" height="4" rx="2" fill="#2a352c" opacity="0.6" />
          ))}
          {Array.from({ length: 24 }).map((_, i) => (
            <rect key={`h2-${i}`} x={i * 50 + 15} y="1133" width="30" height="4" rx="2" fill="#2a352c" opacity="0.6" />
          ))}
          {Array.from({ length: 24 }).map((_, i) => (
            <rect key={`h3-${i}`} x={i * 50} y="1733" width="30" height="4" rx="2" fill="#2a352c" opacity="0.6" />
          ))}
          {Array.from({ length: 24 }).map((_, i) => (
            <rect key={`h4-${i}`} x={i * 50 + 10} y="323" width="25" height="3" rx="1.5" fill="#2a352c" opacity="0.45" />
          ))}
          {Array.from({ length: 24 }).map((_, i) => (
            <rect key={`h5-${i}`} x={i * 50} y="823" width="25" height="3" rx="1.5" fill="#2a352c" opacity="0.45" />
          ))}
          {Array.from({ length: 24 }).map((_, i) => (
            <rect key={`h6-${i}`} x={i * 50 + 10} y="1423" width="25" height="3" rx="1.5" fill="#2a352c" opacity="0.45" />
          ))}
          {Array.from({ length: 24 }).map((_, i) => (
            <rect key={`h7-${i}`} x={i * 50} y="2023" width="25" height="3" rx="1.5" fill="#2a352c" opacity="0.45" />
          ))}

          <Car x={0} y={520} direction={1} delay={0} speed={11} color="#d4a94c" />
          <Car x={0} y={540} direction={-1} delay={1} speed={13} color="#555" />
          <Car x={0} y={555} direction={1} delay={3.5} speed={10} color="#3a5a4a" />
          <Car x={0} y={1120} direction={-1} delay={0.5} speed={12} color="#8a7040" />
          <Car x={0} y={1140} direction={1} delay={2} speed={14} color="#d4a94c" />
          <Car x={0} y={1155} direction={-1} delay={4} speed={11} color="#6a6a6a" />
          <Car x={0} y={1720} direction={1} delay={1} speed={13} color="#c4953a" />
          <Car x={0} y={1740} direction={-1} delay={3} speed={10} color="#4a4a4a" />
          <Car x={0} y={1755} direction={1} delay={5} speed={12} color="#d4a94c" />

          <Car x={0} y={310} direction={1} delay={0.5} speed={15} color="#6a6a6a" />
          <Car x={0} y={330} direction={-1} delay={2.5} speed={13} color="#d4a94c" />
          <Car x={0} y={810} direction={-1} delay={1} speed={14} color="#c4953a" />
          <Car x={0} y={830} direction={1} delay={3} speed={12} color="#555" />
          <Car x={0} y={1410} direction={1} delay={0} speed={11} color="#3a5a4a" />
          <Car x={0} y={1430} direction={-1} delay={2} speed={13} color="#d4a94c" />
          <Car x={0} y={2010} direction={-1} delay={1.5} speed={12} color="#8a7040" />
          <Car x={0} y={2030} direction={1} delay={4} speed={14} color="#d4a94c" />

          <VerticalCar x={295} y={0} direction={1} delay={0} speed={16} color="#d4a94c" />
          <VerticalCar x={320} y={0} direction={-1} delay={3} speed={14} color="#555" />
          <VerticalCar x={340} y={0} direction={1} delay={6} speed={18} color="#3a5a4a" />
          <VerticalCar x={855} y={0} direction={-1} delay={1} speed={15} color="#c4953a" />
          <VerticalCar x={880} y={0} direction={1} delay={4} speed={17} color="#6a6a6a" />
          <VerticalCar x={900} y={0} direction={-1} delay={7} speed={14} color="#d4a94c" />
          <VerticalCar x={575} y={0} direction={1} delay={2} speed={16} color="#8a7040" />
          <VerticalCar x={595} y={0} direction={-1} delay={5} speed={13} color="#d4a94c" />

          <CityBlock x={30} y={40} w={220} h={140} fill="#1a2a1e" />
          <CityBlock x={50} y={60} w={80} h={100} fill="#1f3024" />
          <CityBlock x={160} y={50} w={70} h={120} fill="#1c2c20" />
          {Array.from({ length: 6 }).map((_, r) => Array.from({ length: 3 }).map((_, c) => (
            <rect key={`w1-${r}-${c}`} x={58 + c * 22} y={68 + r * 14} width={8} height={6} rx="1" fill="#d4a94c" opacity={0.15 + Math.random() * 0.25} />
          )))}

          <HouseShape x={65} y={130} w={35} h={25} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={120} y={135} w={30} h={22} fill="#1c2c20" roofFill="#264228" />
          <HouseShape x={185} y={128} w={38} h={28} fill="#1e3424" roofFill="#2a4a30" />

          <CityBlock x={390} y={30} w={200} h={160} fill="#1a2a1e" />
          <CityBlock x={400} y={40} w={90} h={130} fill="#223a28" />
          <CityBlock x={510} y={60} w={60} h={100} fill="#1e3022" />
          {Array.from({ length: 8 }).map((_, r) => Array.from({ length: 4 }).map((_, c) => (
            <rect key={`w2-${r}-${c}`} x={408 + c * 20} y={48 + r * 14} width={7} height={5} rx="1" fill="#d4a94c" opacity={0.1 + Math.random() * 0.3} />
          )))}

          <HouseShape x={410} y={145} w={32} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={460} y={140} w={36} h={26} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={515} y={138} w={30} h={22} fill="#1c2c20" roofFill="#244026" />

          <CityBlock x={950} y={50} w={210} h={130} fill="#1a2a1e" />
          <CityBlock x={960} y={55} w={100} h={110} fill="#1f3024" />
          <CityBlock x={1080} y={70} w={60} h={80} fill="#1c2c20" />
          {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 4 }).map((_, c) => (
            <rect key={`w3-${r}-${c}`} x={968 + c * 22} y={63 + r * 18} width={8} height={7} rx="1" fill="#d4a94c" opacity={0.12 + Math.random() * 0.2} />
          )))}

          <HouseShape x={970} y={142} w={34} h={24} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={1020} y={138} w={30} h={22} fill="#1c2c20" roofFill="#264228" />
          <HouseShape x={1090} y={140} w={36} h={26} fill="#1e3424" roofFill="#2a4a30" />

          <CityBlock x={30} y={220} w={230} h={250} fill="#182620" />
          <CityBlock x={40} y={230} w={110} h={230} fill="#1e3424" />
          <CityBlock x={170} y={260} w={70} h={180} fill="#1a2e1e" />
          {Array.from({ length: 12 }).map((_, r) => Array.from({ length: 5 }).map((_, c) => (
            <rect key={`w4-${r}-${c}`} x={48 + c * 20} y={238 + r * 18} width={7} height={6} rx="1" fill="#d4a94c" opacity={0.08 + Math.random() * 0.3} />
          )))}

          <HouseShape x={55} y={380} w={32} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={100} y={385} w={36} h={26} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={175} y={375} w={30} h={22} fill="#1c2c20" roofFill="#244026" />
          <HouseShape x={55} y={420} w={28} h={20} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={140} y={415} w={34} h={24} fill="#1c2e22" roofFill="#264228" />

          <CityBlock x={400} y={240} w={180} h={220} fill="#1a2a1e" />
          <CityBlock x={410} y={250} w={80} h={200} fill="#213528" />
          <CityBlock x={510} y={280} w={50} h={150} fill="#1c2e22" />

          <HouseShape x={415} y={370} w={32} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={460} y={365} w={36} h={26} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={415} y={410} w={30} h={22} fill="#1c2c20" roofFill="#244026" />
          <HouseShape x={510} y={400} w={34} h={24} fill="#1e3424" roofFill="#2a4a30" />

          <CityBlock x={950} y={230} w={220} h={240} fill="#182620" />
          <CityBlock x={960} y={240} w={95} h={220} fill="#1f3024" />
          <CityBlock x={1075} y={260} w={80} h={180} fill="#1c2c20" />
          {Array.from({ length: 10 }).map((_, r) => Array.from({ length: 4 }).map((_, c) => (
            <rect key={`w5-${r}-${c}`} x={968 + c * 20} y={248 + r * 20} width={7} height={7} rx="1" fill="#d4a94c" opacity={0.1 + Math.random() * 0.25} />
          )))}

          <HouseShape x={970} y={380} w={32} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={1020} y={375} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={1080} y={385} w={36} h={26} fill="#1c2c20" roofFill="#244026" />
          <HouseShape x={1130} y={378} w={28} h={20} fill="#1e3424" roofFill="#2a4a30" />

          <CityBlock x={40} y={610} w={210} h={180} fill="#1a2a1e" />
          <CityBlock x={50} y={620} w={100} h={160} fill="#1f3424" />
          <CityBlock x={170} y={640} w={60} h={120} fill="#1c2e20" />
          {Array.from({ length: 8 }).map((_, r) => Array.from({ length: 4 }).map((_, c) => (
            <rect key={`w6-${r}-${c}`} x={58 + c * 22} y={628 + r * 18} width={8} height={6} rx="1" fill="#d4a94c" opacity={0.1 + Math.random() * 0.25} />
          )))}

          <HouseShape x={60} y={720} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={110} y={715} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={175} y={710} w={32} h={24} fill="#1c2c20" roofFill="#244026" />

          <CityBlock x={400} y={620} w={160} h={160} fill="#182620" />
          <CityBlock x={410} y={630} w={70} h={140} fill="#1e3022" />

          <HouseShape x={420} y={705} w={32} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={470} y={700} w={36} h={26} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={420} y={740} w={28} h={20} fill="#1c2c20" roofFill="#244026" />

          <CityBlock x={950} y={600} w={200} h={200} fill="#1a2a1e" />
          <CityBlock x={960} y={610} w={90} h={180} fill="#203226" />
          <CityBlock x={1070} y={630} w={60} h={140} fill="#1c2c20" />

          <HouseShape x={970} y={720} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={1020} y={715} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={1080} y={725} w={32} h={24} fill="#1c2c20" roofFill="#244026" />

          <CityBlock x={40} y={870} w={220} h={210} fill="#182620" />
          <HouseShape x={60} y={920} w={36} h={26} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={110} y={915} w={30} h={22} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={170} y={925} w={34} h={24} fill="#1c2c20" roofFill="#244026" />
          <HouseShape x={60} y={960} w={32} h={24} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={120} y={955} w={28} h={20} fill="#1c2c20" roofFill="#264228" />
          <HouseShape x={190} y={965} w={36} h={26} fill="#1e3424" roofFill="#2a4a30" />

          <CityBlock x={400} y={860} w={200} h={230} fill="#1a2a1e" />
          <HouseShape x={420} y={910} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={470} y={905} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={530} y={915} w={36} h={26} fill="#1c2c20" roofFill="#244026" />
          <HouseShape x={420} y={950} w={32} h={24} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={480} y={945} w={28} h={20} fill="#1c2e22" roofFill="#264228" />

          <CityBlock x={950} y={880} w={210} h={200} fill="#1a2a1e" />
          <HouseShape x={970} y={930} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={1030} y={925} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={1090} y={935} w={36} h={26} fill="#1c2c20" roofFill="#244026" />
          <HouseShape x={970} y={970} w={32} h={24} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={1050} y={965} w={28} h={20} fill="#1c2c20" roofFill="#264228" />

          <CityBlock x={40} y={1200} w={220} h={180} fill="#1a2a1e" />
          <HouseShape x={60} y={1250} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={110} y={1245} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={170} y={1255} w={36} h={26} fill="#1c2c20" roofFill="#244026" />
          <HouseShape x={80} y={1290} w={32} h={24} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={150} y={1285} w={28} h={20} fill="#1c2c20" roofFill="#264228" />

          <CityBlock x={400} y={1210} w={180} h={170} fill="#182620" />
          <HouseShape x={420} y={1260} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={470} y={1255} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={530} y={1265} w={32} h={24} fill="#1c2c20" roofFill="#244026" />

          <CityBlock x={950} y={1190} w={200} h={190} fill="#1a2a1e" />
          <HouseShape x={970} y={1240} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={1030} y={1235} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={1090} y={1245} w={36} h={26} fill="#1c2c20" roofFill="#244026" />

          <CityBlock x={40} y={1480} w={210} h={240} fill="#182620" />
          <HouseShape x={60} y={1530} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={110} y={1525} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={170} y={1535} w={36} h={26} fill="#1c2c20" roofFill="#244026" />
          <HouseShape x={70} y={1570} w={32} h={24} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={140} y={1575} w={28} h={20} fill="#1c2c20" roofFill="#264228" />
          <HouseShape x={200} y={1565} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />

          <CityBlock x={400} y={1500} w={190} h={210} fill="#1a2a1e" />
          <HouseShape x={420} y={1550} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={470} y={1545} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={530} y={1555} w={36} h={26} fill="#1c2c20" roofFill="#244026" />
          <HouseShape x={440} y={1590} w={32} h={24} fill="#1e3424" roofFill="#2a4a30" />

          <CityBlock x={950} y={1470} w={220} h={250} fill="#1a2a1e" />
          <HouseShape x={970} y={1520} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={1030} y={1515} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={1090} y={1525} w={36} h={26} fill="#1c2c20" roofFill="#244026" />
          <HouseShape x={980} y={1560} w={32} h={24} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={1060} y={1555} w={28} h={20} fill="#1c2c20" roofFill="#264228" />

          <CityBlock x={40} y={1800} w={220} h={200} fill="#1a2a1e" />
          <HouseShape x={60} y={1850} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={120} y={1845} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={180} y={1855} w={36} h={26} fill="#1c2c20" roofFill="#244026" />

          <CityBlock x={400} y={1810} w={180} h={180} fill="#182620" />
          <HouseShape x={420} y={1860} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={480} y={1855} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={530} y={1865} w={32} h={24} fill="#1c2c20" roofFill="#244026" />

          <CityBlock x={950} y={1790} w={210} h={210} fill="#1a2a1e" />
          <HouseShape x={970} y={1840} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={1030} y={1835} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={1090} y={1845} w={36} h={26} fill="#1c2c20" roofFill="#244026" />

          <CityBlock x={40} y={2060} w={200} h={180} fill="#182620" />
          <HouseShape x={60} y={2110} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={120} y={2105} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />

          <CityBlock x={400} y={2070} w={190} h={170} fill="#1a2a1e" />
          <HouseShape x={420} y={2120} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={480} y={2115} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />

          <CityBlock x={950} y={2050} w={220} h={190} fill="#1a2a1e" />
          <HouseShape x={970} y={2100} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={1030} y={2095} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={1090} y={2105} w={36} h={26} fill="#1c2c20" roofFill="#244026" />

          <HouseShape x={640} y={80} w={36} h={26} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={700} y={75} w={30} h={22} fill="#1c2c20" roofFill="#264228" />
          <HouseShape x={760} y={85} w={34} h={24} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={640} y={160} w={32} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={700} y={155} w={28} h={20} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={760} y={165} w={34} h={24} fill="#1c2c20" roofFill="#244026" />
          <HouseShape x={640} y={240} w={36} h={26} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={700} y={235} w={30} h={22} fill="#1c2c20" roofFill="#264228" />

          <HouseShape x={640} y={620} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={700} y={615} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={760} y={625} w={36} h={26} fill="#1c2c20" roofFill="#244026" />
          <HouseShape x={640} y={700} w={32} h={24} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={710} y={695} w={28} h={20} fill="#1c2c20" roofFill="#264228" />

          <HouseShape x={640} y={880} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={700} y={875} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={760} y={885} w={36} h={26} fill="#1c2c20" roofFill="#244026" />
          <HouseShape x={650} y={950} w={32} h={24} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={720} y={945} w={28} h={20} fill="#1c2c20" roofFill="#264228" />

          <HouseShape x={640} y={1200} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={700} y={1195} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={760} y={1205} w={36} h={26} fill="#1c2c20" roofFill="#244026" />

          <HouseShape x={640} y={1500} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={700} y={1495} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={760} y={1505} w={36} h={26} fill="#1c2c20" roofFill="#244026" />
          <HouseShape x={650} y={1560} w={32} h={24} fill="#1e3424" roofFill="#2a4a30" />

          <HouseShape x={640} y={1810} w={34} h={24} fill="#1c2e22" roofFill="#264228" />
          <HouseShape x={700} y={1805} w={30} h={22} fill="#1e3424" roofFill="#2a4a30" />
          <HouseShape x={760} y={1815} w={36} h={26} fill="#1c2c20" roofFill="#244026" />

          <circle cx="100" cy="350" r="12" fill="#1a2a1e" opacity="0.5" />
          <circle cx="620" cy="150" r="10" fill="#1a2a1e" opacity="0.4" />
          <circle cx="750" cy="650" r="14" fill="#1a2a1e" opacity="0.45" />
          <circle cx="650" cy="1050" r="11" fill="#1a2a1e" opacity="0.4" />
          <circle cx="200" cy="1500" r="13" fill="#1a2a1e" opacity="0.5" />
          <circle cx="780" cy="1850" r="12" fill="#1a2a1e" opacity="0.4" />
          <circle cx="680" cy="400" r="8" fill="#1a2a1e" opacity="0.35" />
          <circle cx="120" cy="980" r="10" fill="#1a2a1e" opacity="0.4" />
        </svg>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1410] via-transparent to-[#0f1410] pointer-events-none" />
      <div className="absolute inset-0 bg-[#0f1410]/40 pointer-events-none" />
    </div>
  );
}

export const LoanOptionsSection = (): JSX.Element => {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <BirdsEyeCity />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4a94c]/10 text-[#d4a94c] text-[13px] font-bold uppercase tracking-[0.15em] border border-[#d4a94c]/20 mb-5">
            Loan Programs
          </span>
          <h2 className="text-4xl md:text-[52px] font-extrabold text-white mt-3 tracking-[-0.02em]" data-testid="text-loan-options-heading">
            Find Your Perfect Fit
          </h2>
          <p className="text-white/40 text-[17px] mt-4 max-w-[500px] mx-auto leading-relaxed">
            Every borrower is different. We offer a full range of programs to match your goals.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {loans.map((loan, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 24, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}
              transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="group relative p-6 rounded-2xl bg-[#0c0c0c]/80 backdrop-blur-xl border border-white/[0.08] hover:border-[#d4a94c]/30 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
              data-testid={`card-loan-${i}`}
            >
              <motion.div className="absolute inset-0 bg-gradient-to-br from-[#d4a94c]/[0.06] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent group-hover:via-[#d4a94c]/30 transition-all duration-500" />

              <div className="relative flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center group-hover:bg-[#d4a94c]/15 group-hover:border-[#d4a94c]/25 transition-all duration-300">
                  <loan.icon className="w-[20px] h-[20px] text-white/50 group-hover:text-[#d4a94c] transition-colors duration-300" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#d4a94c]/10 text-[#d4a94c] text-[10px] font-bold uppercase tracking-wider border border-[#d4a94c]/15">{loan.tag}</span>
              </div>
              <h3 className="text-[18px] font-bold text-white mb-1 relative group-hover:text-[#f0d88a] transition-colors duration-300">{loan.title}</h3>
              <p className="text-[13px] text-white/35 mb-4 relative">{loan.summary}</p>
              <ul className="flex-1 space-y-2 mb-5 relative">
                {loan.benefits.map((b, j) => (
                  <li key={j} className="text-[13px] text-white/45 flex items-start gap-2.5 group-hover:text-white/60 transition-colors duration-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#d4a94c]/50 mt-[2px] flex-shrink-0 group-hover:text-[#d4a94c] transition-colors duration-300" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link href="/loan-options">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-white/30 group-hover:text-[#d4a94c] cursor-pointer group-hover:gap-2.5 transition-all duration-300 relative">
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

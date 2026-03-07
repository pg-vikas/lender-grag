import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";

const statsData = [
  {
    endValue: 500,
    suffix: "M+",
    decimals: 0,
    label: "Loans Approved",
  },
  {
    endValue: 170,
    suffix: "+",
    decimals: 0,
    label: "Happy Customers",
  },
  {
    endValue: 15,
    suffix: "yrs",
    decimals: 0,
    label: "Experience",
  },
  {
    endValue: 4.9,
    suffix: "/5",
    decimals: 1,
    label: "Rating on Zillow",
  },
];

function useCountUp(end: number, decimals: number, shouldStart: boolean, duration = 2000) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (!shouldStart) return;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * end).toFixed(decimals)));

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [shouldStart, end, decimals, duration]);

  return value;
}

function AnimatedStat({ endValue, suffix, decimals, label }: { endValue: number; suffix: string; decimals: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useCountUp(endValue, decimals, isInView);

  return (
    <div ref={ref} className="flex flex-col items-start flex-1">
      <div className="[font-family:'DM_Sans',Helvetica] font-bold text-[#004733] text-[44px] tracking-[0] leading-[66px]">
        {decimals > 0 ? count.toFixed(decimals) : count}{suffix}
      </div>
      <div className="[font-family:'DM_Sans',Helvetica] font-semibold text-[#454545] text-base tracking-[0] leading-[28.8px]">
        {label}
      </div>
    </div>
  );
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)");
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, background: "" });
  const rafId = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`);

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: 0.15,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.6) 0%, transparent 60%)`,
      });
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)");
    setGlareStyle({ opacity: 0, background: "" });
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none z-20"
        style={{
          opacity: glareStyle.opacity,
          background: glareStyle.background,
          transition: "opacity 0.3s ease-out",
        }}
      />
    </div>
  );
}

const cardGradient = "linear-gradient(-50.75deg, rgb(8, 60, 43) 22.6%, rgb(5, 162, 112) 76.2%)";

const teamMembers = [
  {
    name: "Greg Wynn",
    title: "Branch Manager & Loan Officer",
    nmls: "NMLS 276890",
    profileImage: "/figmaAssets/rectangle-42.png",
    profileImageClass: "left-1/2 -translate-x-1/2 w-[264px]",
  },
  {
    name: "Christian Griffin",
    title: "Loan Officer",
    nmls: "NMLS 976102",
    profileImage: "/figmaAssets/rectangle-42-1.png",
    profileImageClass: "left-1/2 -translate-x-1/2 w-[260px] object-cover",
  },
  {
    name: "Dane Hines",
    title: "Loan Officer",
    nmls: "NMLS 1713910",
    profileImage: "/figmaAssets/rectangle-42-2.png",
    profileImageClass: "left-1/2 -translate-x-1/2 w-[260px]",
  },
  {
    name: "Josh Lander",
    title: "Loan Officer",
    nmls: "NMLS 766437",
    profileImage: "/figmaAssets/rectangle-42-3.png",
    profileImageClass: "left-1/2 -translate-x-1/2 w-[260px]",
  },
];

export const LoanJourneySection = (): JSX.Element => {
  return (
    <section className="relative w-full">
      <div className="relative flex flex-col">
        <div className="relative w-full bg-[linear-gradient(180deg,rgba(201,245,200,1)_0%,rgba(151,194,149,1)_100%)] overflow-hidden" style={{ height: '570px' }}>
          <div className="absolute top-0 left-0 w-full h-[152px] bg-[linear-gradient(180deg,rgba(200,244,199,1)_0%,rgba(200,244,199,0)_100%)] z-[1]" />

          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <img
              className="absolute"
              alt="Southern California Map"
              src="/figmaAssets/group-2131330293.png"
              style={{
                width: '1526px',
                height: '1382px',
                left: '143px',
                top: '-811px',
              }}
            />
          </div>

          <div className="absolute top-1/2 left-[100px] -translate-y-1/2 flex flex-col w-[509px] items-start gap-12 z-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="[font-family:'Figtree',Helvetica] font-bold text-[#0c382b] text-5xl tracking-[-0.48px] leading-[67.2px]"
            >
              Proudly Serving <br />
              100+ Clients Across San Diego, Southern California.
            </motion.h1>

            <Button className="h-auto bg-[#004733] hover:bg-[#004733]/90 rounded-lg px-[38px] py-3.5 gap-2">
              <span className="[font-family:'DM_Sans',Helvetica] font-semibold text-white text-lg leading-6">
                Apply Now
              </span>
              <img
                className="flex-shrink-0"
                alt="Arrow"
                src="/figmaAssets/container.svg"
              />
            </Button>
          </div>
        </div>

        <div className="relative w-full py-[60px]">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[linear-gradient(180deg,rgba(151,194,149,1)_0%,rgba(201,245,200,1)_100%)]" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white" />
          <div className="relative max-w-[1440px] mx-auto px-[100px]">
          <div className="flex flex-col items-center gap-[60px]">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="[font-family:'Figtree',Helvetica] font-bold text-[#0c382b] text-5xl text-center tracking-[0] leading-[59.5px] max-w-[744px]"
            >
              Experienced Professionals. Personal Service.
            </motion.h2>

            <div className="flex items-center justify-center gap-10 w-full">
              {teamMembers.map((member, index) => (
                <TiltCard
                  key={index}
                  className="relative w-[280px] h-[380px] rounded-3xl overflow-hidden"
                >
                  <Card className="w-full h-full rounded-3xl overflow-hidden border-0 bg-transparent">
                    <CardContent className="relative w-full h-full p-0 flex flex-col justify-end">
                      <div
                        className="absolute left-0 bottom-0 w-[280px] h-[380px] rounded-3xl"
                        style={{ backgroundImage: cardGradient }}
                      />
                      <div
                        className="absolute left-0 bottom-0 w-[280px] h-[380px] rounded-3xl opacity-[0.12] mix-blend-overlay"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'repeat',
                        }}
                      />

                      <img
                        className={`absolute bottom-0 h-[380px] ${member.profileImageClass}`}
                        alt={member.name}
                        src={member.profileImage}
                      />

                      <div className="relative w-full">
                        <div
                          className="absolute inset-0 backdrop-blur-[12px]"
                          style={{
                            maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
                          }}
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%)',
                            maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
                          }}
                        />
                        <div className="relative px-4 py-6 flex flex-col items-start w-full">
                          <div className="flex flex-col items-start gap-1 w-full">
                            <h3 className="[font-family:'DM_Sans',Helvetica] font-bold text-white text-lg tracking-[0] leading-[25.2px]">
                              {member.name}
                            </h3>

                            <p className="[font-family:'DM_Sans',Helvetica] font-medium italic text-white text-xs tracking-[0] leading-[16.8px]">
                              {member.title}
                              <br />
                              {member.nmls}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              ))}
            </div>

            <Button
              variant="outline"
              className="h-auto px-7 py-3 rounded-xl border-[#0c382b] gap-2"
            >
              <span className="[font-family:'DM_Sans',Helvetica] font-semibold text-[#0c382b] text-base tracking-[0] leading-6">
                View All team Members
              </span>
              <img
                className="flex-shrink-0"
                alt="Arrow"
                src="/figmaAssets/container.svg"
              />
            </Button>
          </div>
          </div>
        </div>

        <div className="relative w-full flex flex-col items-center py-[132px] bg-[#ffffff]">
          <div className="flex items-center justify-center gap-20 w-[900px] mb-[132px]">
            {statsData.map((stat, index) => (
              <AnimatedStat
                key={index}
                endValue={stat.endValue}
                suffix={stat.suffix}
                decimals={stat.decimals}
                label={stat.label}
              />
            ))}
          </div>

          <Card className="relative w-[960px] h-60 rounded-[40px] overflow-hidden bg-[linear-gradient(322deg,rgba(2,71,49,1)_0%,rgba(5,162,112,1)_100%)] border-0">
            <CardContent className="relative w-full h-full p-0">
              <img
                className="absolute right-[-91px] bottom-[-66px] w-[359px] h-[234px] object-cover"
                alt="Shutterstock"
                src="/figmaAssets/shutterstock-2415038437-1-1.png"
              />

              <h3 className="absolute top-[calc(50.00%_-_45px)] left-12 w-[400px] [font-family:'Figtree',Helvetica] font-bold text-white text-[32px] tracking-[0] leading-[44.8px]">
                Apply today and let&apos;s find your the perfect Mortgage
              </h3>

              <Button className="h-auto absolute top-[calc(50.00%_-_26px)] left-[529px] bg-white hover:bg-white/90 text-[#0c382b] rounded-lg px-[38px] py-3.5 gap-2">
                <span className="[font-family:'DM_Sans',Helvetica] font-semibold text-[#0c382b] text-lg text-center tracking-[0] leading-6">
                  Apply Now
                </span>
                <img
                  className="flex-shrink-0"
                  alt="Arrow"
                  src="/figmaAssets/container.svg"
                />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

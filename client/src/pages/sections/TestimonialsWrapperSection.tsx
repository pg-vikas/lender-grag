import { useRef, useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    text: "Helped throughout the entire process from pre-approval all the way to the end of escrew. Answered any questions or requests in a timely manner. We even got a lower interest rate than we expected.",
    author: "Kevan Jones",
    avatar: "/figmaAssets/ellipse-5.png",
    starsImage: "/figmaAssets/container-3.svg",
    decorativeImage: "/figmaAssets/group-2131330292.png",
  },
  {
    id: 2,
    text: "Helped throughout the entire process from pre-approval all the way to the end of escrew. Answered any questions or requests in a timely manner. We even got a lower interest rate than we expected.",
    author: "Brian J Diaz",
    avatar: "/figmaAssets/ellipse-5-1.png",
    starsImage: "/figmaAssets/container-17.svg",
    decorativeImage: "/figmaAssets/group-2131330292-1.png",
  },
  {
    id: 3,
    text: "Helped throughout the entire process from pre-approval all the way to the end of escrew. Answered any questions or requests in a timely manner. We even got a lower interest rate than we expected.",
    author: "Kevan Jones",
    avatar: "/figmaAssets/ellipse-5-2.png",
    starsImage: "/figmaAssets/container-3.svg",
    decorativeImage: "/figmaAssets/group-2131330292-2.png",
  },
  {
    id: 4,
    text: "Greg made our first home buying experience incredibly smooth. He was always available to answer questions and walked us through every step with patience and expertise.",
    author: "Sarah Mitchell",
    avatar: "/figmaAssets/ellipse-5.png",
    starsImage: "/figmaAssets/container-3.svg",
    decorativeImage: "/figmaAssets/group-2131330292.png",
  },
  {
    id: 5,
    text: "Outstanding service from start to finish. Greg found us a rate we didn't think was possible and made the entire refinancing process stress-free. Highly recommend!",
    author: "Michael Torres",
    avatar: "/figmaAssets/ellipse-5-1.png",
    starsImage: "/figmaAssets/container-17.svg",
    decorativeImage: "/figmaAssets/group-2131330292-1.png",
  },
];

export const TestimonialsWrapperSection = (): JSX.Element => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 380;
    el.scrollBy({ left: direction === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  return (
    <section className="flex flex-col items-center justify-center gap-16 w-full min-h-screen snap-start snap-always bg-[#c6f2c5] overflow-hidden px-[100px]">
      <div className="flex items-center justify-center gap-20 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex-1 [font-family:'Figtree',Helvetica] font-bold text-[#0c382b] text-[52px] tracking-[-0.52px] leading-[64.5px]"
        >
          I help you to Own <br />
          Your dream house
        </motion.h2>

        <div className="flex flex-col items-start gap-6 flex-1">
          <p className="self-stretch [font-family:'DM_Sans',Helvetica] font-semibold text-[#121212] text-lg tracking-[0] leading-7">
            I&apos;ve collected nearly 150+ 5 star reviews on Zillow. <br />I
            helped them find thier perfect mortgage
          </p>

          <Button
            variant="outline"
            className="group h-[52px] gap-2 px-7 py-2 bg-white rounded-lg border-[#e1e1e1] hover:bg-white hover:border-[#0c382b] hover:shadow-md hover:scale-[1.03] transition-all duration-300"
          >
            <span className="[font-family:'Figtree',Helvetica] font-semibold text-[#0c382b] text-lg tracking-[0] leading-[27px] whitespace-nowrap">
              Read 150+ Reviews on
            </span>
            <img
              className="w-[59.17px] h-5 object-cover transition-transform duration-300 group-hover:scale-110"
              alt="Zillow logo"
              src="/figmaAssets/image-18.png"
            />
          </Button>
        </div>
      </div>

      <div className="relative w-full max-w-[1440px]">
        <button
          onClick={() => scroll("left")}
          className={`absolute -left-14 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-xl ${canScrollLeft ? "opacity-100 cursor-pointer" : "opacity-0 pointer-events-none"}`}
          aria-label="Scroll left"
          data-testid="button-scroll-left"
        >
          <ChevronLeftIcon className="w-5 h-5 text-[#0c382b]" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory", overscrollBehavior: "contain", scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
              className="flex-shrink-0"
              style={{ scrollSnapAlign: "start" }}
            >
              <Card
                className="w-[360px] h-[260px] rounded-3xl shadow-[0px_6px_20px_#00000020] bg-white overflow-hidden border-0 px-8 py-6"
                data-testid={`card-testimonial-${testimonial.id}`}
              >
                <CardContent className="flex flex-col items-center justify-between h-full p-0 relative">
                  <img
                    className="absolute top-2 left-1/2 -translate-x-1/2 w-[240px] h-[120px] pointer-events-none opacity-[0.08]"
                    alt="Decorative stars"
                    src={testimonial.decorativeImage}
                  />

                  <p className="relative z-10 [font-family:'DM_Sans',Helvetica] font-semibold text-[#0c382b] text-sm tracking-[0.14px] leading-[22px] text-center line-clamp-4">
                    {testimonial.text}
                  </p>

                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <img
                      className="w-[80px]"
                      alt="Star rating"
                      src={testimonial.starsImage}
                    />

                    <div className="flex items-center gap-2">
                      <img
                        className="w-6 h-6 rounded-full"
                        alt={`${testimonial.author} avatar`}
                        src={testimonial.avatar}
                      />
                      <span className="[font-family:'DM_Sans',Helvetica] font-bold text-[#181e38b2] text-xs tracking-[0] whitespace-nowrap">
                        {testimonial.author}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className={`absolute -right-14 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-xl ${canScrollRight ? "opacity-100 cursor-pointer" : "opacity-0 pointer-events-none"}`}
          aria-label="Scroll right"
          data-testid="button-scroll-right"
        >
          <ChevronRightIcon className="w-5 h-5 text-[#0c382b]" />
        </button>
      </div>
    </section>
  );
};

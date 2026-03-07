import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    text: "Helped throughout the entire process from pre-approval all the way to the end of escrew. Answered any questions or requests in a timely manner. We even got a lower interest rate than we expected.",
    author: "Kevan Jones",
    avatar: "/figmaAssets/ellipse-5.png",
    starsImage: "/figmaAssets/container-3.svg",
    decorativeImage: "/figmaAssets/group-2131330292.png",
    decorativeImagePosition: "left-[calc(50.00%_-_105px)]",
    size: "small",
  },
  {
    id: 2,
    text: "Helped throughout the entire process from pre-approval all the way to the end of escrew. Answered any questions or requests in a timely manner. We even got a lower interest rate than we expected.",
    author: "Brian J Diaz",
    avatar: "/figmaAssets/ellipse-5-1.png",
    starsImage: "/figmaAssets/container-17.svg",
    decorativeImage: "/figmaAssets/group-2131330292-1.png",
    decorativeImagePosition: "left-[calc(50.00%_-_254px)]",
    size: "large",
  },
  {
    id: 3,
    text: "Helped throughout the entire process from pre-approval all the way to the end of escrew. Answered any questions or requests in a timely manner. We even got a lower interest rate than we expected.",
    author: "Kevan Jones",
    avatar: "/figmaAssets/ellipse-5-2.png",
    starsImage: "/figmaAssets/container-3.svg",
    decorativeImage: "/figmaAssets/group-2131330292-2.png",
    decorativeImagePosition: "left-[calc(50.00%_-_232px)]",
    size: "small",
  },
];

const paginationDots = [
  {
    width: "w-4",
    height: "h-4",
    bg: "bg-[#004733]",
    rounded: "rounded-lg",
    opacity: "",
  },
  {
    width: "w-3.5",
    height: "h-3.5",
    bg: "bg-[#1d5010]",
    rounded: "rounded-[7px]",
    opacity: "opacity-20",
  },
  {
    width: "w-3",
    height: "h-3",
    bg: "bg-[#1d5010]",
    rounded: "rounded-md",
    opacity: "opacity-20",
  },
  {
    width: "w-3",
    height: "h-3",
    bg: "bg-[#1d5010]",
    rounded: "rounded-md",
    opacity: "opacity-20",
  },
];

export const TestimonialsWrapperSection = (): JSX.Element => {
  return (
    <section className="pt-[100px] pb-[60px] px-[100px] flex flex-col items-center gap-[60px] w-full bg-[#c6f2c5]">
      <div className="flex items-center justify-center gap-20 w-full">
        <h2 className="flex-1 [font-family:'Figtree',Helvetica] font-bold text-[#0c382b] text-[52px] tracking-[-0.52px] leading-[64.5px]">
          I help you to Own <br />
          Your dream house
        </h2>

        <div className="flex flex-col items-start gap-6 flex-1">
          <p className="self-stretch [font-family:'DM_Sans',Helvetica] font-semibold text-[#121212] text-lg tracking-[0] leading-7">
            I&apos;ve collected nearly 150+ 5 star reviews on Zillow. <br />I
            helped them find thier perfect mortgage
          </p>

          <Button
            variant="outline"
            className="h-[52px] gap-2 px-7 py-2 bg-white rounded-lg border-[#e1e1e1] hover:bg-white"
          >
            <span className="[font-family:'Figtree',Helvetica] font-semibold text-[#0c382b] text-lg tracking-[0] leading-[27px] whitespace-nowrap">
              Read 150+ Reviews on
            </span>
            <img
              className="w-[59.17px] h-5 object-cover"
              alt="Zillow logo"
              src="/figmaAssets/image-18.png"
            />
          </Button>
        </div>
      </div>

      <div className="flex flex-col w-[1440px] items-center gap-10 ml-[-100.00px] mr-[-100.00px]">
        <div className="flex items-center justify-center gap-10 w-full">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`
                ${testimonial.size === "small" ? "w-[550px] h-[309.38px] gap-[41.25px] px-[121px] py-[27.5px] rounded-[27.5px]" : "w-[600px] h-[337.5px] gap-[45px] px-[132px] py-[30px] rounded-[30px]"}
                ${index === 0 ? "ml-[-170.00px]" : ""}
                ${index === 2 ? "mr-[-170.00px]" : ""}
                shadow-[0px_8.25px_27.5px_#00000029] bg-white overflow-hidden border-0
              `}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-0 relative">
                <img
                  className={`absolute ${testimonial.size === "small" ? "top-[27px] w-[337px] h-[168px]" : "top-[30px] w-[507px] h-[183px]"} ${testimonial.decorativeImagePosition}`}
                  alt="Decorative stars"
                  src={testimonial.decorativeImage}
                />

                <p
                  className={`
                  ${testimonial.size === "small" ? "w-[446.88px] ml-[-69.44px] mr-[-69.44px] text-[16.5px] tracking-[0.17px] leading-[24.8px]" : "w-[487.5px] ml-[-75.75px] mr-[-75.75px] text-lg tracking-[0.18px] leading-[27px]"}
                  [font-family:'DM_Sans',Helvetica] font-semibold text-[#0c382b] text-center
                `}
                >
                  {testimonial.text}
                </p>

                <div
                  className={`inline-flex flex-col items-center ${testimonial.size === "small" ? "gap-[13.75px]" : "gap-[15px]"}`}
                >
                  <img
                    className="self-stretch w-full"
                    alt="Star rating"
                    src={testimonial.starsImage}
                  />

                  <div
                    className={`inline-flex items-center ${testimonial.size === "small" ? "gap-[8.25px]" : "gap-[9px]"}`}
                  >
                    <img
                      className={
                        testimonial.size === "small"
                          ? "w-[27.5px] h-[27.5px]"
                          : "w-[30px] h-[30px]"
                      }
                      alt={`${testimonial.author} avatar`}
                      src={testimonial.avatar}
                    />

                    <span
                      className={`
                      [font-family:'DM_Sans',Helvetica] font-bold text-[#181e38b2] tracking-[0] whitespace-nowrap
                      ${testimonial.size === "small" ? "text-[11px] leading-[13.6px]" : "text-xs leading-[14.9px]"}
                    `}
                    >
                      {testimonial.author}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="inline-flex items-center gap-2.5">
          {paginationDots.map((dot, index) => (
            <button
              key={index}
              className={`${dot.width} ${dot.height} ${dot.bg} ${dot.rounded} ${dot.opacity}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

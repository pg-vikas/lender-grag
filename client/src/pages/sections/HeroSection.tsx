import { PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const navigationItems = [
  { label: "Home", href: "#", active: true },
  { label: "About Us", href: "#", hasDropdown: true },
  { label: "Guide", href: "#" },
  { label: "Calculator", href: "#" },
  { label: "Pre-Qualify", href: "#" },
  { label: "Loan Options", href: "#" },
];

export const HeroSection = (): JSX.Element => {
  return (
    <section className="relative w-full h-[758.77px] bg-[#0022ff] overflow-hidden">
      <img
        className="absolute right-0 bottom-[-25px] w-full max-w-[1440px] h-[759px] object-cover"
        alt="Gemini generated background"
        src="/figmaAssets/gemini-generated-image-708wtb708wtb708w-1.png"
      />

      <div className="absolute left-0 bottom-[139px] w-full max-w-[1440px] h-[620px] bg-[linear-gradient(180deg,rgba(188,217,191,1)_0%,rgba(147,194,144,0)_100%)]" />

      <img
        className="absolute right-0 bottom-[-25px] w-full max-w-[1440px] h-[759px] object-cover"
        alt="Gemini generated overlay"
        src="/figmaAssets/gemini-generated-image-708wtb708wtb708w-2.png"
      />

      <header className="flex w-full items-center px-[60px] py-2.5 absolute top-0 left-0 shadow-[0px_2px_28px_#00000017] z-10">
        <div className="flex max-w-[1380px] items-center justify-between w-full mx-auto">
          <img
            className="w-[186.91px] h-[50px]"
            alt="Company Logo"
            src="/figmaAssets/frame-2.svg"
          />

          <NavigationMenu className="flex-1 mx-8">
            <NavigationMenuList className="flex items-center justify-center gap-0">
              {navigationItems.map((item, index) => (
                <NavigationMenuItem key={index}>
                  {item.hasDropdown ? (
                    <>
                      <NavigationMenuTrigger className="h-auto px-3 py-3.5 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent [font-family:'Figtree',Helvetica] font-bold text-[#121212] text-base">
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-[200px] p-4">
                          <NavigationMenuLink className="block p-2 hover:bg-accent rounded-md">
                            Dropdown Item
                          </NavigationMenuLink>
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink
                      href={item.href}
                      className={`h-auto px-3 py-3.5 [font-family:'Figtree',Helvetica] font-bold text-base inline-flex items-center ${
                        item.active
                          ? "text-white underline"
                          : "text-[#121212] hover:text-[#121212]/80"
                      }`}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <Button className="h-auto bg-[#ffffff1a] hover:bg-[#ffffff3a] hover:scale-[1.05] rounded-lg border border-white backdrop-blur-[2.0px] backdrop-brightness-[110%] [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] px-6 py-2.5 [font-family:'Figtree',Helvetica] font-bold text-[#004733] text-base transition-all duration-300">
            Apply Now
          </Button>
        </div>
      </header>

      <div className="flex flex-col max-w-[540px] items-start gap-12 absolute top-[calc(50%_-_167px)] left-[100px] z-10">
        <div className="flex flex-col items-start gap-5 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="[font-family:'Figtree',Helvetica] font-bold text-[#0c382b] text-[64px] leading-[79.4px]"
          >
            Let's Find You The Perfect Mortgage
          </motion.h1>

          <p className="[font-family:'DM_Sans',Helvetica] font-semibold text-[#454545] text-lg leading-7">
            Buying or refinancing doesn't have to feel overwhelming. Lender Greg
            is loan officer that guides you through every step.
          </p>
        </div>

        <div className="flex items-center gap-5 w-full">
          <Button className="group h-[52px] bg-[#004733] hover:bg-[#004733]/90 hover:shadow-lg hover:scale-[1.03] rounded-lg px-[38px] py-2 [font-family:'Figtree',Helvetica] font-bold text-white text-lg gap-2 transition-all duration-300">
            Apply Now
            <img
              className="w-5 h-5 brightness-0 invert transition-transform duration-300 group-hover:translate-x-1"
              alt="Arrow icon"
              src="/figmaAssets/container.svg"
            />
          </Button>

          <Button
            variant="secondary"
            className="group h-[52px] bg-white hover:bg-white/90 hover:shadow-lg hover:scale-[1.03] rounded-lg px-[38px] py-2 [font-family:'Figtree',Helvetica] font-bold text-[#004733] text-lg gap-2 transition-all duration-300"
          >
            Book A Call
            <PhoneIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-[15deg] group-hover:scale-110" />
          </Button>
        </div>
      </div>
    </section>
  );
};

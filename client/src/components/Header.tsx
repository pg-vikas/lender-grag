import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Greg", href: "/about" },
  { label: "Loan Options", href: "/loan-options" },
  { label: "Mortgage Tools", href: "/tools" },
  { label: "Reviews", href: "/reviews" },
  { label: "Resources", href: "/resources" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm py-2"
            : "bg-transparent py-4"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-[1320px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" data-testid="link-home-logo">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-[#004733] flex items-center justify-center">
                <span className="text-white font-bold text-lg">LG</span>
              </div>
              <span className={`font-bold text-xl tracking-tight transition-colors ${scrolled ? "text-[#004733]" : "text-[#004733]"}`}>
                Lender Greg
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                    location === link.href
                      ? "text-[#004733] bg-[#004733]/5"
                      : "text-gray-600 hover:text-[#004733] hover:bg-[#004733]/5"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/contact">
              <Button variant="outline" className="rounded-xl border-[#004733]/20 text-[#004733] hover:bg-[#004733]/5 gap-2 font-semibold" data-testid="button-book-call">
                <Phone className="w-4 h-4" />
                Book a Call
              </Button>
            </Link>
            <Link href="/apply">
              <Button className="rounded-xl bg-[#004733] hover:bg-[#003626] text-white font-semibold shadow-lg shadow-[#004733]/20" data-testid="button-get-preapproved">
                Get Pre-Approved
              </Button>
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-white lg:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pt-24 px-6 flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={link.href}>
                    <span className={`block px-4 py-3 rounded-xl text-lg font-medium cursor-pointer transition-colors ${
                      location === link.href ? "text-[#004733] bg-[#004733]/5" : "text-gray-700 hover:bg-gray-50"
                    }`}>
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <div className="flex flex-col gap-3 mt-6 pt-6 border-t">
                <Link href="/contact">
                  <Button variant="outline" className="w-full rounded-xl border-[#004733]/20 text-[#004733] font-semibold gap-2 h-12">
                    <Phone className="w-4 h-4" />
                    Book a Call
                  </Button>
                </Link>
                <Link href="/apply">
                  <Button className="w-full rounded-xl bg-[#004733] hover:bg-[#003626] text-white font-semibold h-12">
                    Get Pre-Approved
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

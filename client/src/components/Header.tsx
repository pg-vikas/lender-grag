import { useState, useEffect } from "react";
import { Menu, X, Phone, ArrowRight, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import logoImg from "@assets/lender-greg-logo-new-transparent.png";
import { useAuth } from "@/lib/auth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Loan Options", href: "/loan-options" },
  { label: "Tools", href: "/tools" },
  { label: "Reviews", href: "/reviews" },
  { label: "Resources", href: "/resources" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, logout, loadSession } = useAuth();
  const [, navigate] = useLocation();

  const isHome = location === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => { loadSession(); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/[0.92] backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] py-2.5"
            : "bg-transparent py-4"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-[1320px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" data-testid="link-home-logo">
            <div className="cursor-pointer group">
              <img
                src={logoImg}
                alt="Lender Greg"
                className={`h-[125px] md:h-[140px] w-auto object-contain transition-all duration-300 ${
                  transparent ? "brightness-[1.6]" : ""
                }`}
              />
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5" data-testid="nav-desktop">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 ${
                    transparent
                      ? location === link.href
                        ? "text-white bg-white/15"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                      : location === link.href
                        ? "text-[#004733] bg-[#004733]/[0.06]"
                        : "text-gray-500 hover:text-[#004733] hover:bg-[#004733]/[0.04]"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden xl:flex items-center gap-2.5">
            <Link href="/contact">
              <Button variant="ghost" className={`h-9 px-4 rounded-lg text-[13px] font-medium gap-1.5 transition-colors duration-300 ${
                transparent
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-[#004733] hover:bg-[#004733]/[0.04]"
              }`} data-testid="button-book-call">
                <Phone className="w-3.5 h-3.5" />
                Book a Call
              </Button>
            </Link>
            <Link href="/apply">
              <Button className={`h-9 px-5 rounded-lg text-[13px] font-semibold shadow-sm gap-1.5 group transition-all duration-200 ${
                transparent
                  ? "bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white border border-white/20"
                  : "bg-[#004733] hover:bg-[#003525] text-white"
              }`} data-testid="button-get-preapproved">
                Get Pre-Approved
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/portal">
                    <Button variant="ghost" className={`h-9 px-4 rounded-lg text-[13px] font-medium gap-2 ${
                      transparent
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-gray-600 hover:text-[#004733] hover:bg-[#004733]/[0.04]"
                    }`} data-testid="button-my-portal">
                      <User className="w-3.5 h-3.5" /> My Portal
                    </Button>
                  </Link>
                  <button
                    onClick={() => { logout(); navigate("/"); }}
                    className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
                      transparent ? "text-white/60 hover:text-white hover:bg-white/10" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                    data-testid="button-header-logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className={`h-9 px-4 rounded-lg text-[13px] font-medium ${
                      transparent
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-gray-600 hover:text-[#004733] hover:bg-[#004733]/[0.04]"
                    }`} data-testid="button-log-in">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className={`h-9 px-5 rounded-lg text-[13px] font-semibold shadow-sm transition-all duration-200 ${
                      transparent
                        ? "bg-white text-[#0c0c0c] hover:bg-white/90"
                        : "bg-[#d4a94c] hover:bg-[#c4953a] text-[#0c0c0c]"
                    }`} data-testid="button-sign-up">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
          </div>

          <button
            className={`xl:hidden w-9 h-9 rounded-lg transition-colors flex items-center justify-center ${
              transparent ? "hover:bg-white/10" : "hover:bg-gray-100"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-testid="button-mobile-menu"
          >
            {mobileOpen
              ? <X className="w-5 h-5 text-gray-700" />
              : <Menu className={`w-5 h-5 ${transparent ? "text-white" : "text-gray-700"}`} />
            }
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-white xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="pt-20 px-6 flex flex-col gap-1 h-full overflow-y-auto">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <Link href={link.href}>
                    <span className={`block px-4 py-3 rounded-xl text-[17px] font-medium cursor-pointer transition-colors ${
                      location === link.href ? "text-[#004733] bg-[#004733]/[0.06]" : "text-gray-600 hover:bg-gray-50"
                    }`}>
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                className="flex flex-col gap-2.5 mt-6 pt-6 border-t border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <Link href="/contact">
                  <Button variant="outline" className="w-full rounded-xl border-gray-200 text-gray-700 font-semibold gap-2 h-12">
                    <Phone className="w-4 h-4" />
                    Book a Call
                  </Button>
                </Link>
                <Link href="/apply">
                  <Button className="w-full rounded-xl bg-[#004733] hover:bg-[#003525] text-white font-semibold h-12 gap-2">
                    Get Pre-Approved
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link href="/portal">
                      <Button className="w-full rounded-xl bg-[#004733] hover:bg-[#003525] text-white font-semibold h-12 gap-2" data-testid="button-mobile-portal">
                        <User className="w-4 h-4" /> My Portal
                      </Button>
                    </Link>
                    <Button variant="outline" onClick={() => { logout(); navigate("/"); setMobileOpen(false); }} className="w-full rounded-xl border-gray-200 text-gray-700 font-semibold h-12 gap-2" data-testid="button-mobile-logout">
                      <LogOut className="w-4 h-4" /> Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" className="w-full rounded-xl border-gray-200 text-gray-700 font-semibold h-12" data-testid="button-mobile-log-in">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="w-full rounded-xl bg-[#d4a94c] hover:bg-[#c4953a] text-[#0c0c0c] font-semibold h-12" data-testid="button-mobile-sign-up">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

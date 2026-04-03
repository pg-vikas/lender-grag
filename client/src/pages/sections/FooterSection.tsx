import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

const navCols = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About Greg", href: "/about" },
      { label: "Loan Options", href: "/loan-options" },
      { label: "Mortgage Tools", href: "/tools" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Reviews", href: "/reviews" },
      { label: "Resources", href: "/resources" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const FooterSection = (): JSX.Element => {
  return (
    <footer className="bg-[#0c1a14] text-white">
      <div className="max-w-[1320px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#004733] flex items-center justify-center">
                <span className="text-white font-bold text-sm">LG</span>
              </div>
              <span className="font-bold text-lg">Lender Greg</span>
            </div>
            <p className="text-white/60 leading-relaxed max-w-[340px] mb-6 text-sm">
              Smart mortgage strategy, responsive communication, and smoother closings. Serving families across San Diego and Southern California.
            </p>
            <div className="space-y-2.5">
              <a href="tel:+16195551234" className="flex items-center gap-2.5 text-white/60 hover:text-white transition-colors text-sm">
                <Phone className="w-4 h-4" /> (619) 555-1234
              </a>
              <a href="mailto:greg@lendergreg.com" className="flex items-center gap-2.5 text-white/60 hover:text-white transition-colors text-sm">
                <Mail className="w-4 h-4" /> greg@lendergreg.com
              </a>
              <div className="flex items-start gap-2.5 text-white/60 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /> San Diego, CA
              </div>
            </div>
          </div>

          {navCols.map((col, i) => (
            <div key={i}>
              <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link href={link.href}>
                      <span className="text-white/60 hover:text-white transition-colors text-sm cursor-pointer">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Lender Greg. All rights reserved. NMLS 276890. Equal Housing Lender.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-white/60 transition-colors text-xs">Privacy Policy</a>
            <a href="#" className="text-white/40 hover:text-white/60 transition-colors text-xs">Terms of Service</a>
            <a href="#" className="text-white/40 hover:text-white/60 transition-colors text-xs">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

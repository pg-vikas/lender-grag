import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

const quickLinks = [
  "About Us",
  "Contact Us",
  "Blog",
  "FAQ's",
  "Privacy Policy",
];

const loanOptions = [
  "Fixed Rate Mortgage",
  "FHA Home Loan",
  "VA Home Loan",
  "Rehab Loan",
  "USDA Loan",
];

const contactInfo = [
  {
    icon: PhoneIcon,
    text: "(619) 550-9885",
  },
  {
    icon: MailIcon,
    text: "greg@maverickmtg.com",
  },
  {
    icon: MapPinIcon,
    text: "514 Via De La Valle Unit 202\nSolana Beach, CA 92075",
  },
];

const legalLinks = ["Privacy Policy", "Terms of Service", "Disclaimer"];

export const FooterSection = (): JSX.Element => {
  return (
    <footer className="bg-[#024731] border-r border-b border-l border-[#ffffff3b] px-20 pt-[100px] pb-[50px] w-full">
      <div className="max-w-[1380px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[325.98px_1fr] gap-10 mb-10">
          <div className="flex flex-col gap-6">
            <img
              className="h-[58.19px] w-auto"
              alt="Company Logo"
              src="/figmaAssets/container-5.svg"
            />
            <p className="[font-family:'DM_Sans',Helvetica] font-normal text-white text-base leading-6">
              With almost 50 years combined experience in the mortgage business,
              our professionals will mind all the details of your purchase or
              refinance loan and our on-track closing times can&apos;t be beat.
            </p>
            <img
              className="h-9 w-auto"
              alt="Social Media Icons"
              src="/figmaAssets/container-19.svg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col gap-[25px]">
              <h3 className="[font-family:'Figtree',Helvetica] font-bold text-white text-[22px] leading-[26.4px]">
                Quick Links
              </h3>
              <nav className="flex flex-col gap-[17px]">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href="#"
                    className="[font-family:'DM_Sans',Helvetica] font-normal text-white text-base leading-6 hover:underline"
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-[25px]">
              <h3 className="[font-family:'Figtree',Helvetica] font-bold text-white text-[22px] leading-[26.4px]">
                Loan Options
              </h3>
              <nav className="flex flex-col gap-[17px]">
                {loanOptions.map((option, index) => (
                  <a
                    key={index}
                    href="#"
                    className="[font-family:'DM_Sans',Helvetica] font-normal text-white text-base leading-6 hover:underline"
                  >
                    {option}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-[25px]">
              <h3 className="[font-family:'Figtree',Helvetica] font-bold text-white text-[22px] leading-[26.4px]">
                Our Contact
              </h3>
              <div className="flex flex-col gap-[17px]">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <contact.icon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="[font-family:'DM_Sans',Helvetica] font-normal text-white text-base leading-6 whitespace-pre-line">
                      {contact.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#fffefe1a] gap-4">
          <p className="[font-family:'DM_Sans',Helvetica] font-medium text-[#fffefe99] text-sm leading-5">
            © 2026 company. All rights reserved.
          </p>
          <nav className="flex items-center gap-6">
            {legalLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className="[font-family:'DM_Sans',Helvetica] font-medium text-[#fffefe99] text-sm leading-5 hover:text-white"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

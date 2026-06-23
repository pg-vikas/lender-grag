import { PageLayout } from "./PageLayout";
import { useState, useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, ArrowRight, Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle2 } from "lucide-react";

const perks = [
  "Upload documents securely",
  "Track your loan in real time",
  "Message Greg's team directly",
  "Get instant status updates",
];

const getPhoneDigits = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const normalizedDigits = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  return normalizedDigits.slice(0, 10);
};

type ConsentInfoType = "electronicSignatures" | "creditInformation";

const formatPhoneNumber = (value: string) => {
  const digits = getPhoneDigits(value);

  if (digits.length === 0) {
    return "";
  }

  if (digits.length < 4) {
    return `(${digits}`;
  }

  if (digits.length < 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasAcceptedConsent, setHasAcceptedConsent] = useState(false);
  const [activeConsentInfo, setActiveConsentInfo] = useState<ConsentInfoType | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, isAuthenticated, hasLoadedSession, user, loadSession } = useAuth();
  const [, navigate] = useLocation();

  const consentInfo = {
    electronicSignatures: {
      title: "Electronic Signatures Consent",
      description: (
        <div className="space-y-4 text-[14px] leading-6 text-gray-600">
          <p className="font-semibold text-[#0c1a14]">E-Sign Disclosure and Consent to use Electronic Records and Signatures</p>

          <p>
            This Online Services E-Sign Disclosure and Consent to use Electronic Records and Signatures
            (“Disclosure”) applies to all Communications for those products, services, and accounts offered
            or accessible through our Online Services that are not otherwise governed by the terms and
            conditions of an electronic disclosure and consent.
          </p>

          <p>
            The words “we,” “us,” and “our” refer to the entity with whom you have your Account, and the
            words “you” and “your” mean you, the individual or entity identified on the Account(s). As used
            in the Disclosure, “Account” means the account you have with us. “Communication” means any
            agreements or amendments thereto, disclosures, notices, responses, transaction history, privacy
            policies and all other information related to the product or service, including but not limited to
            information that we are required by law to provide you in writing.
          </p>

          <p>
            The purpose of this E-Sign disclosure documents your consent to conduct transactions
            electronically and to electronically receive Communication(s) relative to the Accounts in which
            you are applying to open online. We recommend that you print and retain a copy of this disclosure
            and all disclosures and agreements for your accounts.
          </p>

          <p>
            Electronic acceptance of disclosures means that we will not provide hard copy disclosures to you
            unless you specifically request a hard copy. To request a hard copy of a disclosure or to have all
            future disclosures provided to you in hard copy, you must request the documents in writing to the
            address provided below, or contact a representative at the phone number provided.
          </p>

          <p>Once you consent, you will be able to apply for accounts online.</p>

          <p className="text-[#0c1a14]">You understand that prior to consenting, the following applies:</p>

          <div className="space-y-3">
            <p>
              <ol className="list-decimal space-y-2 pl-5">
                <li><b>Consent.</b> Your consent to use electronic records and signatures means that going forward,
disclosures, notices, records and other information we provide to you may be in electronic form.</li>
<li><b>Coverage.</b> Your consent covers all online products and services, and covers all of your
transactions relating to each product or service that you agree to obtain or access electronically
through our website. Your consent remains in effect until you withdraw your consent in writing
to the address listed below.</li>
<li><b>Obtaining Paper Copies.</b> Your option to receive paper copies means that if we provide you with
electronic records and you want a hard copy , you must contact us in writing and request a hard
copy at the address below. You will not be charged a fee for receiving paper copies of
disclosures.</li>
<li><b>Method.</b> Method of providing communications to you in electronic form means all
Communications that we provide to you in electronic form will be provided either (1) via e-mail,
(2) by access to a website that we will designate in an email notice we send to you at the time
the information is available, (3) to the extent permissible by law, by access to a website that we
will generally designate in advance for such purpose, or (4) by requesting you download a PDF
file containing the communication.</li>
<li><b>In Writing.</b> Communication in writing means all Communications in either electronic or paper
format from us to you will be considered “in writing”. You should print or download all
documents for your records, including a copy of this Agreement and any other communication
that is important to you.</li>
<li><b>Withdrawal of Consent.</b> You may withdraw your consent at any time. You have the right to
withdraw your consent at any time and at no cost to you. If you wish to withdraw your consent,
you must contact us in writing at the address provided below.</li>
<li><b>Contact Information.</b> You must keep your email or electronic address current with us. In order
to ensure that we are able to provide you with important notices and other information from
time to time, you must notify us of any change to your email or other electronic address by
notifying us at the number or address provided below.</li>
<li><b>Federal Law.</b> You acknowledge and agree that your consent to electronic communications is
being provided in connection with a transaction affecting interstate commerce that is subject to
the Federal Electronic Signatures in Global and National Commerce Act, and that you and we
both intend that the Act apply to the fullest extent possible to validate our ability to conduct
business with you by electronic means.</li>
<li><b>Hardware and software.</b> In order to access Electronic Communications, you will need an
electronic device with internet access and a compatible browser. You are solely responsible for
the equipment you use to access the Services. We are not responsible or liable for errors or
delays or your inability to access Services caused by your equipment or for any other reason. We
are not responsible for the cost of upgrading your equipment to stay current with the Services
nor are we responsible, under any circumstances, for any damage to your equipment or the
data resident thereon. If the software or hardware requirements change in the future, and you
are unable to continue receiving disclosures electronically, paper copies of the disclosures will
be mailed to you after you notify us that you are no longer able to access the Servicing
Disclosures electronically because of the changed requirements. We will use commercially
reasonable efforts to notify you before such requirements change. Upon receiving notice of the
change, you can also withdraw your consent without penalty.<br/>
You must also attest that, in addition to an electronic device with internet access and a
compatible browser, you have the following in order to access disclosures:<br/>
- An active email account.<br/>
- A current version of a program that accurately reads and displays PDF files (such as
Adobe Acrobat Reader).</li>
<li>For communications related to your electronic consent, including requesting paper copies of
disclosures, withdrawal of consent, and updating contact information please contact us in
writing.</li>
              </ol>
              
            </p>            

          </div>

          <p>
            Please indicate your consent to use electronic records and signatures by clicking the “I Accept”
            button below. By providing your consent, you are also confirming that you have the hardware and
            software described above, that you are able to receive and review electronic records and that you
            have an active email account.
          </p>
        </div>
      ),
    },
    creditInformation: {
      title: "Credit Authorization",
      description: (
        <div className="space-y-4 text-[14px] leading-6 text-gray-600">
          <p>
           By indicating my acceptance, I expressly authorize Maxwell Financial Labs, Inc., on behalf of the Lender, the Lender, and Other Loan Participants to obtain, use, and share with each other any or all of the following (i) the loan application and related loan information and documentation, (ii) a consumer credit report on me, and/or (iii) my tax return information, as necessary to perform the actions listed below, for so long as they have an interest in my loan or its servicing:
          </p>

          <ol className="list-decimal space-y-2 pl-5" type="a">
            <li>process and underwrite my loan;</li>
            <li>verify any data contained in my consumer credit report, my loan application and other information
supporting my loan application;</li>
<li>inform credit and investment decisions by the Lender and Other Loan Participants;</li>
<li>perform audit, quality control, and legal compliance analysis and reviews;</li>
<li>perform analysis and modeling for risk assessments;</li>
<li>monitor the account for this loan for potential delinquencies and determine any assistance that may
be available to me; and</li>
<li>other actions permissible under applicable law.</li>
</ol>

          <p>
            <strong>Lender</strong> shall mean for the purposes of authorizations collected within the Maxwell
            Platform, Lender is defined as the Mortgage Loan Originator and its employer who directed you
            to, instructed use of, and/or is the contractual client of Maxwell Financial Labs, Inc. Your
            Lender is the intended recipient and user of consents, authorizations, and information provided
            through the Maxwell Platform. Maxwell Financial Labs, Inc. is not your Lender.
          </p>

          <p>
            <strong>Other Loan Participants</strong> shall mean for the purposes of authorizations collected within
            the Maxwell Platform, Other Loan Participants are defined as potential and chosen investors,
            third party providers, contracted employees, and other services which may be utilized by your
            Lender in connection with your mortgage transaction. Information and authorizations will be
            provided to Other Loan Participants as allowable by law for the purposes of originating and
            servicing your mortgage transaction.
          </p>
        </div>
      ),
    },
  } satisfies Record<ConsentInfoType, { title: string; description: ReactNode }>;

  const activeConsentDetails = activeConsentInfo ? consentInfo[activeConsentInfo] : null;

  useEffect(() => {
    if (!hasLoadedSession) {
      void loadSession();
    }
  }, [hasLoadedSession, loadSession]);

  useEffect(() => {
    if (hasLoadedSession && isAuthenticated && user) {
      navigate(user.role === "admin" ? "/admin" : "/portal");
    }
  }, [hasLoadedSession, isAuthenticated, navigate, user]);

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhoneNumber(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const phoneDigits = getPhoneDigits(phone);
    const formattedPhone = formatPhoneNumber(phoneDigits);

    if (!name || !email || !phone || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (phoneDigits.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!hasAcceptedConsent) {
      setError("Please accept the required consent before creating your account");
      return;
    }
    setIsSubmitting(true);
    try {
      await signup(name, email, formattedPhone, password);
      navigate("/portal");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-[#f0faf6] via-white to-[#e8f5ee] relative overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-40 left-[15%] w-[500px] h-[500px] rounded-full bg-[#004733]/5 blur-3xl" />
          <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full bg-[#05a270]/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-[900px] mx-6"
        >
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-center">
            <div className="hidden lg:block">
              <h1 className="text-3xl font-bold text-[#0c1a14] leading-tight">Create Your<br />Client Portal</h1>
              <p className="text-gray-500 mt-3 leading-relaxed">Join thousands of borrowers who track their loan from pre-approval to closing — all in one place.</p>

              <div className="mt-8 space-y-3">
                {perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#05a270]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#05a270]" />
                    </div>
                    <span className="text-[14px] text-gray-600">{perk}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-[#004733]/5 border border-[#004733]/10">
                <p className="text-[13px] text-[#004733] font-medium italic">"The portal made everything so easy. I could see exactly where my loan was at every step."</p>
                <p className="text-[12px] text-gray-400 mt-2">— Sarah M., First-Time Buyer</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
              <div className="text-center mb-6 lg:text-left">
                <h2 className="text-xl font-bold text-[#0c1a14] lg:hidden">Create Your Account</h2>
                <h2 className="text-xl font-bold text-[#0c1a14] hidden lg:block">Get Started</h2>
                <p className="text-gray-500 text-sm mt-1">Free account — no credit card required</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#0c1a14] mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" disabled={isSubmitting} className="h-12 rounded-xl border-gray-200 pl-10" data-testid="input-signup-name" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-[#0c1a14] mb-1.5 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" disabled={isSubmitting} className="h-12 rounded-xl border-gray-200 pl-10" data-testid="input-signup-email" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#0c1a14] mb-1.5 block">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input type="tel" inputMode="numeric" value={phone} onChange={(e) => handlePhoneChange(e.target.value)} placeholder="(619) 550-9000" maxLength={18} disabled={isSubmitting} className="h-12 rounded-xl border-gray-200 pl-10" data-testid="input-signup-phone" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-[#0c1a14] mb-1.5 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" disabled={isSubmitting} className="h-12 rounded-xl border-gray-200 pl-10 pr-10" data-testid="input-signup-password" />
                      <button type="button" disabled={isSubmitting} onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#0c1a14] mb-1.5 block">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm" disabled={isSubmitting} className="h-12 rounded-xl border-gray-200 pl-10" data-testid="input-signup-confirm" />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-[#004733]/10 bg-[#004733]/5 p-4">
                  <Checkbox
                    id="signup-consent"
                    checked={hasAcceptedConsent}
                    onCheckedChange={(checked) => setHasAcceptedConsent(checked === true)}
                    disabled={isSubmitting}
                    className="mt-1 border-[#004733]/40 data-[state=checked]:bg-[#004733] data-[state=checked]:border-[#004733]"
                    aria-label="Required account consent"
                    aria-describedby="signup-consent-text"
                    data-testid="checkbox-signup-consent"
                  />
                  <div id="signup-consent-text" className="text-[12.5px] leading-relaxed text-gray-600">
                    By creating an account, I consent to the{" "}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setActiveConsentInfo("electronicSignatures");
                      }}
                      className="font-semibold text-[#004733] underline underline-offset-2 hover:text-[#003626]"
                      data-testid="link-electronic-signatures-info"
                    >
                      use of electronic signatures
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setActiveConsentInfo("creditInformation");
                      }}
                      className="font-semibold text-[#004733] underline underline-offset-2 hover:text-[#003626]"
                      data-testid="link-credit-information-info"
                    >
                      access of my credit information
                    </button>
                    . I also agree to the{" "}
                    <a href="#" className="font-semibold text-[#004733] underline underline-offset-2 hover:text-[#003626]" data-testid="link-terms-of-service">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="font-semibold text-[#004733] underline underline-offset-2 hover:text-[#003626]" data-testid="link-privacy-policy">
                      Privacy Policy
                    </a>
                    .
                  </div>
                </div>

                {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl bg-[#004733] hover:bg-[#003626] text-white font-semibold gap-2 text-[15px] mt-1" data-testid="button-signup-submit">
                  {isSubmitting ? "Creating Account..." : "Create Account"} <ArrowRight className="w-4 h-4" />
                </Button>
              </form>

              <div className="text-center text-sm text-gray-500 mt-5 space-y-2">
                <p>
                  Already have an account?{" "}
                  <Link href="/login">
                    <span className="text-[#004733] font-semibold hover:underline cursor-pointer" data-testid="link-to-login">Log in</span>
                  </Link>
                </p>
                <p>
                  Forgot your password?{" "}
                  <Link href="/forgot-password">
                    <span className="text-[#004733] font-semibold hover:underline cursor-pointer" data-testid="link-signup-forgot-password">Reset it here</span>
                  </Link>
                </p>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1.5">
                <Shield className="w-3 h-3" />
                Secure client signup with encrypted session handling
              </p>
            </div>
          </div>
        </motion.div>
      </section>
      <Dialog open={activeConsentInfo !== null} onOpenChange={(open) => !open && setActiveConsentInfo(null)}>
        <DialogContent className="max-h-[90vh] max-w-[680px] rounded-3xl border-0 p-7">
          <DialogHeader>
            <DialogTitle className="pr-8 text-xl text-[#0c1a14]">{activeConsentDetails?.title}</DialogTitle>
            <DialogDescription asChild>
              <div className="max-h-[56vh] overflow-y-auto pr-3 pt-3">
                {activeConsentDetails?.description}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 pt-3 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveConsentInfo(null)}
              className="h-11 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
              data-testid="button-consent-cancel"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                setHasAcceptedConsent(true);
                setActiveConsentInfo(null);
              }}
              className="h-11 rounded-xl bg-[#004733] hover:bg-[#003626] text-white"
              data-testid="button-consent-accept"
            >
              I Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

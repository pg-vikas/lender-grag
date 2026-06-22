import { PageLayout } from "./PageLayout";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, isAuthenticated, hasLoadedSession, user, loadSession } = useAuth();
  const [, navigate] = useLocation();

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
    </PageLayout>
  );
}

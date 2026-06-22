import { PageLayout } from "./PageLayout";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading, hasLoadedSession, user, loadSession } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-[#f0faf6] via-white to-[#e8f5ee] relative overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-40 right-[15%] w-[500px] h-[500px] rounded-full bg-[#004733]/5 blur-3xl" />
          <div className="absolute bottom-20 left-[10%] w-[400px] h-[400px] rounded-full bg-[#05a270]/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-[440px] mx-6"
        >
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#004733] flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#0c1a14]">Welcome Back</h1>
              <p className="text-gray-500 text-sm mt-2">Log in to your Lender Greg portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#0c1a14] mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={isSubmitting || isLoading}
                    className="h-12 rounded-xl border-gray-200 pl-10"
                    data-testid="input-login-email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-[#0c1a14]">Password</label>
                  <Link href={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}>
                    <span className="text-xs text-[#05a270] hover:text-[#004733] font-medium transition-colors cursor-pointer" data-testid="link-forgot-password">Forgot password?</span>
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={isSubmitting || isLoading}
                    className="h-12 rounded-xl border-gray-200 pl-10 pr-10"
                    data-testid="input-login-password"
                  />
                  <button
                    type="button"
                    disabled={isSubmitting || isLoading}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full h-12 rounded-xl bg-[#004733] hover:bg-[#003626] text-white font-semibold gap-2 text-[15px] mt-2"
                data-testid="button-login-submit"
              >
                {isSubmitting ? "Logging In..." : "Log In"} <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or</span></div>
            </div>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/signup">
                <span className="text-[#004733] font-semibold hover:underline cursor-pointer" data-testid="link-to-signup">Sign up free</span>
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3" />
            Session-based authentication with role-aware access control.
          </p>
        </motion.div>
      </section>
    </PageLayout>
  );
}

import { PageLayout } from "./PageLayout";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Shield } from "lucide-react";

function getResetToken() {
  if (typeof window === "undefined") {
    return "";
  }

  const params = new URLSearchParams(window.location.search);
  const queryToken = params.get("token");
  if (queryToken) {
    return queryToken;
  }

  const tokenFromPath = window.location.pathname.split("/reset-password/")[1];
  return tokenFromPath ? decodeURIComponent(tokenFromPath.split("/")[0]) : "";
}

export default function ResetPasswordPage() {
  const [token] = useState(getResetToken);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(token ? "" : "This password reset link is missing or invalid.");
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword, isAuthenticated, hasLoadedSession, user, loadSession } = useAuth();
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

    if (!token) {
      setError("This password reset link is missing or invalid.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
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
      await resetPassword(token, password);
      setIsComplete(true);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to reset password. Please request a new link.");
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
              <h1 className="text-2xl font-bold text-[#0c1a14]">Create New Password</h1>
              <p className="text-gray-500 text-sm mt-2">Choose a strong password for your Lender Greg portal.</p>
            </div>

            {isComplete ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-[#05a270]/20 bg-[#05a270]/10 p-5 text-center">
                  <CheckCircle2 className="w-10 h-10 text-[#05a270] mx-auto mb-3" />
                  <p className="text-sm font-medium text-[#004733] leading-relaxed">Your password has been updated. You can now log in with your new password.</p>
                </div>

                <Link href="/login">
                  <Button className="w-full h-12 rounded-xl bg-[#004733] hover:bg-[#003626] text-white font-semibold gap-2 text-[15px]" data-testid="button-reset-login">
                    Go to Login <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#0c1a14] mb-1.5 block">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      disabled={isSubmitting || !token}
                      className="h-12 rounded-xl border-gray-200 pl-10 pr-10"
                      data-testid="input-reset-password"
                    />
                    <button
                      type="button"
                      disabled={isSubmitting || !token}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#0c1a14] mb-1.5 block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      disabled={isSubmitting || !token}
                      className="h-12 rounded-xl border-gray-200 pl-10"
                      data-testid="input-reset-confirm"
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                <Button
                  type="submit"
                  disabled={isSubmitting || !token}
                  className="w-full h-12 rounded-xl bg-[#004733] hover:bg-[#003626] text-white font-semibold gap-2 text-[15px] mt-2"
                  data-testid="button-reset-submit"
                >
                  {isSubmitting ? "Updating Password..." : "Update Password"} <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">need another link?</span></div>
            </div>

            <Link href="/forgot-password">
              <span className="text-center text-sm text-[#004733] font-semibold hover:underline cursor-pointer flex items-center justify-center gap-2" data-testid="link-reset-request-new">
                <ArrowLeft className="w-4 h-4" /> Request a new reset link
              </span>
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3" />
            Secure password reset with expiring one-time links.
          </p>
        </motion.div>
      </section>
    </PageLayout>
  );
}

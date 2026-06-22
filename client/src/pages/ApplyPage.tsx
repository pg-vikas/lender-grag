import { PageLayout, PageHero } from "./PageLayout";
import { ArrowRight, Shield, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const benefits = [
  { icon: Clock, text: "Pre-approval in as little as 24 hours" },
  { icon: Shield, text: "Secure application — your data is protected" },
  { icon: Star, text: "No obligation, no commitment required" },
];

export default function ApplyPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", loanType: "", homePrice: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/apply", form);
      toast({ title: "Application received!", description: "Greg will review your information and reach out within 24 hours." });
      setForm({ name: "", email: "", phone: "", loanType: "", homePrice: "" });
    } catch (error) {
      toast({
        title: "Unable to submit application",
        description: error instanceof Error ? error.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <PageHero
        tag="Apply Now"
        title="Start Your Pre-Approval"
        description="Take the first step toward confident home financing. Fill out the form below and Greg will be in touch within 24 hours."
      />
      <section className="py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-10"
          >
            <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-100">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <b.icon className="w-4 h-4 text-[#05a270]" />
                  {b.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#0c1a14] mb-1.5 block">Full Name</label>
                  <Input
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="h-12 rounded-xl border-gray-200" required disabled={isSubmitting} data-testid="input-apply-name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#0c1a14] mb-1.5 block">Email</label>
                  <Input
                    type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="h-12 rounded-xl border-gray-200" required disabled={isSubmitting} data-testid="input-apply-email"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#0c1a14] mb-1.5 block">Phone</label>
                  <Input
                    type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="h-12 rounded-xl border-gray-200" required disabled={isSubmitting} data-testid="input-apply-phone"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#0c1a14] mb-1.5 block">Target Home Price</label>
                  <Input
                    value={form.homePrice} onChange={e => setForm({ ...form, homePrice: e.target.value })}
                    placeholder="$400,000" className="h-12 rounded-xl border-gray-200" disabled={isSubmitting} data-testid="input-apply-price"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#0c1a14] mb-1.5 block">Loan Type</label>
                <select
                  value={form.loanType}
                  onChange={e => setForm({ ...form, loanType: e.target.value })}
                  className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:border-[#004733] focus:ring-2 focus:ring-[#004733]/20 bg-white"
                  disabled={isSubmitting}
                  required
                  data-testid="select-loan-type"
                >
                  <option value="">Select a loan type</option>
                  <option value="conventional">Conventional</option>
                  <option value="fha">FHA</option>
                  <option value="va">VA</option>
                  <option value="jumbo">Jumbo</option>
                  <option value="refinance">Refinance</option>
                  <option value="other">Other / Not Sure</option>
                </select>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-xl bg-[#004733] hover:bg-[#003626] text-white text-lg font-semibold gap-2 mt-4" data-testid="button-submit-application">
                {isSubmitting ? "Submitting..." : "Submit Application"} <ArrowRight className="w-5 h-5" />
              </Button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-6">
              By submitting this form, you agree to be contacted about mortgage options. Your information is secure and will never be shared.
            </p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}

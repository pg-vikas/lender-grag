import { PageLayout, PageHero } from "./PageLayout";
import { Mail, Phone, MapPin, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "Greg will get back to you within 24 hours." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <PageLayout>
      <PageHero
        tag="Contact"
        title="Let's Talk About Your Goals"
        description="Whether you're ready to apply or just have a question, reach out. We respond within a few hours."
      />
      <section className="py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-16">
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-[#0c1a14] mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="h-12 rounded-xl border-gray-200 focus:border-[#004733] focus:ring-[#004733]/20"
                    required
                    data-testid="input-name"
                  />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="h-12 rounded-xl border-gray-200 focus:border-[#004733] focus:ring-[#004733]/20"
                    required
                    data-testid="input-email"
                  />
                </div>
                <Input
                  placeholder="Phone Number (optional)"
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="h-12 rounded-xl border-gray-200 focus:border-[#004733] focus:ring-[#004733]/20"
                  data-testid="input-phone"
                />
                <textarea
                  placeholder="How can Greg help you?"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#004733] focus:ring-2 focus:ring-[#004733]/20 resize-none"
                  required
                  data-testid="input-message"
                />
                <Button type="submit" className="h-12 px-8 rounded-xl bg-[#004733] hover:bg-[#003626] text-white font-semibold gap-2" data-testid="button-send-message">
                  <Send className="w-4 h-4" /> Send Message
                </Button>
              </form>
            </motion.div>

            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-[#0c1a14] mb-6">Contact Info</h2>
              <div className="space-y-6">
                <a href="tel:+16195551234" className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-xl bg-[#004733]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#004733] transition-colors">
                    <Phone className="w-5 h-5 text-[#004733] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0c1a14]">Phone</p>
                    <p className="text-gray-500 text-sm">(619) 550-9885</p>
                  </div>
                </a>
                <a href="mailto:greg@lendergreg.com" className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-xl bg-[#004733]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#004733] transition-colors">
                    <Mail className="w-5 h-5 text-[#004733] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0c1a14]">Email</p>
                    <p className="text-gray-500 text-sm">greg@lendergreg.com</p>
                  </div>
                </a>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#004733]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#004733]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0c1a14]">Office</p>
                    <p className="text-gray-500 text-sm">San Diego, CA</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 rounded-2xl bg-[#f0faf6] border border-[#004733]/10">
                <h3 className="font-bold text-[#0c1a14] mb-2">Prefer to talk live?</h3>
                <p className="text-gray-600 text-sm mb-4">Schedule a free 15-minute intro call to discuss your goals and options.</p>
                <Button variant="outline" className="rounded-xl border-[#004733]/20 text-[#004733] font-semibold gap-2 hover:bg-[#004733]/5 w-full" data-testid="button-schedule-call">
                  Book a Call <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

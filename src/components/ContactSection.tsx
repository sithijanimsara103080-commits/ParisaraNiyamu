import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Send, MapPin, Mail, Phone, Clock } from "lucide-react";
import { toast } from "sonner";

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [lang, setLang] = useState<"en" | "si">("en");

  useEffect(() => {
    const handleLangChange = (e: any) => setLang(e.detail);
    window.addEventListener("langChange", handleLangChange);
    return () => window.removeEventListener("langChange", handleLangChange);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill all fields.");
      return;
    }
    toast.success("Message sent! We'll get back to you soon. 🌿");
    setForm({ name: "", email: "", message: "" });
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: lang === "en" ? "Address" : "ලිපිනය",
      text: lang === "en"
        ? "Rajapaksa Central College, Tangalle Road, Weeraketiya"
        : "රාජපක්ෂ මධ්‍ය විද්‍යාලය, තංගල්ල පාර, වීරකැටිය",
    },
    {
      icon: Mail,
      label: lang === "en" ? "Email" : "ඊමේල්",
      text: "radapasaenvironment@gmail.com",
    },
    {
      icon: Phone,
      label: lang === "en" ? "Phone" : "දුරකථන",
      text: "+94 47 224 1234",
    },
    {
      icon: Clock,
      label: lang === "en" ? "Active Hours" : "ක්‍රියාකාරී වේලාවන්",
      text: lang === "en" ? "Mon - Fri, 7:30 AM - 1:30 PM" : "සඳු - සිකු, පෙ.ව 7:30 - ප.ව 1:30",
    },
  ];

  return (
    <section id="contact" className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-foreground mb-4">
            {lang === "en" ? "Get in " : "සම්බන්ධ "}
            <span className="text-gradient">{lang === "en" ? "Touch" : "වන්න"}</span>
          </h2>
          <p className="text-muted-foreground text-lg font-light max-w-lg mx-auto">
            {lang === "en"
              ? "Have a question or want to join our mission? We'd love to hear from you."
              : "ප්‍රශ්නයක් තිබේද? අපගේ මෙහෙවරට එක්වීමට කැමතිද? ඔබගෙන් ඇසීමට අපි කැමතියි."}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="glass-card p-8 space-y-5"
          >
            <div>
              <label className="text-sm text-muted-foreground mb-1 block font-medium">
                {lang === "en" ? "Your Name" : "ඔබගේ නම"}
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-input/50 border border-glass-border/30 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                placeholder={lang === "en" ? "Enter your name" : "ඔබගේ නම ඇතුලත් කරන්න"}
                maxLength={100}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block font-medium">
                {lang === "en" ? "Email" : "ඊමේල්"}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-input/50 border border-glass-border/30 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                placeholder="your@email.com"
                maxLength={255}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block font-medium">
                {lang === "en" ? "Message" : "පණිවිඩය"}
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                className="w-full bg-input/50 border border-glass-border/30 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all"
                placeholder={lang === "en" ? "How can we help?" : "අපට කෙසේ උදව් කළ හැකිද?"}
                maxLength={1000}
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-[1.02] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
            >
              <Send className="w-4 h-4" />
              {lang === "en" ? "Send Message" : "පණිවිඩය යවන්න"}
            </button>
          </motion.form>

          {/* Info + Map */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-6"
          >
            <div className="glass-card p-6 space-y-5">
              {contactInfo.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <item.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest mb-0.5">{item.label}</p>
                    <p className="text-foreground text-sm font-medium">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Google Maps Embed */}
            <div className="glass-card overflow-hidden rounded-[2rem] h-72 shadow-xl shadow-emerald-900/5">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15867.913342800404!2d80.771236!3d6.133613!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae14db376410fb1%3A0x962895e28f03c339!2zUmFqYXBha3NhIENlbnRyYWwgQ29sbGVnZSAtIFdlZXJha2V0aXlhIHwg4La74LeP4Lai4La04Laa4LeK4LaCIOC2uOC2sOC3iOKAjeC2uiDgt4Dgt5Lgtq_gt4rigI3gtrrgt4_gtr3gtrog4oCTIOC3gOC3k+C2u+C2muC3kOC2p+C3kuC2ug!5e0!3m2!1sen!2slk!4v1774467386554!5m2!1sen!2slk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Rajapaksa Central College - Weeraketiya"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

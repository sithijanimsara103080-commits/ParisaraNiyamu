import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Menu, X, Globe } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "si">("en");

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "si" : "en";
    setLang(newLang);
    window.dispatchEvent(new CustomEvent("langChange", { detail: newLang }));
  };

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const navItems = [
    { name: lang === "en" ? "Home" : "මුල් පිටුව", id: "home" },
    { name: lang === "en" ? "About" : "අප ගැන", id: "about" },
    { name: lang === "en" ? "Board" : "මණ්ඩලය", id: "board" },
    { name: lang === "en" ? "Events" : "සිදුවීම්", id: "events" },
    { name: lang === "en" ? "Gallery" : "ඡායාරූප", id: "gallery" },
    { name: lang === "en" ? "Resources" : "සම්පත්", id: "resources" },
    { name: lang === "en" ? "Contact" : "සබඳතා", id: "contact" },
  ];

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  return (
    <nav className={`fixed top-0 left-0 right-0 glass-nav transition-all duration-300 ${open ? 'z-[300]' : 'z-[60]'}`}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <button onClick={() => scrollTo("home")} className="flex items-center gap-3 group text-left">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform border border-primary/20 shadow-glow shadow-primary/5">
            <Leaf className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
          </div>
          <div className="flex flex-col -space-y-0.5 max-w-[180px] sm:max-w-none">
            <span className="font-display text-base sm:text-lg font-bold text-foreground tracking-tight leading-none truncate">
              {lang === "en" ? "Parisara" : "පාරිසරික"}
            </span>
            <span className="text-[10px] sm:text-[11px] text-primary font-bold tracking-[0.1em] uppercase">
              {lang === "en" ? "Niyamu Sangamaya" : "නියමුවෝ සංගමය"}
            </span>
          </div>
        </button>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-2xl border border-gray-200/50 backdrop-blur-md">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm shadow-transparent hover:shadow-gray-200/50"
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-gray-200 mx-3" />

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all text-xs font-bold shadow-lg shadow-primary/20"
          >
            <Globe className="w-4 h-4" />
            <span>{lang === "en" ? "සිංහල" : "English"}</span>
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={toggleLanguage}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 border border-gray-200 text-primary hover:bg-primary/5 transition-colors"
          >
            <Globe className="w-5 h-5" />
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Full Screen Mobile Menu – rendered via Portal to escape 3D stacking contexts */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Dim Backdrop */}
              <motion.div
                key="blur-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[9998] lg:hidden bg-black/20"
                onClick={() => setOpen(false)}
              />

              {/* Sliding Menu Panel – fully opaque white */}
              <motion.div
                key="menu-panel"
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-[9999] lg:hidden bg-white flex flex-col"
              >
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between px-6 h-20 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Leaf className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex flex-col -space-y-0.5">
                      <span className="font-display text-base font-bold text-foreground">Pioneers</span>
                      <span className="text-[10px] text-primary font-bold tracking-widest uppercase">Sangamaya</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-100 text-foreground hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 flex flex-col justify-center px-8 gap-4">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      onClick={() => scrollTo(item.id)}
                      className="text-4xl md:text-5xl font-display font-extrabold text-foreground hover:text-primary transition-colors text-left flex items-center gap-4 group"
                    >
                      <span className="text-sm font-mono text-primary/40 group-hover:text-primary transition-colors">0{index + 1}</span>
                      {item.name}
                    </motion.button>
                  ))}
                </nav>

                {/* Bottom Footer Area */}
                <div className="p-8 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20"
                  >
                    <Globe className="w-5 h-5" />
                    <span>{lang === "en" ? "සිංහල" : "English"}</span>
                  </button>
                  <div className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
                    © 2026 Radapasa Pioneers Society
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </nav>
  );
}

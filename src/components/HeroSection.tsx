import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import LeafParticles from "./LeafParticles";
import HeroDecoration from "./HeroDecoration";

export default function HeroSection() {
  const [lang, setLang] = useState<"en" | "si">("en");

  useEffect(() => {
    const handleLangChange = (e: any) => setLang(e.detail);
    window.addEventListener("langChange", handleLangChange);
    return () => window.removeEventListener("langChange", handleLangChange);
  }, []);

  const content = {
    tagline: lang === "en" ? "🌿 Radapasa Environmental Pioneers Society" : "🌿 රාදපාස පාරිසරික නියමුවෝ සංගමය",
    headline: lang === "en" ? "Radapasa Environmental Pioneers" : "රාදපාස පාරිසරික නියමුවෝ",
    description: lang === "en"
      ? "Join our mission to create a greener, cleaner, and more sustainable future — one tree, one action at a time."
      : "තිරසර හෙටක් උදෙසා වඩාත් පිරිසිදු සහ හරිතවත් හෙටක් නිර්මාණය කිරීමේ අපගේ මෙහෙවරට අත්වැලක් වන්න.",
    joinBtn: lang === "en" ? "Join the Movement" : "අප හා එක්වන්න",
    learnBtn: lang === "en" ? "Learn More" : "වැඩි විස්තර",
  };

  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center pt-24 md:pt-20 overflow-hidden">
      {/* Clean background overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background z-0" />
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full z-0 opacity-40" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-emerald-500/10 blur-[100px] rounded-full z-0 opacity-40" />

      {/* Animated Particles */}
      <LeafParticles />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20 text-center lg:text-left pt-8 lg:pt-0 order-2 lg:order-1"
          >
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 group cursor-default backdrop-blur-md"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-primary font-bold tracking-widest uppercase text-[10px]">
                {content.tagline}
              </span>
            </motion.div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-foreground leading-[1.1] mb-6 drop-shadow-sm">
              <span className="text-gradient">Parisara</span><br />
              {lang === "en" ? "Pioneers" : "නියමුවෝ"}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground text-base md:text-lg max-w-lg mb-10 leading-relaxed font-light mx-auto lg:mx-0">
              {content.description}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 sm:gap-6">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 overflow-hidden shadow-2xl shadow-primary/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                <span>{content.joinBtn}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                className="group px-8 py-4 glass-card text-foreground font-bold rounded-2xl border border-primary/20 hover:border-primary/50 transition-all duration-500"
              >
                {content.learnBtn}
              </motion.button>
            </div>
          </motion.div>

          {/* 3D Visualization / HeroDecoration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative order-1 lg:order-2 mt-4 lg:mt-0"
          >
            <Suspense
              fallback={
                <div className="w-full h-[300px] flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              }
            >
              <HeroDecoration />
            </Suspense>

            {/* Subtle floating background effects specifically for the card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden sm:block"
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}


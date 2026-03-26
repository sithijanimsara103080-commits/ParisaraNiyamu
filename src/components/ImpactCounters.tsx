import { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { TreePine, Recycle, Users, Globe } from "lucide-react";

function AnimatedNumber({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2500;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function ImpactCounters() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [lang, setLang] = useState<"en" | "si">("en");

  useEffect(() => {
    const handleLangChange = (e: any) => setLang(e.detail);
    window.addEventListener("langChange", handleLangChange);
    return () => window.removeEventListener("langChange", handleLangChange);
  }, []);

  const counters = [
    {
      icon: TreePine,
      label: lang === "en" ? "Trees Planted" : "පැල සිටුවීම",
      target: 1250, suffix: "+", color: "text-emerald-400"
    },
    {
      icon: Recycle,
      label: lang === "en" ? "Waste Recycled" : "ප්‍රතිචක්‍රීකරණය",
      target: 840, suffix: "kg", color: "text-blue-400"
    },
    {
      icon: Users,
      label: lang === "en" ? "Eco-Warriors" : "පරිසර හිතකාමීන්",
      target: 450, suffix: "", color: "text-orange-400"
    },
    {
      icon: Globe,
      label: lang === "en" ? "Projects Done" : "නිමකළ ව්‍යාපෘති",
      target: 24, suffix: "", color: "text-indigo-400"
    },
  ];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div style={{ y }} className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {counters.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="glass-card p-10 text-center group relative overflow-hidden border border-primary/10 rounded-3xl hover:border-primary/40 hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className={`w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                <c.icon className={`w-8 h-8 ${c.color} group-hover:text-primary transition-colors`} />
              </div>

              <div className="text-4xl md:text-5xl font-display font-extrabold text-foreground mb-2 tracking-tight">
                <AnimatedNumber target={c.target} suffix={c.suffix} inView={inView} />
              </div>
              <p className="text-muted-foreground font-bold text-[10px] md:text-xs tracking-widest uppercase">{c.label}</p>

              <div className="mt-8 w-8 h-1 bg-primary/30 mx-auto rounded-full group-hover:w-16 transition-all duration-500 shadow-glow shadow-primary" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Target, Eye, GraduationCap, Sprout } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants } from "./ScrollAnimations";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [lang, setLang] = useState<"en" | "si">("en");
  const [items, setItems] = useState<Database['public']['Tables']['about_items'][]>([]);

  useEffect(() => {
    const handleLangChange = (e: any) => setLang(e.detail);
    window.addEventListener("langChange", handleLangChange);

    // Fetch about items from Supabase
    const fetchAbout = async () => {
      try {
        const { data, error } = await supabase
          .from("about_items")
          .select("*")
          .order("sort_order", { ascending: true });

        if (error) {
          console.warn("⚠️ About fetch error:", error.message);
          console.log("📍 Using fallback about items");
          return; // Use fallback items
        }

        if (data && data.length > 0) {
          console.log("✅ Loaded", data.length, "about items from database");
          console.log("📦 About items:", data);
          console.log("📦 First item details:", {
            id: (data as any)[0]?.id,
            title: (data as any)[0]?.title,
            description: (data as any)[0]?.description, // Changed to description
            description_si: (data as any)[0]?.description_si // Changed to description_si
          });
          setItems(data as Database['public']['Tables']['about_items'][]);
        } else {
          console.warn("⚠️ No about items found in database");
          console.log("📍 Using fallback about items");
        }
      } catch (err) {
        console.error("❌ About fetch exception:", err);
        console.log("📍 Using fallback about items");
      }
    };

    fetchAbout();

    return () => window.removeEventListener("langChange", handleLangChange);
  }, []);

  const noDataMessage = lang === "en" 
    ? "No about items added yet. Check back soon!"
    : "තවම කිසිදු තොරතුරු එක් කර නැත. ඉතා ඉක්මනින් බලන්න!";

  const cards = items.length > 0 
    ? items.map((item, i) => {
        // Changed console logs and data mapping to use 'description'
        console.log(`📋 Item ${i}:`, { title: item.title, description: item.description, description_si: item.description_si });
        return {
          icon: i === 0 ? Target : i === 1 ? Eye : GraduationCap,
          title: lang === "en" ? item.title : item.title_si || item.title,
          desc: lang === "en" ? item.description : item.description_si || item.description,
          gradient: i % 3 === 0 ? "from-emerald-500/20 to-teal-500/20" : i % 3 === 1 ? "from-blue-500/20 to-indigo-500/20" : "from-orange-500/20 to-amber-500/20"
        };
      })
    : [];

  return (
    <section id="about" className="py-32 relative overflow-hidden" ref={ref}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48" />

      <div className="container mx-auto px-4">
        <ScrollReveal animation="fadeUp">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-4">
              <Sprout className="w-10 h-10 text-primary animate-bounce-slow" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-foreground mb-6 leading-tight">
              {lang === "en" ? "About Our Society" : "අපේ සංගමය ගැන"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light leading-relaxed">
              {lang === "en"
                ? "Established to foster environmental awareness, our Radapasa Environmental Pioneers Society has been at the forefront of ecological initiatives since its inception."
                : "පාරිසරික දැනුවත්භාවය ඇති කිරීම සඳහා පිහිටුවන ලද අපගේ රාදපාස පාරිසරික නියමුවෝ සංගමය එහි ආරම්භයේ සිටම පාරිසරික මුල පිරීම්වල ඉදිරියෙන්ම සිටී."}
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-8">
          {cards.length > 0 ? (
            cards.map((item, i) => (
              <motion.div
                key={item.title}
                variants={staggerItemVariants}
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl rounded-3xl -z-10`} />

                <div className="glass-card p-10 h-full border border-primary/10 group-hover:border-primary/30 transition-all duration-500 flex flex-col hover:shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-lg">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground mb-4">{item.title}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed font-light mb-4">
                    {item.desc && item.desc.trim() ? item.desc : "Description not available"}
                  </p>

                  <div className="mt-auto pt-8">
                    <div className="w-full h-[1px] bg-gradient-to-r from-primary/40 to-transparent" />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">{noDataMessage}</p>
            </div>
          )}
        </StaggerContainer>
      </div>
    </section>
  );
}
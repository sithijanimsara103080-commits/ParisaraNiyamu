import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TreePine, Recycle, Megaphone, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { ScrollReveal, StaggerContainer, staggerItemVariants } from "./ScrollAnimations";

const categories = ["All", "Tree Planting", "Recycling", "Awareness"];

const iconMap: Record<string, typeof TreePine> = {
  "Tree Planting": TreePine,
  Recycling: Recycle,
  Awareness: Megaphone,
};

const colorMap: Record<string, string> = {
  "Tree Planting": "bg-emerald-500/10",
  Recycling: "bg-blue-500/10",
  Awareness: "bg-amber-500/10",
};

export default function EventsSection() {
  const [filter, setFilter] = useState("All");
  const [events, setEvents] = useState<Database['public']['Tables']['events'][]>([]);
  const [lang, setLang] = useState<"en" | "si">("en");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLangChange = (e: any) => setLang(e.detail);
    window.addEventListener("langChange", handleLangChange);

    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("⚠️ Events fetch error:", error.message);
          return;
        }

        if (data) {
          console.log("✅ Loaded events from database:", data.length);
          setEvents(data as Database['public']['Tables']['events'][]);
        }
      } catch (err) {
        console.error("❌ Events fetch exception:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
    return () => window.removeEventListener("langChange", handleLangChange);
  }, []);

  const filtered = filter === "All" ? events : events.filter(e => e.category === filter);

  const t = {
    title: lang === "en" ? "Upcoming Events" : "ඉදිරි සිදුවීම්",
    gallery: lang === "en" ? "Activity Highlights" : "විශේෂ අවස්ථා",
    noEvents: lang === "en" ? "No events found." : "සිදුවීම් කිසිවක් හමු නොවීය.",
    categories: {
      "All": lang === "en" ? "All" : "සියල්ල",
      "Tree Planting": lang === "en" ? "Tree Planting" : "පැළ සිටුවීම",
      "Recycling": lang === "en" ? "Recycling" : "ප්‍රතිචක්‍රීකරණය",
      "Awareness": lang === "en" ? "Awareness" : "දැනුවත් කිරීම",
    }
  };

  return (
    <section id="events" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <ScrollReveal animation="fadeUp">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {t.title} & <span className="text-primary">{t.gallery}</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Dynamic Category Filters */}
        <ScrollReveal animation="fadeUp" delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  filter === c 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                  : "glass-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.categories[c as keyof typeof t.categories] || c}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Events Grid */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.08}>
          {filtered.length > 0 ? (
            filtered.map((e) => {
              const Icon = iconMap[e.category || ""] || TreePine;
              return (
                <motion.div
                  key={e.id}
                  variants={staggerItemVariants}
                  whileHover={{ y: -10 }}
                  className="glass-card overflow-hidden group border border-primary/5 hover:border-primary/20 transition-all duration-500 flex flex-col h-full"
                >
                  {/* Category Based Icon Background */}
                  <div className={`h-32 flex items-center justify-center relative ${colorMap[e.category || ""] || "bg-primary/10"}`}>
                    <Icon className="w-12 h-12 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    {/* Date from Database */}
                    <div className="flex items-center gap-2 text-primary text-xs font-bold mb-3">
                      <Calendar className="w-3 h-3" />
                      {e.date}
                    </div>

                    {/* Title - Language Sensitive */}
                    <h3 className="text-xl font-display font-bold text-foreground mb-3 leading-tight">
                      {lang === "en" ? e.title : e.title_si || e.title}
                    </h3>

                    {/* Description - Language Sensitive */}
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {lang === "en" ? e.description : e.description_si || e.description}
                    </p>

                    <div className="mt-auto pt-6">
                       <div className="w-10 h-1 bg-primary/20 rounded-full group-hover:w-full transition-all duration-500" />
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : !isLoading && (
            <div className="col-span-full text-center py-20">
              <p className="text-muted-foreground italic text-lg">{t.noEvents}</p>
            </div>
          )}
        </StaggerContainer>
      </div>
    </section>
  );
}
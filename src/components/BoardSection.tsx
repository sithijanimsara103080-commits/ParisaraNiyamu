import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Tilt from "react-parallax-tilt";
import { User } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants } from "./ScrollAnimations";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export default function BoardSection() {
  const [lang, setLang] = useState<"en" | "si">("en");
  const [members, setMembers] = useState<Database['public']['Tables']['board_members'][]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLangChange = (e: any) => setLang(e.detail);
    window.addEventListener("langChange", handleLangChange);

    // Fetch board members from Supabase
    const fetchBoard = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("board_members")
          .select("*")
          .order("sort_order", { ascending: true });

        if (error) {
          console.warn("⚠️ Board fetch error:", error.message);
          return;
        }

        if (data) {
          console.log("✅ Loaded board members:", data.length);
          setMembers(data as Database['public']['Tables']['board_members'][]);
        }
      } catch (err) {
        console.error("❌ Board fetch exception:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoard();

    return () => window.removeEventListener("langChange", handleLangChange);
  }, []);

  const content = {
    title: lang === "en" ? "Executive Board" : "විධායක මණ්ඩලය",
    subtitle: lang === "en" ? "The passionate leaders driving our green mission." : "අපගේ හරිත මෙහෙවර මෙහෙයවන උද්‍යෝගිමත් නායකයින්.",
  };

  return (
    <section id="board" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <ScrollReveal animation="fadeUp">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">
              {content.title}
            </h2>
            <p className="text-muted-foreground text-lg font-light">{content.subtitle}</p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.12}>
          {members.length > 0 ? (
            members.map((m) => (
              <motion.div
                key={m.id}
                variants={staggerItemVariants}
              >
                <Tilt
                  tiltMaxAngleX={8}
                  tiltMaxAngleY={8}
                  glareEnable
                  glareMaxOpacity={0.1}
                  glareColor="hsl(var(--primary))"
                  glareBorderRadius="1.5rem"
                  className="w-full h-full"
                >
                  <div className="glass-card p-10 text-center transition-all duration-500 hover:shadow-2xl hover:border-primary/40 border border-primary/10 rounded-3xl h-full group flex flex-col items-center">
                    {/* Icon/Image container - Uses 'color' column from DB for gradient */}
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${m.color || 'from-primary/20 to-primary/10'} overflow-hidden flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                      {(m as any).image_url ? (
                        <img src={(m as any).image_url} alt={m.name || ''} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-primary" />
                      )}
                    </div>

                    {/* Name - English or Sinhala */}
                    <h3 className="text-xl font-display font-bold text-foreground mb-2">
                      {lang === "en" ? m.name : m.name_si || m.name}
                    </h3>

                    {/* Position - English (role) or Sinhala (position_si) */}
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                      {lang === "en" ? m.role : m.position_si || m.role}
                    </div>

                    <div className="mt-auto pt-8 w-full flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-2 h-2 rounded-full bg-primary/40" />
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="w-2 h-2 rounded-full bg-primary/40" />
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))
          ) : !isLoading && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground italic">
                {lang === "en" ? "No board members found." : "විධායක මණ්ඩල සාමාජිකයින් හමු නොවීය."}
              </p>
            </div>
          )}
        </StaggerContainer>
      </div>
    </section>
  );
}
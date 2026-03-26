import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Camera, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { ScrollReveal, StaggerContainer, staggerItemVariants } from "./ScrollAnimations";

export default function GallerySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [lang, setLang] = useState<"en" | "si">("en");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLangChange = (e: any) => setLang(e.detail);
    window.addEventListener("langChange", handleLangChange);

    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("gallery_items")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("⚠️ Gallery fetch error:", error.message);
          return;
        }

        if (data) {
          // මෙතනදී data ටික random shuffle කරලා මුල් 5 විතරක් ගන්නවා
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          setItems(shuffled);
        }
      } catch (err) {
        console.error("❌ Gallery fetch exception:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
    return () => window.removeEventListener("langChange", handleLangChange);
  }, []);

  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex(i => (i !== null ? (i - 1 + items.length) % items.length : null));
  const next = () => setLightboxIndex(i => (i !== null ? (i + 1) % items.length : null));

  // Main section එකේ පෙන්වන්නේ මුල් items 5 විතරයි
  const displayItems = items.slice(0, 5);

  const t = {
    title: lang === "en" ? "Photo Gallery" : "ඡායාරූප ගැලරිය",
    subtitle: lang === "en" ? "Highlights from our environmental activities and green initiatives." : "අපගේ පාරිසරික ක්‍රියාකාරකම් සහ හරිත මුල පිරීම්වල විශේෂ අවස්ථා.",
    button: lang === "en" ? "Explore More Activities" : "තවත් ක්‍රියාකාරකම් ගවේෂණය කරන්න",
  };

  return (
    <>
      <section id="gallery" className="py-24 relative overflow-hidden" ref={ref}>
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-extrabold text-foreground mb-4">
                {t.title}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light leading-relaxed">
                {t.subtitle}
              </p>
            </div>
          </ScrollReveal>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : (
            <>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
                {displayItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    variants={staggerItemVariants}
                    whileHover={{ y: -8 }}
                    className={`glass-card overflow-hidden group cursor-pointer border border-primary/10 rounded-3xl hover:border-primary/40 transition-all duration-500 ${
                      i === 0 ? "lg:col-span-2 lg:row-span-1" : "" // පලවෙනි පින්තූරය ටිකක් ලොකුවට පේන්න හදල තියෙන්නේ
                    }`}
                    onClick={() => setLightboxIndex(i)}
                  >
                    <div className="relative aspect-video lg:aspect-auto lg:h-full min-h-[250px] overflow-hidden bg-muted">
                      <img 
                        src={item.image_url} 
                        alt={lang === "en" ? item.title : item.title_si || item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                        <Camera className="w-10 h-10 text-white drop-shadow-lg" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-white font-bold text-lg leading-tight">
                          {lang === "en" ? item.title : item.title_si || item.title}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </StaggerContainer>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                className="flex justify-center mt-12"
              >
                <Link
                  to="/gallery"
                  className="group px-10 py-4 glass-card border-primary/20 hover:border-primary/50 text-foreground font-bold rounded-2xl flex items-center gap-3 transition-all hover:scale-105"
                >
                  <span>{t.button}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Lightbox logic remains the same but uses the 'items' array */}
      <AnimatePresence>
        {lightboxIndex !== null && items[lightboxIndex] && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4" 
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-8 right-8 text-foreground/70 hover:text-foreground p-2 z-[70]"><X className="w-8 h-8" /></button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-foreground/70 hover:text-foreground p-2 z-[70]"><ChevronLeft className="w-10 h-10" /></button>
            
            <motion.div key={lightboxIndex} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black">
                <img src={items[lightboxIndex].image_url} className="w-full h-auto max-h-[75vh] object-contain mx-auto" />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
                  <h3 className="text-white font-bold text-2xl">{lang === "en" ? items[lightboxIndex].title : items[lightboxIndex].title_si || items[lightboxIndex].title}</h3>
                  <p className="text-white/80 mt-2">{lang === "en" ? items[lightboxIndex].description : items[lightboxIndex].description_si || items[lightboxIndex].description}</p>
                </div>
              </div>
            </motion.div>

            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-foreground/70 hover:text-foreground p-2 z-[70]"><ChevronRight className="w-10 h-10" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
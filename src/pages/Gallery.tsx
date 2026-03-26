import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, ChevronLeft, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import Footer from "@/components/Footer";

export default function GalleryPage() {
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
                    setItems(data.map((d: any) => ({
                        ...d,
                        title_si: d.title_si || d.title,
                        description: d.description || "",
                        description_si: d.description_si || d.description || ""
                    })));
                }
            } catch (err) {
                console.error("❌ Gallery fetch exception:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGallery();
        window.scrollTo(0, 0);

        return () => window.removeEventListener("langChange", handleLangChange);
    }, []);

    const closeLightbox = () => setLightboxIndex(null);
    const prev = () => setLightboxIndex(i => (i !== null ? (i - 1 + items.length) % items.length : null));
    const next = () => setLightboxIndex(i => (i !== null ? (i + 1) % items.length : null));

    const content = {
        back: lang === "en" ? "Back to Home" : "මුල් පිටුවට",
        title: lang === "en" ? "Full Portfolio" : "සම්පූර්ණ එකතුව",
        desc: lang === "en"
            ? "Explore our complete collection of environmental initiatives and events."
            : "සියලුම පාරිසරික මුල පිරීම් සහ සිදුවීම්වල සම්පූර්ණ එකතුව ගවේෂණය කරන්න.",
        noItems: lang === "en" ? "No photos found in the gallery." : "ගැලරියේ ඡායාරූප කිසිවක් හමු නොවීය."
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Navbar (Header) එක මෙතනින් අයින් කරලා තියෙන්නේ */}

            <main className="pt-16 pb-24">
                <div className="container mx-auto px-4">
                    <div className="mb-16">
                        <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/70 transition-colors mb-8 group bg-primary/10 px-4 py-2 rounded-full">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
                            <span className="text-sm uppercase tracking-widest">{content.back}</span>
                        </Link>
                        <h1 className="text-5xl md:text-6xl font-display font-extrabold text-foreground animate-fade-slide-in">
                            {content.title}
                        </h1>
                        <p className="text-muted-foreground mt-6 max-w-2xl text-lg font-light leading-relaxed">
                            {content.desc}
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        </div>
                    ) : items.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {items.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.5 }}
                                    className="glass-card overflow-hidden group cursor-pointer border border-primary/10 rounded-3xl hover:border-primary/40 hover:shadow-2xl transition-all duration-500"
                                    onClick={() => setLightboxIndex(i)}
                                >
                                    <div className="relative aspect-square overflow-hidden bg-muted">
                                        <img 
                                            src={item.image_url} 
                                            alt={lang === "en" ? item.title : item.title_si || item.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-foreground font-bold text-sm truncate group-hover:text-primary transition-colors">
                                            {lang === "en" ? item.title : item.title_si || item.title}
                                        </h3>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground italic text-lg">{content.noItems}</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            <AnimatePresence>
                {lightboxIndex !== null && items[lightboxIndex] && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-12"
                        onClick={closeLightbox}
                    >
                        <button onClick={closeLightbox} className="absolute top-8 right-8 text-foreground/70 hover:text-foreground transition-colors p-2 rounded-full hover:bg-white/10 z-[80]"><X className="w-8 h-8" /></button>
                        <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-6 text-foreground/70 hover:text-foreground transition-all p-2 rounded-full hover:bg-white/10 hover:scale-110 z-[80]"><ChevronLeft className="w-12 h-12" /></button>
                        
                        <motion.div
                            key={lightboxIndex}
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="max-w-6xl w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="bg-muted/10 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl bg-black/40">
                                <img 
                                    src={items[lightboxIndex].image_url} 
                                    alt={lang === "en" ? items[lightboxIndex].title : items[lightboxIndex].title_si || items[lightboxIndex].title} 
                                    className="w-full h-auto max-h-[65vh] object-contain mx-auto bg-black/10" 
                                />
                                <div className="p-10 text-center backdrop-blur-md bg-background/40">
                                    <h3 className="text-white font-display font-bold text-3xl mb-3 tracking-tight">
                                        {lang === "en" ? items[lightboxIndex].title : items[lightboxIndex].title_si || items[lightboxIndex].title}
                                    </h3>
                                    <p className="text-white/80 text-xl font-light max-w-3xl mx-auto leading-relaxed">
                                        {lang === "en" ? items[lightboxIndex].description : items[lightboxIndex].description_si || items[lightboxIndex].description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                        
                        <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-6 text-foreground/70 hover:text-foreground transition-all p-2 rounded-full hover:bg-white/10 hover:scale-110 z-[80]"><ChevronRight className="w-12 h-12" /></button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
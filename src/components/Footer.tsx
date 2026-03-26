import { Leaf } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const [lang, setLang] = useState<"en" | "si">("en");

  useEffect(() => {
    const handleLangChange = (e: any) => setLang(e.detail);
    window.addEventListener("langChange", handleLangChange);
    return () => window.removeEventListener("langChange", handleLangChange);
  }, []);

  return (
    <footer className="py-12 border-t border-glass-border/10 bg-background/50 backdrop-blur-md">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 group cursor-default">
          <Leaf className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
          <span className="font-display font-bold text-foreground">Radapasa Environmental Pioneers Society</span>
        </div>
        <p className="text-muted-foreground text-sm font-light">
          © {new Date().getFullYear()} {lang === "en" ? "Radapasa Environmental Pioneers Society. All Rights Reserved." : "රාදපාස පාරිසරික නියමුවෝ සංගමය. සියලුම හිමිකම් ඇවිරිණි."}
        </p>
        <p className="text-[10px] text-primary/50 mt-2 tracking-widest uppercase">
          {lang === "en" ? "Nurturing Nature, Building Tomorrow" : "ස්වභාවධර්මය පෝෂණය කරමින්, හෙට දිනය ගොඩනඟමු"}
        </p>
      </div>
    </footer>
  );
}

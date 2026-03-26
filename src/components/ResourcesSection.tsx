import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { FileText, Download } from "lucide-react";
import { useRef } from "react";
import { ScrollReveal, StaggerContainer, staggerItemVariants } from "./ScrollAnimations";
import { Button } from "./ui/button";

// මෙන්න මචං Real Links ටික දාලා හදපු Hard-coded array එක
const resources = [
  {
    id: "1",
    title: "WWF Sustainability Guide 2025",
    title_si: "WWF තිරසාර ජීවන මාර්ගෝපදේශය",
    description: "A professional guide by World Wildlife Fund on how to live an eco-friendly life.",
    description_si: "පරිසර හිතකාමී ජීවිතයක් ගත කරන ආකාරය පිළිබඳ WWF ආයතනයේ නිල මාර්ගෝපදේශය.",
    resource_type: "PDF Guide",
    file_url: "https://assets.worldwildlife.org/fedora/fedora/objects/collab:8/datastreams/rel:2/content"
  },
  {
    id: "2",
    title: "EPA Recycling Handbook",
    title_si: "EPA ප්‍රතිචක්‍රීකරණ අත්පොත",
    description: "Official handbook on waste management and effective recycling techniques.",
    description_si: "අපද්‍රව්‍ය කළමනාකරණය සහ නිවැරදි ප්‍රතිචක්‍රීකරණ ක්‍රම පිළිබඳ නිල අත්පොත.",
    resource_type: "Handbook",
    file_url: "https://www.epa.gov/sites/default/files/2016-04/documents/recycling_guide_0.pdf"
  },
  {
    id: "3",
    title: "NASA Climate Change Resources",
    title_si: "NASA දේශගුණික විපර්යාස සම්පත්",
    description: "Educational materials about global warming and climate actions for students.",
    description_si: "ගෝලීය උණුසුම සහ දේශගුණික විපර්යාස පිළිබඳ සිසුන් සඳහා වන අධ්‍යාපනික තොරතුරු.",
    resource_type: "Educational",
    file_url: "https://climate.nasa.gov/system/downloadable_items/194_Climate_Change_Resource_Guide.pdf"
  },
  {
    id: "4",
    title: "Plastic-Free Action Pack",
    title_si: "ප්ලාස්ටික් අවම කිරීමේ ක්‍රියාකාරී පත්‍රිකාව",
    description: "Practical steps to reduce plastic usage in schools and local communities.",
    description_si: "පාසල සහ ප්‍රජාව තුළ ප්ලාස්ටික් භාවිතය අවම කිරීමට ගත හැකි ප්‍රායෝගික පියවර.",
    resource_type: "Action Plan",
    file_url: "https://www.plasticfreejuly.org/wp-content/uploads/2019/06/Plastic-Free-July-Action-Pack-Community.pdf"
  }
];

export default function ResourcesSection() {
  const ref = useRef(null);
  const [lang, setLang] = useState<"en" | "si">("en");

  useEffect(() => {
    const handleLangChange = (e: any) => setLang(e.detail);
    window.addEventListener("langChange", handleLangChange);
    return () => window.removeEventListener("langChange", handleLangChange);
  }, []);

  const t = {
    title: lang === "en" ? "Educational Resources" : "අධ්‍යාපනමය සම්පත්",
    subtitle: lang === "en" 
      ? "Download professional guides and tools to support your environmental journey." 
      : "ඔබගේ පාරිසරික ගමන ශක්තිමත් කිරීමට අවශ්‍ය මාර්ගෝපදේශ සහ මෙවලම් බාගත කරගන්න.",
    download: lang === "en" ? "Download PDF" : "බාගත කරන්න"
  };

  return (
    <section id="resources" className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-background/50" ref={ref}>
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

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.1}>
          {resources.map((resource) => (
            <motion.div
              key={resource.id}
              variants={staggerItemVariants}
              className="glass-card p-6 group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border border-primary/10 hover:border-primary/40 rounded-2xl flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                    {lang === "en" ? resource.title : resource.title_si || resource.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-2 font-light leading-relaxed">
                    {lang === "en" ? resource.description : resource.description_si || resource.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-primary/5 pt-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
                  {resource.resource_type}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-2 hover:bg-primary hover:text-primary-foreground rounded-xl transition-all"
                  onClick={() => window.open(resource.file_url, "_blank")}
                >
                  <Download className="w-4 h-4" />
                  {t.download}
                </Button>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
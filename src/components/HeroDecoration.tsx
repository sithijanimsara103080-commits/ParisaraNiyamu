import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function HeroDecoration() {
    return (
        <div className="relative w-full aspect-square group [perspective:1200px] flex items-center justify-center p-4 z-[1]">
            {/* Main Container with 3D Transform - Responsive Max Width */}
            <div className="relative w-full max-w-[260px] xs:max-w-[300px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[420px] aspect-[4/5] transition-all duration-700 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateX(8deg)_rotateY(-12deg)]">

                {/* Glow / Shadow behind the card */}
                <div className="absolute inset-0 bg-emerald-600/10 blur-2xl md:blur-3xl rounded-[2rem] md:rounded-[2.5rem] [transform:translateZ(-80px)] transition-all duration-700 group-hover:bg-emerald-600/20 group-hover:[transform:translateZ(-100px)]"></div>

                {/* The Card with the Image */}
                <div className="absolute inset-0 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-zinc-200/50 shadow-2xl shadow-zinc-900/5 overflow-hidden [transform:translateZ(0px)]">
                    <img
                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop"
                        alt="Students planting trees"
                        className="w-full h-full object-cover scale-105 transition-transform duration-1000 group-hover:scale-100"
                        style={{ filter: "saturate(0.9) contrast(1.05)" }}
                    />
                    {/* Bottom Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-900/90"></div>
                </div>

                {/* Floating Badge (Top-Right) - Tightening up for mobile */}
                <div className="absolute right-0 xs:-right-2 md:-right-6 top-8 md:top-12 bg-white/95 backdrop-blur-md border border-white/40 p-2 md:p-4 rounded-xl md:rounded-2xl shadow-xl shadow-black/5 [transform:translateZ(40px) md:translateZ(60px)] transition-all duration-700 group-hover:[transform:translateZ(70px) md:translateZ(90px)_translateY(-10px)] flex items-center gap-2 md:gap-3">
                    <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Leaf className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="text-left pr-1">
                        <p className="text-[9px] md:text-xs text-zinc-500 font-medium">Saplings</p>
                        <p className="text-[11px] md:text-sm text-zinc-900 font-bold tracking-tight whitespace-nowrap">+200 This Month</p>
                    </div>
                </div>

                {/* Text Content (Bottom Overlay) - Scaling font down on mobile */}
                <div className="absolute bottom-6 md:bottom-10 left-6 md:left-8 right-6 md:right-8 [transform:translateZ(30px)] text-left">
                    <p className="text-white/80 text-[8px] md:text-[10px] font-medium tracking-[0.2em] uppercase mb-1">Impact Spotlight</p>
                    <p className="text-lg md:text-2xl font-semibold text-white tracking-tight leading-tight">Hands-on conservation.</p>
                </div>
            </div>
        </div>
    );
}

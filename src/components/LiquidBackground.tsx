import { motion } from "framer-motion";

export default function LiquidBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden bg-background">
            {/* Liquid Blobs */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -100, 50, 0],
                    scale: [1, 1.2, 0.8, 1],
                    rotate: [0, 90, -90, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full"
            />
            <motion.div
                animate={{
                    x: [0, -120, 80, 0],
                    y: [0, 100, -100, 0],
                    scale: [1, 0.9, 1.3, 1],
                    rotate: [0, -45, 45, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[100px] rounded-full"
            />
            <motion.div
                animate={{
                    x: [0, 80, -100, 0],
                    y: [0, -80, 80, 0],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"
            />

            {/* Surface Texture (Subtle Noise or Grain if wanted, but clean is better for liquid) */}
        </div>
    );
}

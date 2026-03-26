import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

const LeafParticles = () => {
    const leafCount = 15;
    const leaves = Array.from({ length: leafCount });

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            {leaves.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 0,
                        y: "110%",
                        x: `${Math.random() * 100}%`,
                        rotate: 0,
                        scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{
                        opacity: [0, 0.4, 0.4, 0],
                        y: "-10%",
                        x: `${(Math.random() * 100) + (Math.random() * 10 - 5)}%`,
                        rotate: 360 * Math.random(),
                        transition: {
                            duration: Math.random() * 15 + 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 20
                        }
                    }}
                    className="absolute"
                >
                    <Leaf className="text-primary/20 w-4 h-4" />
                </motion.div>
            ))}
        </div>
    );
};

export default LeafParticles;

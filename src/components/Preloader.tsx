import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

export default function Preloader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Nature Background Elements */}
                    <div className="absolute inset-0 z-0">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.2, 0.1]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.1, 0.15, 0.1]
                            }}
                            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                            className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/10 blur-[100px] rounded-full"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotate: -20 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 relative border border-primary/20"
                        >
                            <Leaf className="w-12 h-12 text-primary" />
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 rounded-3xl border-2 border-primary/30"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-center"
                        >
                            <h2 className="text-2xl font-display font-bold text-foreground tracking-widest uppercase mb-2">
                                Radapasa <span className="text-primary">Environmental Pioneers</span>
                            </h2>
                            <div className="flex items-center justify-center gap-1.5">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.3, 1, 0.3]
                                        }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            delay: i * 0.2
                                        }}
                                        className="w-1.5 h-1.5 rounded-full bg-primary"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Progress bar */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.2, ease: "easeInOut" }}
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

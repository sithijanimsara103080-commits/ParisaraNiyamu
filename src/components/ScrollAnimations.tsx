import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, ReactNode } from "react";

type AnimationType = "fadeUp" | "fadeLeft" | "fadeRight" | "scale" | "blur" | "rotate3D" | "slideUp";

interface ScrollRevealProps {
    children: ReactNode;
    animation?: AnimationType;
    delay?: number;
    className?: string;
    once?: boolean;
}

const variants = {
    fadeUp: {
        hidden: { opacity: 0, y: 60, filter: "blur(8px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
    },
    fadeLeft: {
        hidden: { opacity: 0, x: -60, filter: "blur(4px)" },
        visible: { opacity: 1, x: 0, filter: "blur(0px)" },
    },
    fadeRight: {
        hidden: { opacity: 0, x: 60, filter: "blur(4px)" },
        visible: { opacity: 1, x: 0, filter: "blur(0px)" },
    },
    scale: {
        hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
        visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
    },
    blur: {
        hidden: { opacity: 0, filter: "blur(20px)" },
        visible: { opacity: 1, filter: "blur(0px)" },
    },
    rotate3D: {
        hidden: { opacity: 0, rotateX: 15, y: 40 },
        visible: { opacity: 1, rotateX: 0, y: 0 },
    },
    slideUp: {
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
    },
};

export function ScrollReveal({
    children,
    animation = "fadeUp",
    delay = 0,
    className = "",
    once = true,
}: ScrollRevealProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: "-80px" }}
            variants={variants[animation]}
            transition={{
                duration: 0.8,
                delay,
                ease: [0.19, 1, 0.22, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* Parallax Scroll Effect */
export function ParallaxSection({
    children,
    className = "",
    speed = 0.3,
}: {
    children: ReactNode;
    className?: string;
    speed?: number;
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.div style={{ y: smoothY }}>{children}</motion.div>
        </div>
    );
}

/* Stagger Container for grid items */
export function StaggerContainer({
    children,
    className = "",
    staggerDelay = 0.1,
}: {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export const staggerItemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] },
    },
};

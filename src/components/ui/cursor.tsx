"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Smoother, floatier spring for a premium feel
    const springConfig = { damping: 20, stiffness: 150 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable =
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.getAttribute("role") === "button" ||
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.classList.contains("cursor-pointer");

            setIsHovering(!!isClickable);
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [cursorX, cursorY]);

    return (
        <>
            {/* Precision Dot - Pure White with subtle shadow for visibility */}
            <motion.div
                className="fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-full pointer-events-none z-[2147483647] shadow-[0_1px_3px_rgba(0,0,0,0.2)] border border-gray-900/20"
                style={{
                    translateX: cursorX,
                    translateY: cursorY,
                    x: -5,
                    y: -5,
                }}
            />

            {/* Interaction Ring - Light Glassy Theme */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[2147483646]"
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                    x: -16,
                    y: -16,
                }}
                animate={{
                    scale: isHovering ? 2 : 1,
                    backgroundColor: isHovering ? "rgba(255, 82, 0, 0.08)" : "rgba(255, 255, 255, 0.1)", // Light Orange tint on hover, faint white otherwise
                    borderColor: isHovering ? "rgba(255, 82, 0, 0.2)" : "rgba(50, 50, 50, 0.15)", // darker default border for visibility on white
                    borderWidth: "1.5px",
                    backdropFilter: "blur(0px)",
                }}
                transition={{
                    scale: { type: "spring", stiffness: 300, damping: 25 },
                    backgroundColor: { duration: 0.2 },
                    borderColor: { duration: 0.2 },
                }}
            />
        </>
    );
};

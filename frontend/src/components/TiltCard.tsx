import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from "framer-motion";

interface TiltCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

const TiltCard = ({ children, className = "", ...props }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Optimized for 144Hz + Ultra-low Latency
  const springConfig = { damping: 40, stiffness: 450, mass: 0.5 };

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable on touch devices for UX stability (avoid jitter on scroll)
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
        willChange: "transform", // Hardware acceleration hint
      }}
      className={`relative ${className}`}
      {...props}
    >
      <div 
        style={{ 
          transform: "translateZ(60px)", 
          transformStyle: "preserve-3d",
          willChange: "transform"
        }} 
        className="w-full h-full"
      >
        {children}
      </div>
    </motion.div>
  );
};

export default TiltCard;

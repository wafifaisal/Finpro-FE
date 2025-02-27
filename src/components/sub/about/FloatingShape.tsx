"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

interface FloatingShapeProps {
  delay: number;
  children: ReactNode;
  initialX: number;
}

const FloatingShape: React.FC<FloatingShapeProps> = ({
  delay,
  children,
  initialX,
}) => {
  const [isFloating, setIsFloating] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsFloating(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      initial={{ x: initialX, y: 0, opacity: 0 }}
      animate={
        isFloating
          ? {
              x: [initialX, initialX + 20, initialX],
              y: [0, -20, 0],
              opacity: 1,
            }
          : {}
      }
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute"
    >
      {children}
    </motion.div>
  );
};

export default FloatingShape;

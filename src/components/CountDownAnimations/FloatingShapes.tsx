import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Stars, Sparkles } from 'lucide-react';

const FloatingShapes: React.FC = () => {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ y: "100vh" }}
          animate={{
            y: "-100vh",
            x: [0, 50, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            delay: i * 5,
            ease: "linear",
          }}
          style={{
            left: `${30 + i * 20}%`,
          }}
        >
          {i === 0 && <Rocket className="w-12 h-12 text-white/30" />}
          {i === 1 && <Stars className="w-16 h-16 text-white/20" />}
          {i === 2 && <Sparkles className="w-10 h-10 text-white/25" />}
        </motion.div>
      ))}
    </>
  );
};

export default FloatingShapes;
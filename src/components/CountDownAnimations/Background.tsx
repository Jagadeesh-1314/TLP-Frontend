import React from 'react';
import { motion } from 'framer-motion';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600"
        animate={{
          background: [
            "linear-gradient(to bottom right, rgb(147, 51, 234), rgb(59, 130, 246), rgb(45, 212, 191))",
            "linear-gradient(to bottom right, rgb(236, 72, 153), rgb(34, 211, 238), rgb(168, 85, 247))",
            "linear-gradient(to bottom right, rgb(147, 51, 234), rgb(59, 130, 246), rgb(45, 212, 191))",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] opacity-10 mix-blend-overlay" />
    </div>
  );
};

export default Background;
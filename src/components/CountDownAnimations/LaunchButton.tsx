import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

interface LaunchButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const LaunchButton: React.FC<LaunchButtonProps> = ({ onClick, disabled }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative group px-8 py-4 rounded-full
        bg-gradient-to-r from-purple-600 to-blue-500
        hover:from-purple-500 hover:to-blue-400
        disabled:from-gray-500 disabled:to-gray-400
        disabled:cursor-not-allowed
        transition-all duration-300
        transform hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors" />
      <div className="relative flex items-center space-x-2">
        <Rocket className="w-6 h-6" />
        <span className="text-xl font-bold text-white">Launch</span>
      </div>
    </motion.button>
  );
};

export default LaunchButton;
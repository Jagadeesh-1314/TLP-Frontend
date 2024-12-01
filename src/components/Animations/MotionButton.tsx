import { motion } from "framer-motion";
import { buttonHover } from "./variants";
import { springTransition } from "./transitions";

interface MotionButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;  // Specific type for onClick event
  className?: string;
  children: React.ReactNode;
}

export const MotionButton = ({ onClick, className, children }: MotionButtonProps) => (
  <motion.button
    onClick={onClick}
    className={className}
    variants={buttonHover}
    initial="rest"
    whileHover="hover"
    whileTap="tap"
    transition={springTransition}
  >
    {children}
  </motion.button>
);

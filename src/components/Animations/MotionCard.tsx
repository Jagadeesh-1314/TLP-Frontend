import { motion } from "framer-motion";
import { cardHover } from "./variants";
import { springTransition } from "./transitions";

interface MotionCardProps {
  className?: string;
  children: React.ReactNode;
}

export const MotionCard = ({ className, children }: MotionCardProps) => (
  <motion.div
    className={className}
    variants={cardHover}
    initial="rest"
    whileHover="hover"
    whileTap="tap"
    transition={springTransition}
  >
    {children}
  </motion.div>
);
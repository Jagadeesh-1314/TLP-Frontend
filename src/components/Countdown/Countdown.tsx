import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import Background from '../CountDownAnimations/Background';
import CountdownTimer from '../CountDownAnimations/CountdownTimer';
import FloatingShapes from '../CountDownAnimations/FloatingShapes';

function Countdown() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background />
      <FloatingShapes />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <Rocket className="w-20 h-20 text-white mb-4 mx-auto" />
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Launching Soon
          </h1>
          <p className="text-xl text-white/80">
            Get ready for something amazing
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-full bg-white/10 blur-xl" />
          <div className="relative bg-white/5 backdrop-blur-sm rounded-full p-8 border border-white/10">
            <CountdownTimer />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12"
        >
          <p className="text-white/60 text-lg">
            Stay tuned for the big reveal
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Countdown;
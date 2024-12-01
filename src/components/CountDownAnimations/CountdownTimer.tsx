import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LaunchButton from './LaunchButton';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft === null || timeLeft < 0) return;

    if (timeLeft === 0) {
      navigate('/login'); // Immediately navigate to login when timeLeft is 0
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const handleLaunch = () => {
    setTimeLeft(10); 
  };

  if (timeLeft === 0) {
    return null; 
  }

  return (
    <div className="flex flex-col items-center gap-8">
      

      {timeLeft === null ? (
        <LaunchButton onClick={handleLaunch} disabled={false} />
      ) : (
        <motion.div
          className="text-8xl font-bold text-white"
          key={timeLeft}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {timeLeft}
        </motion.div>
      )}
    </div>
  );
};

export default CountdownTimer;

import React, { useEffect, useState, useCallback } from 'react';
import ReactConfetti from 'react-confetti';
import ConfettiExplosion from 'react-confetti-explosion';
import confetti from 'canvas-confetti';

interface ConfettiConfig {
  numberOfPieces: number;
  recycle: boolean;
  gravity: number;
  wind: number;
  colors?: string[];
}

interface Props {
  timeLeft: number;
  isLaunched: boolean;
}

const ConfettiManager: React.FC<Props> = ({ timeLeft, isLaunched }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fireCanvasConfetti = useCallback(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && isLaunched) {
      setShowConfetti(true);
      fireCanvasConfetti();
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [timeLeft, isLaunched, fireCanvasConfetti]);

  const confettiConfigs: ConfettiConfig[] = [
    {
      numberOfPieces: 200,
      recycle: false,
      gravity: 0.5,
      wind: 0,
      colors: ['#FFD700', '#FF69B4', '#00FF00', '#FF4500', '#8A2BE2'],
    },
    {
      numberOfPieces: 100,
      recycle: false,
      gravity: 0.3,
      wind: 2,
      colors: ['#FF69B4', '#4169E1', '#32CD32', '#FFD700'],
    },
    {
      numberOfPieces: 150,
      recycle: false,
      gravity: 0.7,
      wind: -1,
      colors: ['#FF1493', '#00BFFF', '#7CFC00', '#DDA0DD'],
    },
  ];

  if (!showConfetti) return null;

  return (
    <>
      {confettiConfigs.map((config, index) => (
        <ReactConfetti
          key={index}
          width={windowSize.width}
          height={windowSize.height}
          {...config}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 + index }}
        />
      ))}
      
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <ConfettiExplosion
          force={0.8}
          duration={3000}
          particleCount={250}
          width={1600}
        />
      </div>
    </>
  );
};

export default ConfettiManager;
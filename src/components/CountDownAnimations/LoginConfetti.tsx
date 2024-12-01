import React, { useEffect, useState, useCallback } from 'react';
import ReactConfetti from 'react-confetti';
import ConfettiExplosion from 'react-confetti-explosion';
import confetti from 'canvas-confetti';

const LoginConfetti: React.FC = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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
    // Fire golden shower
    const end = Date.now() + 1000;
    const colors = ['#FFD700', '#FFA500'];
    
    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
    
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // Fire star explosion
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF69B4', '#00FF00', '#FF4500', '#8A2BE2']
      });
    }, 500);

    // Fire side cannons
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.8 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.8 }
      });
    }, 1000);
  }, []);

  useEffect(() => {
    fireCanvasConfetti();
  }, [fireCanvasConfetti]);

  return (
    <>
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={100}
        recycle={false}
        gravity={0.2}
        wind={0.05}
        colors={['#FFD700', '#FF69B4', '#00FF00', '#FF4500', '#8A2BE2']}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}
      />
      
      <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1001]">
        <ConfettiExplosion
          force={0.8}
          duration={2500}
          particleCount={100}
          width={1600}
        />
      </div>
      
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={50}
        recycle={false}
        gravity={0.5}
        wind={-0.5}
        colors={['#FF1493', '#00BFFF', '#7CFC00', '#DDA0DD']}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 999 }}
      />
    </>
  );
};

export default LoginConfetti;
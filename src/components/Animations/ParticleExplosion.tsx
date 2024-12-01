import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: { x: number; y: number };
  angle: number;
  rotation: number;
}

export default function ParticleExplosion() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
    const particleCount = 150;
    const initialParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 8 + Math.random() * 8;
      initialParticles.push({
        id: i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        size: 5 + Math.random() * 15,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: Math.cos(angle) * velocity,
          y: Math.sin(angle) * velocity,
        },
        angle: Math.random() * 360,
        rotation: (Math.random() - 0.5) * 10,
      });
    }

    setParticles(initialParticles);

    const gravity = 0.2;
    const drag = 0.99;

    const animate = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => ({
          ...particle,
          x: particle.x + particle.velocity.x,
          y: particle.y + particle.velocity.y,
          velocity: {
            x: particle.velocity.x * drag,
            y: particle.velocity.y * drag + gravity,
          },
          angle: particle.angle + particle.rotation,
        }))
      );
    };

    const animationInterval = setInterval(animate, 1000 / 60);
    const cleanupTimeout = setTimeout(() => {
      clearInterval(animationInterval);
      setParticles([]);
    }, 3000);

    return () => {
      clearInterval(animationInterval);
      clearTimeout(cleanupTimeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%',
            transform: `rotate(${particle.angle}deg)`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
}
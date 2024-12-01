import { useCallback } from "react";
import type { Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

interface PartyBackgroundProps {
  numberOfParticles?: number;
  particleColors?: string[];
  particleSize?: number;
}

export default function PartyBackground({
  numberOfParticles = 100,
  particleColors = ["#FF69B4", "#4B0082", "#9370DB", "#FFD700", "#FF6347"],
  particleSize = 4,
}: PartyBackgroundProps) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        particles: {
          number: {
            value: numberOfParticles,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: particleColors
          },
          shape: {
            type: "circle"
          },
          opacity: {
            value: 0.6,
            random: true
          },
          size: {
            value: particleSize,
            random: true
          },
          move: {
            enable: true,
            speed: 3,
            direction: "none",
            random: true,
            straight: false,
            outModes: {
              default: "bounce"
            }
          }
        },
        interactivity: {
          detectsOn: "canvas",
          events: {
            onHover: {
              enable: true,
              mode: "repulse"
            },
            resize: true
          }
        },
        background: {
          opacity: 0
        }
      }}
      className="absolute inset-0 pointer-events-none"
    />
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import ParticleExplosion from './ParticleExplosion';
import AnimatedCheckmark from './AnimatedCheckmark';

interface ThankYouPageProps {
    title: string;
    message: string;
    redirectPath?: string;
}

export default function DonePage({ title, message, redirectPath = "/" }: ThankYouPageProps) {
    const navigate = useNavigate();
    const [showParticles, setShowParticles] = useState(false);

    useEffect(() => {
        setShowParticles(true);
        const timer = setInterval(() => {
            setShowParticles(prev => !prev);
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
            
            {/* Particle explosion effect */}
            {showParticles && <ParticleExplosion />}

            <div className="relative z-10 max-w-md w-full">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:scale-105">
                    <div className="text-center space-y-6">
                        {/* Animated Checkmark */}
                        <div className="my-4">
                            <AnimatedCheckmark />
                        </div>

                        {/* Title with gradient */}
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                            {title}
                        </h1>

                        {/* Message */}
                        <p className="text-gray-600 text-lg">
                            {message}
                        </p>

                        {/* Animated button */}
                        <button
                            onClick={() => navigate(redirectPath)}
                            className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white transition-all duration-300 bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <span className="absolute w-full h-full rounded-full bg-blue-400 opacity-20" />
                            <Home className="w-5 h-5 mr-2 transition-transform group-hover:-translate-y-1" />
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
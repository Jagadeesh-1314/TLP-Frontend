import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';


const AnimatedPercentage: React.FC<{ 
    overallData: { 
        percentile: number; 
        avg_percentile: number; 
    }; 
}> = ({ overallData }) => {
    const [displayNumber, setDisplayNumber] = useState(0);
    const percentage = (overallData.avg_percentile === undefined) ? overallData.percentile : overallData.avg_percentile;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easedProgress = easeOutQuart(progress);
            const currentNumber = easedProgress * percentage;

            if (currentStep >= steps) {
                clearInterval(timer);
                setDisplayNumber(percentage);
            } else {
                setDisplayNumber(currentNumber);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [percentage]);

    // Easing function for smooth animation
    const easeOutQuart = (x: number): number => {
        return 1 - Math.pow(1 - x, 4);
    }

    const circleVariants = {
        hidden: { strokeDashoffset: circumference },
        visible: {
            strokeDashoffset,
            transition: {
                duration: 2,
                ease: "easeOut",
            },
        },
    };

    const numberVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <div className="relative w-48 h-48">
            <svg
                width="192"
                height="192"
                viewBox="0 0 192 192"
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    className="stroke-gray-200"
                    strokeWidth="12"
                    fill="none"
                />
                {/* Animated percentage circle */}
                <motion.circle
                    cx="96"
                    cy="96"
                    r={radius}
                    className={`${percentage >= 70 ? 'stroke-green-500' : 'stroke-red-500'}`}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    variants={circleVariants}
                    initial="hidden"
                    animate="visible"
                    strokeLinecap="round"
                />
            </svg>

            {/* Percentage text with running numbers */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    variants={numberVariants}
                    initial="hidden"
                    animate="visible"
                    className={`text-4xl font-bold ${percentage >= 70 ? 'text-green-500' : 'text-red-500'
                        }`}
                >
                    {displayNumber.toFixed(2)}%
                </motion.div>
            </div>

        </div>
    );
};

export default AnimatedPercentage;
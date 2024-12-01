import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Step {
    title: string;
    icon: LucideIcon;
}

interface ProgressStepsProps {
    steps: Step[];
    currentStep: number;
}

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
    return (
        <div className="flex justify-between items-center w-full">
            {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index + 1 === currentStep;
                const isCompleted = index + 1 < currentStep;

                return (
                    <React.Fragment key={index}>
                        {/* Step Circle */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg scale-110'
                                        : isCompleted
                                        ? 'bg-green-500'
                                        : 'bg-gray-200'
                                }`}
                            >
                                <Icon className={`w-6 h-6 ${isActive || isCompleted ? 'text-white' : 'text-gray-500'}`} />
                            </div>
                            <span
                                className={`mt-2 text-sm font-medium ${
                                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-500' : 'text-gray-500'
                                }`}
                            >
                                {step.title}
                            </span>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div
                                className={`flex-1 h-1 mx-4 rounded transition-all duration-500 ${
                                    index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Computer } from 'lucide-react';
import { StepperComponentProps } from '../../Types/responseTypes';

export default function StepperComponent({ sub, len }: StepperComponentProps) {
  const subjectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (subjectRefs.current[len]) {
      subjectRefs.current[len].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, [len]);

  if (!sub || sub.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto overflow-x-auto">
      <div className="flex items-center min-w-max px-4">
        {sub.map((subject, index) => (
          <React.Fragment key={index}>
            <div
              ref={(el) => (subjectRefs.current[index] = el)}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${index === len ? 'scale-110' : ''}`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index === len
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                      : index < len
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                >
                  {subject.qtype === 'theory' ? (
                    <BookOpen className={`w-6 h-6 ${index <= len ? 'text-white' : 'text-gray-500'}`} />
                  ) : (
                    <Computer className={`w-6 h-6 ${index <= len ? 'text-white' : 'text-gray-500'}`} />
                  )}
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                  {index < len && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                    />
                  )}
                </div>
              </motion.div>
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${
                  index === len ? 'text-blue-600' : index < len ? 'text-green-500' : 'text-gray-500'
                }`}>
                  {subject.subCode}
                </p>
                <p className="text-xs text-gray-500 max-w-[100px] truncate">
                  {subject.subname}
                </p>
              </div>
            </div>
            {index < sub.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 rounded transition-all duration-500 min-w-[2rem] ${
                  index < len ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

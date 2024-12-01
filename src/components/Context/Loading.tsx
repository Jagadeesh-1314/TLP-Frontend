import React, { createContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingContextType {
  showLoading: (show: boolean, message?: string) => void;
}

export const LoadingContext = createContext<LoadingContextType | null>(null);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<{ show: boolean; message?: string }>({
    show: false,
    message: ''
  });

  const showLoading = (show: boolean, message?: string) => {
    setLoading({ show, message });
  };

  return (
    <LoadingContext.Provider value={{ showLoading }}>
      {children}
      <AnimatePresence>
        {loading.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-8 h-8 text-blue-600" />
              </motion.div>
              <p className="text-gray-700 font-medium text-lg">
                {loading.message || 'Loading...'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
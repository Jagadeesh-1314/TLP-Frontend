import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface RadiobuttonsProps {
  id: string;
  itemKey: number;
  score: any;
  len: number;
  setScore: React.Dispatch<React.SetStateAction<any>>;
  onClick: () => void;
  question: string;
  isUnfilled: boolean;
  setIsUnfilled: (id: string, isUnfilled: boolean) => void; // New prop
}

const Radiobuttons = forwardRef<HTMLDivElement, RadiobuttonsProps>(
  ({ id, itemKey, score, len, setScore, question, isUnfilled, setIsUnfilled, onClick }, ref) => {
    const ratings = [1, 2, 3, 4, 5];
    const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

    const handleChange = (value: number) => {
      if (score[len]?.[id] === value) {
        const currentQuestion = document.getElementById(`question-${id}`);
        if (currentQuestion) {
          setTimeout(() => {
            currentQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
        return; 
      }

      setScore((prevScore: any) => ({
        ...prevScore,
        [len]: {
          ...(prevScore[len] || {}),
          [id]: value,
        },
      }));

      // Update the `isUnfilled` state
      setIsUnfilled(id, false);

      onClick();

      // Auto-scroll to next question
      const nextQuestion = document.getElementById(`question-${parseInt(id) + 1}`);
      if (nextQuestion) {
        setTimeout(() => {
          nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    };
    // console.log(score);

    return (
      <motion.div
        id={`question-${id}`}
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: itemKey * 0.1 }}
        className={`w-full max-w-2xl mx-auto mb-6 ${isUnfilled ? 'animate-shake' : ''}`}
      >
        <div className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-md transition-all duration-300 p-6 ${isUnfilled ? 'ring-2 ring-red-500 ring-opacity-50' : 'hover:shadow-xl'
          }`}>
          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-md sm:text-sm md:text-md lg:text-lg font-medium text-gray-800 flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                {parseInt(id) + 1}
              </span>
              {question}
            </h3>
            {isUnfilled && (
              <AlertCircle className="w-5 h-5 text-red-500 animate-pulse flex-shrink-0 ml-2" />
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {ratings.map((rating, index) => (
              <label
                key={rating}
                className={`relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 ${score[len]?.[id] === rating
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name={`rating-${len}-${id}`}
                  value={rating}
                  checked={score[len]?.[id] === rating}
                  onChange={() => handleChange(rating)}
                />
                <span className="flex flex-col">
                  <span className={`text-sm font-medium ${score[len]?.[id] === rating ? 'text-white' : 'text-gray-900'
                    }`}>
                    {labels[index]}
                  </span>
                  <span className={`text-xs ${score[len]?.[id] === rating ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                    Rating: {rating}
                  </span>
                </span>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${score[len]?.[id] === rating
                  ? 'border-white bg-white'
                  : 'border-gray-300'
                  }`}>
                  {score[len]?.[id] === rating && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }
);

export default Radiobuttons;

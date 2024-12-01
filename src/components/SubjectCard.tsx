import { motion } from 'framer-motion';
import { User, Code, Book, GraduationCap, Clock } from 'lucide-react';

interface SubjectCardProps {
  facName: string;
  subCode: string;
  subname: string;
  qtype: string;
}

export default function SubjectCard({ facName, subCode, subname, qtype }: SubjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90" />
        <div className="relative p-6 text-white">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-6 h-6" />
            <h2 className="text-xl font-bold">Subject Details</h2>
          </div>
          <div className="mt-2 flex items-center space-x-2 text-blue-100">
            <Clock className="w-4 h-4" />
            <span className="text-sm capitalize">{qtype} Course</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-start space-x-4"
          >
            <div className="p-3 bg-blue-50 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Faculty Name</p>
              <p className="mt-1 font-semibold text-gray-900">{facName}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-start space-x-4"
          >
            <div className="p-3 bg-purple-50 rounded-lg">
              <Code className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Subject Code</p>
              <p className="mt-1 font-semibold text-gray-900">{subCode}</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-start space-x-4"
        >
          <div className="p-3 bg-indigo-50 rounded-lg">
            <Book className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Subject Name</p>
            <p className="mt-1 font-semibold text-gray-900">{subname}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
import { Users } from 'lucide-react';
import { EmptyFeedbackProps } from '../../Types/responseTypes';

export default function EmptyFeedback({ title, subtitle }: EmptyFeedbackProps) {
  return (
    <div className="p-12 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg">{title}</p>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}
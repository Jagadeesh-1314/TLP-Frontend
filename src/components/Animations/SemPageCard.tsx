import { FeedbackCardProps } from '../../Types/responseTypes';

export default function FeedbackCard({ title, icon: Icon, gradientFrom, gradientTo, children }: FeedbackCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
      <div className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} p-6`}>
        <div className="flex items-center space-x-3">
          <Icon className="w-8 h-8 text-white" />
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
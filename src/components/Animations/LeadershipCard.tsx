import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface LeadershipCardProps {
    name: string;
    role: string;
    image: string;
    icon: LucideIcon;
    description: string;
}


export default function LeadershipCard({ name, role, image, icon: Icon, description }: LeadershipCardProps) {

    return (
        <motion.div
            initial={{ height: 'auto' }}
            whileHover={{
                scale: 1.03,
                transition: { duration: 0.3 }
            }}
            className="relative bg-white rounded-2xl shadow-2xl overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />
            <div className="relative p-8">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-8 group-hover:mb-4 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity animate-pulse" />
                    <motion.div
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <img
                            src={image}
                            alt={role}
                            className="w-56 h-56 mx-auto rounded-full object-cover border-8 border-white shadow-2xl transform group-hover:scale-95 transition-all duration-300"
                        />
                    </motion.div>
                </motion.div>

                <div className="text-center">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-3xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">{name}-({role})</h3>
                        <div className="flex justify-center mb-4">
                            <Icon className="w-10 h-10 text-purple-600" />
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg mb-4">{description}</p>


                        
                    </motion.div>
                </div>
            </div>

            {/* Gradient border at bottom */}
            <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-600" />
        </motion.div>
    );
}

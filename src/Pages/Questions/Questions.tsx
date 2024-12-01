import { useLayoutEffect, useState } from "react";
import Axios from "axios";
import { Question } from "../../Types/responseTypes";
import Title from "../../components/Title";
import { Beaker, BookOpen, ClipboardList } from "lucide-react"; 
import { motion } from "framer-motion"; 

export default function Questions() {
    const [theory, setTheory] = useState<Question[]>([]);
    const [lab, setLab] = useState<Question[]>([]);
    const [centralFacilities, setCentralFacilities] = useState<Question[]>([]);

    useLayoutEffect(() => {
        Axios.get<{ questions: Question[] }>("api/questions")
            .then(({ data }) => {
                setTheory(data.questions.filter((obj) => obj.qtype === "theory"));
                setLab(data.questions.filter((obj) => obj.qtype === "lab"));
                setCentralFacilities(data.questions.filter((obj) => obj.qtype === "ctype"));
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
            });
    }, []);

    const tableAnimation = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <>
            <Title title={"Questions"} />
            <div className="container mx-auto p-5 space-y-8">

                {/* Theory Questions Table */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={tableAnimation}
                    className="w-full bg-white border border-pink-500 rounded-xl shadow-md overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <div className="flex items-center justify-center gap-2 p-2">
                            <BookOpen className="w-6 h-6 text-green-600" />
                            <h3 className="text-xl font-semibold text-green-600">Theory Questions</h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="p-2 border border-gray-300">S.No</th>
                                    <th className="p-2 border border-gray-300">Question</th>
                                </tr>
                            </thead>
                            <tbody>
                                {theory.map((question, index) => (
                                    <tr key={question.seq} className="hover:bg-gray-100 transition">
                                        <td className="p-2 border border-gray-300 text-center">{index + 1}</td>
                                        <td className="p-2 border border-gray-300">{question.question}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Lab Questions Table */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={tableAnimation}
                    className="w-full bg-white border border-pink-500 rounded-xl shadow-md overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <div className="flex items-center justify-center gap-2 p-2">
                            <Beaker className="w-6 h-6 text-violet-600" />
                            <h3 className="text-xl font-semibold text-violet-600">Lab Questions</h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="p-2 border border-gray-300">S.No</th>
                                    <th className="p-2 border border-gray-300">Question</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lab.map((question, index) => (
                                    <tr key={question.seq} className="hover:bg-gray-100 transition">
                                        <td className="p-2 border border-gray-300 text-center">{index + 1}</td>
                                        <td className="p-2 border border-gray-300">{question.question}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Central Facilities Questions Table */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={tableAnimation}
                    className="w-full bg-white border border-pink-500 rounded-xl shadow-md overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <div className="flex items-center justify-center gap-2 p-2">
                            <ClipboardList className="w-6 h-6 text-red-600" />
                            <h3 className="text-xl font-semibold text-red-600">Central Facilities</h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="p-2 border border-gray-300">S.No</th>
                                    <th className="p-2 border border-gray-300">Question</th>
                                </tr>
                            </thead>
                            <tbody>
                                {centralFacilities.map((question, index) => (
                                    <tr key={question.seq} className="hover:bg-gray-100 transition">
                                        <td className="p-2 border border-gray-300 text-center">{index + 1}</td>
                                        <td className="p-2 border border-gray-300">{question.question}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

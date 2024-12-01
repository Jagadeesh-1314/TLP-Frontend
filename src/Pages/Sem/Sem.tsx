import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { useAuth } from '../../components/Auth/AuthProvider';
import { LoadingContext } from '../../components/Context/Loading';
import { AlertContext } from '../../components/Context/AlertDetails';
import { BookOpen, GraduationCap, Users, Sparkles, ChevronRight, ClipboardCheck, CheckCircle2 } from 'lucide-react';
import { Subjects, Token } from '../../Types/responseTypes';
import EmptyFeedback from '../../components/Animations/EmptyFeedback';
import FeedbackCard from '../../components/Animations/SemPageCard';
import Title from '../../components/Title';


export default function Sem() {
    const navigate = useNavigate();
    const [done, setDone] = useState<string>("");
    const [subs, setSubs] = useState<boolean>(false);
    const { user } = useAuth()!;
    const alert = useContext(AlertContext);
    const loading = useContext(LoadingContext);
    const [activeHover, setActiveHover] = useState<number | null>(null);

    const semesters = [];
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 2; j++) {
            semesters.push(`${i}-${j}`);
        }
    }

    useEffect(() => {
        if (user?.username) {
            loading?.showLoading(true, "Loading data...");
            Axios.get<{ sub: Subjects[], token: string }>(`api/subjects`)
                .then(({ data }) => {
                    if (data.sub.length === 0) {
                        setSubs(false);
                        alert?.showAlert("No subjects found", "info");
                    } else {
                        setSubs(true);
                        alert?.showAlert("Subjects loaded", 'success');
                    }
                })
                .catch((error) => {
                    console.error("Error fetching subjects:", error);
                    localStorage.clear();
                    sessionStorage.clear();
                    navigate("/login");
                    alert?.showAlert("Error fetching subjects", "error");
                })
                .finally(() => loading?.showLoading(false));
        }
    }, [user?.username]);

    useEffect(() => {
        if (user?.username) {
            loading?.showLoading(true);
            Axios.post<Token>(`api/token`)
                .then(({ data }) => {
                    setDone(data.token);
                })
                .catch((error) => {
                    console.error("Error fetching token:", error);
                    alert?.showAlert("Error fetching token", "error");
                })
                .finally(() => {
                    loading?.showLoading(false);
                });
        }
    }, []);

    const handleButtonClick = () => {
        loading?.showLoading(true, "Loading data...");
        if (done === 'done') {
            navigate("/completed");
        } else if (done === 'facdone') {
            navigate("/centralfacilities");
        } else if (subs) {
            navigate("/feedback");
        }
        loading?.showLoading(false);
    };

    const getCurrentSemester = () => {
        if (!user?.sem) return null;
        return Math.floor((user.sem + 1) / 2).toString() + '-' + (user.sem % 2 !== 0 ? '1' : '2');
    };

    const isSemesterEnabled = (semesterString: string) => {
        return semesterString === getCurrentSemester();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
            <Title title="Feedback" />
            <div className="max-w-7xl mx-auto space-y-5">
                {/* Academic Feedback Section */}
                <FeedbackCard
                    title="Academic Feedback"
                    icon={GraduationCap}
                    gradientFrom="blue-600"
                    gradientTo="purple-600"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {semesters.map((semesterString, index) => {
                            const isEnabled = isSemesterEnabled(semesterString);
                            const isCompleted = done === 'done' && isEnabled;

                            return (
                                <div
                                    key={index}
                                    className="relative"
                                    onMouseEnter={() => setActiveHover(index)}
                                    onMouseLeave={() => setActiveHover(null)}
                                >
                                    <button
                                        onClick={handleButtonClick}
                                        disabled={!isEnabled}
                                        className={`w-full p-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-between ${isEnabled
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
                                            : 'bg-gray-100 text-gray-400'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <BookOpen className={`w-6 h-6 ${isEnabled ? 'text-white' : 'text-gray-400'}`} />
                                            <div className="text-left">
                                                <span className="block text-lg font-semibold">Semester {semesterString}</span>
                                                <span className="text-sm opacity-80">
                                                    {isCompleted ? 'Feedback completed' : isEnabled ? 'Available for feedback' : 'Locked'}
                                                </span>
                                            </div>
                                        </div>
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-6 h-6 text-green-300" />
                                        ) : (
                                            <ChevronRight className={`w-5 h-5 ${isEnabled ? 'text-white' : 'text-gray-400'}`} />
                                        )}
                                    </button>
                                    {activeHover === index && isEnabled && !isCompleted && (
                                        <div className="absolute -top-2 -right-2">
                                            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </FeedbackCard>

                {/* Course End Survey Section */}
                <FeedbackCard
                    title="Course End Survey"
                    icon={ClipboardCheck}
                    gradientFrom="blue-600"
                    gradientTo="purple-600"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {semesters.map((semesterString, index) => {
                            const isEnabled = isSemesterEnabled(semesterString);
                            const isCompleted = done === 'done' && isEnabled;

                            return (
                                <div
                                    key={index}
                                    className="relative"
                                    onMouseEnter={() => setActiveHover(index + 100)}
                                    onMouseLeave={() => setActiveHover(null)}
                                >
                                    <button
                                        onClick={handleButtonClick}
                                        disabled={!isEnabled}
                                        className={`w-full p-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-between ${isEnabled
                                            ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                                            : 'bg-gray-100 text-gray-400'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <ClipboardCheck className={`w-6 h-6 ${isEnabled ? 'text-white' : 'text-gray-400'}`} />
                                            <div className="text-left">
                                                <span className="block text-lg font-semibold">Semester {semesterString}</span>
                                                <span className="text-sm opacity-80">
                                                    {isCompleted ? 'Survey completed' : isEnabled ? 'Survey available' : 'Locked'}
                                                </span>
                                            </div>
                                        </div>
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-6 h-6 text-green-300" />
                                        ) : (
                                            <ChevronRight className={`w-5 h-5 ${isEnabled ? 'text-white' : 'text-gray-400'}`} />
                                        )}
                                    </button>
                                    {activeHover === index + 100 && isEnabled && !isCompleted && (
                                        <div className="absolute -top-2 -right-2">
                                            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </FeedbackCard>

                {/* Guest Lecture Feedback Section */}
                <FeedbackCard
                    title="Guest Lecture Feedback"
                    icon={Users}
                    gradientFrom="blue-600"
                    gradientTo="purple-600"
                >
                    <EmptyFeedback
                        title="No Feedbacks Available"
                        subtitle="Check back later for guest lecture feedback opportunities"
                    />
                </FeedbackCard>
            </div>
        </div>
    );
}
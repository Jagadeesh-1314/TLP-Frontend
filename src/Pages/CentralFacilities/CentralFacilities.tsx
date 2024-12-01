import Axios from "axios";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import Radiobuttons from "../../components/Custom/Radiobuttons";
import { useAuth } from "../../components/Auth/AuthProvider";
import { AlertContext } from "../../components/Context/AlertDetails";
import { useNavigate } from "react-router-dom";
import { LoadingContext } from "../../components/Context/Loading";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Question, Score, Token } from "../../Types/responseTypes";
import Title from "../../components/Title";


export default function CentralFacilities() {

    const { user } = useAuth()!;
    const navigate = useNavigate();
    const alert = useContext(AlertContext);
    const loading = useContext(LoadingContext);

    const [CentralFacilities, setCentralFacilities] = useState<Question[]>([]);
    const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [score, setScore] = useState<Score>(() => JSON.parse(localStorage.getItem("score") || "{}"));
    const [len] = useState<number>(() => Number(localStorage.getItem("len")) || 0);
    const [unfilledFields, setUnfilledFields] = useState<number[]>([]);
    const [done, setDone] = useState<string>("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useLayoutEffect(() => {
        const storedPage = localStorage.getItem("currentPage");
        if (storedPage === "CentralFacilities") {
            localStorage.removeItem("currentPage");
        }
    }, []);

    useEffect(() => {
        if (user?.username) {
            loading?.showLoading(true);
            Axios.post<Token>(`api/token`)
                .then(({ data }) => {
                    setDone(data.token);
                })
                .catch((error) => {
                    alert?.showAlert("Error fetching token", "error");
                    console.error("Error fetching token:", error);
                })
                .finally(() => {
                    loading?.showLoading(false);
                });
        }
    }, [user?.username]);

    useEffect(() => {
        loading?.showLoading(true, "Loading data...");
        if (done === 'facdone') {
            navigate("/centralfacilities");
        } else if (done === 'undone') {
            navigate("/feedback");
        }
        loading?.showLoading(false);
    }, [done, navigate])

    useLayoutEffect(() => {
        localStorage.setItem("score", JSON.stringify(score));
    }, [score]);

    const handleCardClick = (index: number) => {
        const secondCard = document.querySelector(`#card-${index + 1}`);
        if (secondCard) {
            secondCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };


    useLayoutEffect(() => {
        Axios.get<{ questions: Question[] }>("api/questions")
            .then(({ data }) => {
                setCentralFacilities(data.questions.filter((obj) => obj.qtype === "ctype"));
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
            });
    }, []);


    const setIsUnfilled = (id: string, isUnfilled: boolean) => {
        const fieldIndex = parseInt(id);

        setUnfilledFields((prev) =>
            isUnfilled
                ? [...prev, fieldIndex]
                : prev.filter((unfilled) => unfilled !== fieldIndex)
        );
    };

    const cards = CentralFacilities.map((obj, index) => (
        <Radiobuttons
            id={index.toString()}
            key={index}
            itemKey={index}
            ref={(el) => (questionRefs.current[index] = el)}
            score={score}
            len={len}
            setScore={setScore}
            onClick={() => handleCardClick(index)}
            question={obj.question}
            isUnfilled={unfilledFields.includes(index)}
            setIsUnfilled={setIsUnfilled}
        />
    ));

    async function handleSubmit(): Promise<void> {
        try {

            const requiredKeys = CentralFacilities.map((_, index) => index.toString());
            const currentScore = score[len] || {};
            const allFieldsFilled = requiredKeys.every((key) => currentScore[key] !== undefined && currentScore[key] !== null);
            if (!allFieldsFilled) {
                const newUnfilledFields: number[] = [];
                for (let key of requiredKeys) {
                    if (currentScore[key] === undefined || currentScore[key] === null) {
                        const index = parseInt(key);
                        newUnfilledFields.push(index);
                        const element = questionRefs.current[index];
                        if (element) {
                            element.scrollIntoView({ behavior: "smooth", block: "center" });
                            break;
                        }
                    }
                }
                setUnfilledFields(newUnfilledFields);
                alert?.showAlert("Please fill all the required fields.", "warning");
                return;
            } else {
                setUnfilledFields([]);
            }
            loading?.showLoading(true, "Submitting scores...");
            setIsButtonDisabled(true);
            await Axios.post(`api/cfscore`, { scores: score }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(({ data }) => {
                    if (data.done) {
                        alert?.showAlert("Feedback Submitted Successfully", "success");
                        navigate("/thank-you");
                        localStorage.removeItem("score");
                        localStorage.removeItem("len")
                    }
                })
                .catch(error => {
                    alert?.showAlert(`${error.response.data.error}`, "error");
                    console.error('Error response:', error.response?.data);
                });
        } catch (error) {
            console.error("Error submitting form:", error);
            alert?.showAlert("Error submitting form", "error");
        } finally {
            loading?.showLoading(false);
        }
    }


    return (
        <div className="bg-blue-100 py-7 px-3 md:px-6 rounded-lg">
            <Title title={"Central Facilities Form"} />
            {/* <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Central Facilities Form
                </h1>
            </motion.div> */}
            <div className="flex flex-col items-center">
                {cards}
                <button
                    onClick={handleSubmit}
                    disabled={isButtonDisabled}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${isButtonDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                        }`}
                >
                    <KeyboardDoubleArrowLeftIcon /> {isButtonDisabled ? "Processing..." : `Submit`} <KeyboardDoubleArrowRightIcon />
                </button>
            </div>
        </div>
    );
}

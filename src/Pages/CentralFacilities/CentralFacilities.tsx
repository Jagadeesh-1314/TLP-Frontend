import Axios from "axios";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import Radiobuttons from "../../components/Custom/Radiobuttons";
import { useAuth } from "../../components/Auth/AuthProvider";
import { AlertContext } from "../../components/Context/AlertDetails";
import { useNavigate } from "react-router-dom";
import Title from "../../components/Title";
import { LoadingContext } from "../../components/Context/Loading";

interface Question {
    qtype: string;
    question: string;
}

interface Score {
    [key: string]: { [key: string]: number };
}
interface Token {
    token: string;
}

export default function CentralFacilities() {

    const { user } = useAuth()!;
    const navigate = useNavigate();
    const alert = useContext(AlertContext);
    const [CentralFacilities, setCentralFacilities] = useState<Question[]>([]);
    const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [score, setScore] = useState<Score>(() => JSON.parse(localStorage.getItem("score") || "{}"));
    const [len] = useState<number>(() => Number(localStorage.getItem("len")) || 0);
    const [unfilledFields, setUnfilledFields] = useState<number[]>([]);
    const [done, setDone] = useState<string>("");
    const loading = useContext(LoadingContext);

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
        if (done === 'done') {
            navigate("/completed");
        } else if (done === 'facdone') {
            navigate("/centralfacilities");
        } else {
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

    const handleFieldSelect = (index: number) => {
        setUnfilledFields((prev) => prev.filter((i) => i !== index));
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

    const tmp = len + 1;

    const cards = CentralFacilities.map((obj, index) => (
        <Radiobuttons
            id={index.toString()}
            key={index}
            itemKey={index}
            ref={(el) => (questionRefs.current[index] = el)}
            score={score}
            len={tmp}
            setScore={setScore}
            onClick={() => handleCardClick(index)}
            question={obj.question}
            isUnfilled={unfilledFields.includes(index)}
            onSelect={() => handleFieldSelect(index)}
        />
    ));

    async function handleSubmit(): Promise<void> {
        try {
            loading?.showLoading(true, "Submitting scores...");
            const requiredKeys = CentralFacilities.map((_, index) => index.toString());
            const currentScore = score[tmp] || {};
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
            <Title title="Central Facilities Form" />
            <div className="flex flex-col items-center">
                {cards}
                <button
                    className="blue-button-filled col-span-1 flex items-center gap-2 mt-4"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

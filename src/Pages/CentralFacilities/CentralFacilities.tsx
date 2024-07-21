import Axios from "axios";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import Radiobuttons from "../../components/Custom/Radiobuttons";
import { useAuth } from "../../components/Auth/AuthProvider";
import { AlertContext } from "../../components/Context/AlertDetails";
import { useNavigate } from "react-router-dom";

interface Question {
    qtype: string;
    question: string;
}

interface Score {
    [key: string]: { [key: string]: number };
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
        const totalScore = Object.values(score[tmp]).reduce((a, b) => a + b, 0);
        const length = CentralFacilities.length;
        const avgScore = totalScore / length;
        const dataObject = {
            stuID: user?.username,
            branch: user?.branch,
            batch: user?.batch,
            score: score[tmp],
            totalScore: avgScore,
        };

        try {
            const { data } = await Axios.post(`/api/cfscore`, dataObject, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (data.done) {
                alert?.showAlert("DONE", "success");
                const { data } = await Axios.post(`api/updatetoken?rollno=${user?.username}`);
                if (data.done) {
                    alert?.showAlert("Form Submitted", "success");
                    navigate("/thank-you");
                    sessionStorage.removeItem("currentPage");
                    // localStorage.clear();
                }
            } else {
                alert?.showAlert("NOT DONE", "error");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert?.showAlert("Error submitting form", "error");
        }
    }


    return (
        <div className="bg-blue-100 py-7 px-3 md:px-6 rounded-lg">
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

import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Radiobuttons from "../../components/Custom/Radiobuttons";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { useAuth } from "../../components/Auth/AuthProvider";
import StepperComponent from "../../components/Custom/StepperComponent";
import { LoadingContext } from "../../components/Context/Loading";
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { Question, Score, Subjects, Token } from "../../Types/responseTypes";
import { motion, AnimatePresence } from "framer-motion";
import SubjectCard from "../../components/SubjectCard";
import Title from "../../components/Title";

export default function Feedback() {
  const alert = useContext(AlertContext);
  const navigate = useNavigate();
  const { user } = useAuth()!;
  const [score, setScore] = useState<Score>(() => JSON.parse(localStorage.getItem("score") || "{}"));
  const [len, setLen] = useState<number>(() => Number(localStorage.getItem("len")) || 0);
  const [theory, setTheory] = useState<Question[]>([]);
  const [lab, setLab] = useState<Question[]>([]);
  const [sub, setSub] = useState<Subjects[]>([]);
  const [unfilledFields, setUnfilledFields] = useState<number[]>([]);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [done, setDone] = useState<string>("");
  const loading = useContext(LoadingContext);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
  }, [user?.username]);

  useEffect(() => {
    loading?.showLoading(true, "Loading data...");
    if (done === 'done') {
      navigate("/completed");
    } else if (done === 'facdone') {
      navigate("/centralfacilities");
    } else if (sub) {
      navigate("/feedback");
    }
    loading?.showLoading(false);
  }, [done, navigate])

  useEffect(() => {
    if (user) {
      Axios.get<{ sub: Subjects[], token: string }>(`api/subjects`)
        .then(({ data }) => {
          setSub(data.sub);
          // console.log(data.sub)
        })
        .catch((error) => {
          console.error("Error fetching subjects:", error);
        });
    }
  }, [user]);

  useLayoutEffect(() => {
    Axios.get<{ questions: Question[] }>("api/questions")
      .then(({ data }) => {
        setTheory(data.questions.filter((obj) => obj.qtype === "theory"));
        setLab(data.questions.filter((obj) => obj.qtype === "lab"));
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);

  useLayoutEffect(() => {
    if (len > Object(score).length || Object.keys(score).length === 0) {
      setLen(0);
    }
    localStorage.setItem("score", JSON.stringify(score));
  }, [score]);

  useLayoutEffect(() => {
    localStorage.setItem("len", len.toString());
    // localStorage.setItem("reset", JSON.stringify(reset));
  }, [len/*reset*/]);

  const handleCardClick = (index: number) => {
    const secondCard = document.querySelector(`#card-${index + 1}`);
    if (secondCard) {
      secondCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };


  async function handleNext(): Promise<void> {
    try {
      if (!sub || sub.length === 0) return;
      const currentScore = score[len] || {};
      const requiredKeys = (sub[len].qtype === "theory" ? theory : lab).map((_, index) => index.toString());
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

      if (Object.keys(score).length === sub.length && len === sub.length - 1) {
        setIsButtonDisabled(true);
        loading?.showLoading(true, "Submitting scores...");
        const scoresData = sub.map((subject: any, index: number) => {
          return {
            subCode: subject.subCode,
            score: score[index],
          };
        });
        await Axios.post(`api/score`, { scores: scoresData }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(({ data }) => {
            if (data.done) {
              alert?.showAlert("Feedback Submitted Successfully", "success");
              localStorage.removeItem("score");
              localStorage.removeItem("len");
              navigate("/centralfacilities");
            }
          })
          .catch(error => {
            alert?.showAlert(`${error.response?.data}`, "error");
            console.error('Error response:', error.response?.data);
          });
      } else if (len === sub.length - 1 && Object(score).length !== len) {
        alert?.showAlert("You have Missied some Fields", "error");
      }

      if (len < sub.length - 1) {
        setLen(len + 1);
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error("Error posting score:", err);
    } finally {
      loading?.showLoading(false);
    }
  }

  const handlePrevious = () => {
    if (len > 0) {
      setLen(len - 1);
      window.scrollTo(0, 0);
    }
  };


  const setIsUnfilled = (id: string, isUnfilled: boolean) => {
    const fieldIndex = parseInt(id);

    setUnfilledFields((prev) =>
      isUnfilled
        ? [...prev, fieldIndex]
        : prev.filter((unfilled) => unfilled !== fieldIndex) 
    );
  };

  const cards = sub && (sub[len] && sub[len].qtype === "lab" ? lab : theory).map((obj, index) => (
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <Title title={"Academic Feedback Form"} />
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Academic Feedback Form
          </h1>
          <p className="text-gray-600 mt-2">Help us improve your learning experience</p>
        </motion.div> */}

        {/* Progress Stepper */}
        <div className="mb-8 overflow-x-auto">
          <StepperComponent sub={sub} len={len} />
        </div>

        {/* Subject Info Card */}
        <AnimatePresence mode="wait">
          {sub && sub[len] && (
            <div className="mb-8">
              <SubjectCard
                facName={sub[len].facName}
                subCode={sub[len].subCode}
                subname={sub[len].subname}
                qtype={sub[len].qtype}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Questions Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {cards}
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex justify-between items-center max-w-2xl mx-auto"
        >
          <button
            onClick={handlePrevious}
            disabled={len === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${len === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-md'
              }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={isButtonDisabled}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${isButtonDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
              }`}
          >
            <span>{isButtonDisabled ? "Processing..." : (len === sub?.length - 1 ? "Submit" : "Next")}</span>
            {len === sub?.length - 1 ? <Send className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
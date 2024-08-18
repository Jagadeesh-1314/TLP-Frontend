import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Radiobuttons from "../../components/Custom/Radiobuttons";
import { Box, Card, Step, StepLabel, Stepper } from "@mui/material";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { useAuth } from "../../components/Auth/AuthProvider";

interface Question {
  qtype: string;
  question: string;
}

interface Subjects {
  subCode: string;
  subname: string;
  qtype: string;
  facID: string;
  facName: string;
}

interface Score {
  [key: string]: { [key: string]: number };
}

export default function Feedback() {
  const alert = useContext(AlertContext);
  const navigate = useNavigate();
  const { user } = useAuth()!;

  const [score, setScore] = useState<Score>(() => JSON.parse(localStorage.getItem("score") || "{}"));
  const [len, setLen] = useState<number>(() => Number(localStorage.getItem("len")) || 0);
  // const [reset, setReset] = useState<boolean>(() => JSON.parse(localStorage.getItem("reset") || "false"));
  const [theory, setTheory] = useState<Question[]>([]);
  const [lab, setLab] = useState<Question[]>([]);
  const [sub, setSub] = useState<Subjects[]>([]);
  const [unfilledFields, setUnfilledFields] = useState<number[]>([]);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (user) {
      Axios.get<{ sub: Subjects[], token: string }>(`api/subjects?username=${user.username}`)
        .then(({ data }) => {
          setSub(data.sub);
          console.log(data.sub)
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
    localStorage.setItem("score", JSON.stringify(score));
  }, [score]);

  useLayoutEffect(() => {
    localStorage.setItem("len", len.toString());
    // localStorage.setItem("reset", JSON.stringify(reset));
  }, [len, /*reset*/]);

  const handleCardClick = (index: number) => {
    const secondCard = document.querySelector(`#card-${index + 1}`);
    if (secondCard) {
      secondCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleFieldSelect = (index: number) => {
    setUnfilledFields((prev) => prev.filter((i) => i !== index));
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
    onSelect={() => handleFieldSelect(index)}
    />
  ));
  
  const isLastStep = sub && len === sub.length - 1;
  
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

      if (isLastStep) {
        for (let i in score) {
          const totalScore = Object.values(score[i]).reduce((a, b) => a + b, 0);
          const length = sub[parseInt(i)].qtype === "theory" ? theory.length : lab.length;
          const avgScore = totalScore / length;

          const dataObject = {
            facID: sub[parseInt(i)].facID,
            subCode: sub[parseInt(i)].subCode,
            qtype: sub[parseInt(i)].qtype,
            score: score[i],
            totalScore: avgScore,
            batch: user?.batch
          };
          console.log(dataObject)
          const { data } = await Axios.post(`api/score`, dataObject, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (data.done) {
            alert?.showAlert("DONE", "success");
          } else {
            alert?.showAlert("NOT DONE", "error");
          }
        }
      }

      if (len < sub.length - 1) {
        setLen(len + 1);
        window.scrollTo(0, 0);
      } else {
          alert?.showAlert("Form Submitted", "success");
          localStorage.setItem("currentPage", "CentralFacilities");
          navigate("/centralfacilities");
          sessionStorage.removeItem("currentPage");
      }
    } catch (err) {
      console.error("Error posting score:", err);
    }
  }

  return (
    <div className="bg-blue-100 py-7 px-3 md:px-6 rounded-lg">
      <div className="flex flex-col items-center">
        <div className="flex justify-center" style={{ width: '85vw', overflowY: 'auto' }}>
          <Box sx={{ width: "80%", paddingBlock: 10 }}>
            <Stepper activeStep={len} alternativeLabel>
              {sub && sub.map((subject) => (
                <Step key={subject.subCode}>
                  <StepLabel>{subject.subname}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <form className="flex flex-col items-center w-full">
          {sub && sub[len] && (
            <div style={{ margin: 10, width: '95%' }}>
              <Card
                sx={{
                  width: '100%',
                  '@media (min-width: 600px)': {
                    width: '65%',
                  },
                  margin: 'auto',
                }}
                style={{ padding: 20 }}
                variant="outlined"
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', rowGap: '10px', columnGap: '2px' }}>
                    <div><b>Faculty Name</b></div> <div>{sub[len].facName}</div>
                    <div><b>Subject Code</b></div><div>{sub[len].subCode}</div>
                    <div><b>Subject Name</b></div> <div>{sub[len].subname}</div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          {cards}
        </form>
        <button
          className="blue-button-filled col-span-1 flex items-center gap-2 mt-4"
          onClick={handleNext}
        >
          {/* {isLastStep ? "Submit" : "Next"} */}
          Next
        </button>
      </div>
    </div>
  );
}
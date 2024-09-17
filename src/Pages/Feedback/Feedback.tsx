import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Radiobuttons from "../../components/Custom/Radiobuttons";
import { Box, Card } from "@mui/material";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { useAuth } from "../../components/Auth/AuthProvider";
import StepperComponent from "../../components/Custom/StepperComponent";
import Title from "../../components/Title";
import { LoadingContext } from "../../components/Context/Loading";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

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

interface Token {
  token: string;
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
    if (len > Object(score).length || Object.keys(score).length === 0 ) {
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
              navigate("/centralfacilities");
            }
          })
          .catch(error => {
            alert?.showAlert(`${error.response.data}`, "error");
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


  return (
    <div className="bg-blue-100 py-7 px-3 md:px-6 rounded-lg">
      <Title title="Feedback Form" />
      <div className="flex flex-col items-center">
        <div className="flex justify-center" style={{ width: '85vw', overflowY: 'auto' }}>
          {/* <Box sx={{
            width: '100%',
            maxWidth: { xs: '95vw', sm: '85vw' },
            margin: '0 auto',
            padding: { xs: 1, sm: 3, md: 5 },
            boxSizing: 'border-box'
          }}>
            <Stepper activeStep={len} alternativeLabel sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>
              {sub && sub.map((subject) => (
                <Step key={subject.subCode}>
                  <StepLabel>{subject.subname}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box> */}
          <StepperComponent sub={sub} len={len} />
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '95%',
            margin: '10px',
            '@media (min-width: 600px)': {
              width: '62%',
            },
          }}
        >
          <button
            className="blue-button-filled col-span-1 flex items-center gap-2"
            onClick={handlePrevious}
            disabled={len === 0}
          >
            <KeyboardDoubleArrowLeftIcon /> Previous
          </button>

          <button
            className="blue-button-filled col-span-1 flex items-center gap-2"
            onClick={handleNext}
            disabled={isButtonDisabled}
          >
            {isButtonDisabled ? "Processing..." : (len === sub.length - 1 ? "Submit" : "Next")} <KeyboardDoubleArrowRightIcon />
          </button>
        </Box>

      </div>
    </div>
  );
}
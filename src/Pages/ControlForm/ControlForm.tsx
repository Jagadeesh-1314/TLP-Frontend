import { useContext, useLayoutEffect, useState } from "react";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import "./ControlForm.css";

export default function ControlForm() {
    const alert = useContext(AlertContext);
    const [fTerm, setFTerm] = useState<number | null>(null);
    const [animationClass, setAnimationClass] = useState("");

    const fetchTerm = () => {
        Axios.get<{ done: boolean, term: number }>(`api/fetchterm`)
            .then(({ data }) => {
                if (data.done) {
                    setAnimationClass("fade-out");
                    setFTerm(data.term);
                    setTimeout(() => setAnimationClass("fade-in"), 50);
                }
            });
    };

    useLayoutEffect(() => {
        fetchTerm();
    }, []);

    const incrementcount = () => {
        Axios.post<{ done: boolean, term: number }>(`api/term1`)
            .then(({ data }) => {
                if (data.done) {
                    fetchTerm();
                    alert?.showAlert("Term 2 Activated", "success");
                } else {
                    alert?.showAlert("Error in Activating", "error");
                }
            })
            .catch((error) => {
                console.error("Error Occurred in Activating:", error);
                alert?.showAlert("Error Occurred in Activating", "error");
            });
    };

    const decrementcount = () => {
        Axios.post<{ done: boolean, term: number }>(`api/term2`)
            .then(({ data }) => {
                if (data.done) {
                    alert?.showAlert("Term 1 Activated", "success");
                    fetchTerm();
                } else {
                    alert?.showAlert("Error in Activating", "error");
                }
            })
            .catch((error) => {
                console.error("Error Occurred in Activating:", error);
                alert?.showAlert("Error Occurred in Activating", "error");
            });
    };

    const promote = () => {
        Axios.post<{ done: boolean }>(`api/promote`)
            .then(({ data }) => {
                if (data.done) {
                    alert?.showAlert("Students are Promoted", "success");
                } else {
                    alert?.showAlert("Error in Activating", "error");
                }
            })
            .catch((error) => {
                console.error("Error Occurred in Activating:", error);
                alert?.showAlert("Error Occurred in Activating", "error");
            });
    };

    return (
        <>
            <div className="container">
                <button className="button" onClick={incrementcount}>
                    SET TERM - 2
                </button>
                <button className="button" onClick={decrementcount}>
                    SET TERM - 1
                </button>
                <button className="button" onClick={promote}>
                    Promote Students
                </button>
            </div>
            <div className={`fterm-container ${animationClass}`}>
                {fTerm !== null ? `Current Term: ${fTerm}` : "Loading current term..."}
            </div>
        </>
    );
}

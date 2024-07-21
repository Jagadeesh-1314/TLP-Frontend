import { useContext, useState } from "react";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import "./ControlForm.css";

export default function ControlForm() {
    const alert = useContext(AlertContext);
    const [term, setTerm] = useState<number | null>(null);

    const incrementcount = () => {
        Axios.post<{ done: boolean, term: number }>(`api/incrementcount`)
            .then(({ data }) => {
                if (data.done) {
                    alert?.showAlert("Term 2 Activated", "success");
                    setTerm(data.term);
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
        Axios.post<{ done: boolean, term: number }>(`api/decrementcount`)
            .then(({ data }) => {
                if (data.done) {
                    alert?.showAlert("Term 1 Activated", "success");
                    setTerm(data.term);
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
                <button className="button" onClick={decrementcount}>
                    Promote Students
                </button>
            </div>
            {term !== null && (
                <div className={`term-message term-${term === 2 ? 'activated' : 'deactivated'}`}>
                    {term === 2 && <div>Term 2 Activated</div>}
                    {term === 1 && <div>Term 1 Activated</div>}
                </div>
            )}
        </>
    );
}

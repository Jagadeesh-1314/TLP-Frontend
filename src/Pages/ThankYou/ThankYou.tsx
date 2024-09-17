import { useNavigate } from "react-router-dom";
import "./ThankYou.css";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../../components/Context/Loading";
import { useAuth } from "../../components/Auth/AuthProvider";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";

interface Token {
    token: string;
}


export default function ThankYou() {
    const navigate = useNavigate();
    const loading = useContext(LoadingContext);
    const { user } = useAuth()!;
    const [done, setDone] = useState<string>("");
    const alert = useContext(AlertContext);

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
        } else {
            navigate("/feedback");
        }
        loading?.showLoading(false);
    }, [done, navigate])
    return (
        <div className="content">
            <div className="wrapper-1">
                <div className="wrapper-2">
                    <h1>🎉 Thank you! ✅</h1>
                    <p className="message">Your submission has been recorded successfully.</p>

                    <button className="go-home" onClick={() => navigate("/sem")}>
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}

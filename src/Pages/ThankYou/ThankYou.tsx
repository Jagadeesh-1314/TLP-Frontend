import { useNavigate } from "react-router-dom";
import "./ThankYou.css";

export default function ThankYou() {
    const navigate = useNavigate();
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

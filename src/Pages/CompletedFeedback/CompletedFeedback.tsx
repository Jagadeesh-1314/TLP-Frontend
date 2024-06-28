import { useNavigate } from "react-router-dom";
import "./CompletedFeedback.css";

export default function ThankYou() {
    const navigate = useNavigate();
    
    return (
        <div className="content">
            <div className="wrapper-1">
                <div className="wrapper-2">
                    <h1>🎉 Submitted ✅</h1>
                    <p className="message">You had Completed your Feedback.</p>
                    <button
                        className="go-home"
                        onClick={() => navigate("/sem")}
                    >
                        GO Home
                    </button>
                </div>
            </div>
        </div>
    );
}

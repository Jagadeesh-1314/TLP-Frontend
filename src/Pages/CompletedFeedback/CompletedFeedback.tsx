import { useNavigate } from "react-router-dom";
import "./CompletedFeedback.css";

export default function ThankYou() {
    const navigate = useNavigate();

    return (
        <>
            {/* <div className="bg-blue-200 py-7 px-3 md:px-6 rounded-lg center"> */}
            <div className="content">
                <div className="wrapper-1 mb-20 mt-10">
                    <div className="wrapper-2 ">
                        <h1>🎉 Submitted ✅</h1>
                        <p className="message">You have completed your feedback.</p>
                        <button
                            className="go-home"
                            onClick={() => navigate("/sem")}
                            aria-label="Go to Home Page"
                        >
                            GO Home
                        </button>
                    </div>
                </div>
                {/* </div> */}
                {/* <div className="wrapper-1 mb-10">
                    <p>Co-Developers :</p>
                    <ul className="names-list">
                        <li>B. Vignesh</li>
                        <li>R. Harinath Reddy</li>
                        <li>Y. Rahul</li>
                        <li>P. Sai Shiva Kumar</li>
                        <li>Y. Santhosh Anand</li>
                    </ul>
                </div> */}
            </div>
        </>
    );
}

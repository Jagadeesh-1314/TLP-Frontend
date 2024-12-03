import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputAdornment, IconButton } from "@mui/material";
import { VpnKeyOutlined } from "@mui/icons-material";
import { Mail, Lock, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CustTextField } from "../../components/Custom/CustTextField";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { LoadingContext } from "../../components/Context/Loading";
import ProgressSteps from "../../components/Animations/OTPProgressSteps";
import { useAuth } from "../../components/Auth/AuthProvider";

export default function SetPasswordWithOTP() {
    const navigate = useNavigate();
    const alert = useContext(AlertContext);
    const loading = useContext(LoadingContext);
    const { user } = useAuth()!;

    const [step, setStep] = useState(1);
    const [username, setUsername] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [button, setButton] = useState(false);

    const steps = [
        { title: "Request OTP", icon: Mail },
        { title: "Verify OTP", icon: KeyRound },
        { title: "Set Password", icon: Lock }
    ];

    const handleRequestOTP = async () => {
        if (!username.trim()) {
            setError("Roll number is required.");
            return;
        }

        loading?.showLoading(true);
        setError("");
        setButton(true);
        try {
            const { data } = await Axios.post("/api/request-otp", { username: username.trim() });
            if (data.success) {
                setStep(2);
                alert?.showAlert("OTP sent to your College E-mail", "success");
            } else {
                setError(data.error);
                alert?.showAlert(data.error, "warning")
            }
        } catch (error) {
            setError("Server error. Please try again.");
        } finally {
            loading?.showLoading(false);
            setButton(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp.trim()) {
            setError("OTP is required.");
            return;
        }

        loading?.showLoading(true);
        setButton(true);
        setError("");
        try {
            const { data } = await Axios.post("/api/verify-otp", { username: username.trim(), user_otp: otp });
            if (data.verified) {
                setStep(3);
                alert?.showAlert("OTP Verified, please set your new password", "success");
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError("Server error. Please try again.");
        } finally {
            loading?.showLoading(false);
            setButton(false);
        }
    };

    const handleSetNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 10) {
            setError("Password must be at least 10 characters long.");
            return;
        }        

        if (username === password || user?.username === password){
            setError("Password Should not be same as Username(Rollno).");
            alert?.showAlert("Password Should not be same as Username", "warning");
            return;
        }

        loading?.showLoading(true);
        setButton(true);
        try {
            const { data } = await Axios.post("/api/setpassword", {
                password,
                usernameInToken: username,
            });
            if (data.done) {
                alert?.showAlert("Password updated successfully", "success");
                sessionStorage.clear();
                navigate("/login");
            } else {
                setError("Failed to update password.");
            }
        } catch (error) {
            alert?.showAlert("Server error", "error");
        } finally {
            setButton(false);
            loading?.showLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center py-8 px-4">
            <div className="max-w-md w-full">
                {/* Progress Steps */}
                <ProgressSteps steps={steps} currentStep={step} />

                {/* Main Card */}
                <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
                    <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Reset Password
                    </h2>

                    {step === 1 && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleRequestOTP();
                            }}
                            className="space-y-6"
                        >
                            <div className="relative">
                                <CustTextField
                                    label="Roll No"
                                    value={username}
                                    onChange={({ target: { value } }) => setUsername(value)}
                                    className="w-full"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Mail className="w-5 h-5 text-gray-500" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            {error && (
                                <p className="text-red-500 text-sm text-center animate-shake">{error}</p>
                            )}
                            <button
                                type="submit"
                                disabled={button}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                            >
                                <span>{button ? "Requesting OTP..." : "Request OTP"}</span>
                                {!button && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleVerifyOTP();
                            }}
                            className="space-y-6"
                        >
                            <div className="relative">
                                <CustTextField
                                    label="Enter OTP"
                                    value={otp}
                                    onChange={({ target: { value } }) => setOtp(value)}
                                    className="w-full"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <KeyRound className="w-5 h-5 text-gray-500" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            {error && (
                                <p className="text-red-500 text-sm text-center animate-shake">{error}</p>
                            )}
                            <button
                                type="submit"
                                disabled={button}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                            >
                                <span>{button ? "Verifying OTP..." : "Verify OTP"}</span>
                                {!button && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleSetNewPassword} className="space-y-6">
                            <div className="space-y-4">
                                <CustTextField
                                    label="New Password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={({ target: { value } }) => setPassword(value)}
                                    error={password?.trim()?.length < 10 && password?.trim()?.length > 0}
                                    helperText={
                                        password?.trim()?.length < 10 && password?.trim()?.length > 0
                                            ? "Password must be at least 10 characters"
                                            : ""
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VpnKeyOutlined />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <CheckCircle2 /> : <Lock />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <CustTextField
                                    label="Confirm Password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    error={password !== confirmPassword && confirmPassword?.trim()?.length > 0}
                                    onChange={({ target: { value } }) => setConfirmPassword(value)}
                                    helperText={
                                        password !== confirmPassword && confirmPassword?.trim()?.length > 0
                                            ? "Passwords do not match"
                                            : ""
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VpnKeyOutlined />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <CheckCircle2 /> : <Lock />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            {error && (
                                <p className="text-red-500 text-sm text-center animate-shake">{error}</p>
                            )}
                            <button
                                type="submit"
                                disabled={button}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                            >
                                <span>{button ? "Setting Password..." : "Set Password"}</span>
                                {!button && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
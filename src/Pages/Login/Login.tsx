import { useState, useContext } from "react";
import { motion } from "framer-motion";
import {
  TextField,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { PersonOutlineOutlined, VpnKeyOutlined, InfoOutlined } from "@mui/icons-material";
import { AlertContext } from "../../components/Context/AlertDetails";
import Logo from "/assets/cam2.png";
import Logo1 from "/assets/Logo.png";
import Axios from "axios";
import { LoadingContext } from "../../components/Context/Loading";
import { useAuth } from "../../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
// import LoginConfetti from "../../components/CountDownAnimations/LoginConfetti";
// import React from "react";


export default function LoginForm() {
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);
  const { setUser } = useAuth()!;
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [loginCreds, setLoginCreds] = useState<LoginCredentialsProps>({
    username: "",
    password: "",
    displayName: "",
    branch: "",
    batch: 0,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  // const [showConfetti, setShowConfetti] = useState(true);

  // Hide confetti after animation
  // React.useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowConfetti(false);
  //   }, 4000);
  //   return () => clearTimeout(timer);
  // }, []);


  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-cover relative overflow-hidden"
      style={{ backgroundImage: `url(${Logo})` }}>
      {/* {showConfetti && <LoginConfetti />} */}

      {/* Animated particles overlay */}
      {/* <div className="absolute inset-0 bg-black/40 backdrop-blur-sm">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: Math.random() * window.innerWidth,
              top: Math.random() * window.innerHeight,
            }}
          />
        ))}
      </div> */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/95 backdrop-blur-xl py-7 px-5 md:px-8 rounded-2xl w-full max-w-[95%] sm:max-w-[400px] md:max-w-[400px] lg:max-w-[400px] xl:max-w-[400px] 2xl:max-w-[420px] relative z-10 shadow-2xl"
      >
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl py-7 px-5 md:px-8 max-w-[95%] sm:max-w-[400px] md:max-w-[400px] lg:max-w-[1200px] xl:max-w-[400px] 2xl:max-w-[1200] relative z-10 shadow-2xl"
        > */}
        {/* <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden"> */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-200/10 via-transparent to-pink-200/10" /> */}

        <div className="flex flex-col items-center">
          {/* Logo Section */}
          <motion.img
            src={Logo1}
            alt="College Logo"
            className="size-24 ml-15 mb-5 mx-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          />

          {/* Title Section */}
          <motion.div
            className="text-center text-3xl md:text-4xl mb-9"
            variants={itemVariants}
          >
            <span className="text-black">GCET</span> <br />
            <b className="text-blue-600">TLP FEEDBACK</b> <br />
            <span className="text-black">Application</span>
          </motion.div>

          {/* Form Section */}
          <form
            className="flex flex-col gap-3 items-center w-full"
            onSubmit={async (e) => {
              e.preventDefault();
              loading?.showLoading(true);

              Axios.post(`api/login`, {
                withCredentials: true,
                username: loginCreds.username.trim(),
                password: loginCreds.password,
              })
                .then(({ data }) => {
                  if (!data.goahead) {
                    alert?.showAlert(data.error as string, "error");
                  } else {
                    sessionStorage.setItem("username", loginCreds.username);
                    sessionStorage.setItem("displayName", data.displayName);
                    sessionStorage.setItem("desg", data.desg);
                    sessionStorage.setItem("branch", data.branch);
                    sessionStorage.setItem("batch", data.batch);
                    sessionStorage.setItem("sem", data.sem);
                    localStorage.setItem("token", data.token);
                    setUser({
                      username: loginCreds.username,
                      displayName: data.displayName,
                      desg: data.desg,
                      branch: data.branch,
                      batch: data.batch,
                      sem: data.sem,
                    });
                    document.cookie = `Token=${data.token}`;
                    if (data.passwordSameAsUsername) {
                      navigate("/change-password")
                    } else {
                      if (data.desg === "admin") {
                        navigate("/report");
                      } else {
                        navigate("/sem");
                      }
                    }
                  }
                })
                .catch((_error) => alert?.showAlert("Server Down Contact Admin", "warning"))
                .finally(() => loading?.showLoading(false));
            }}
          >
            <motion.div variants={itemVariants} className="w-full">
              <TextField
                autoFocus
                fullWidth
                type="outlined"
                value={loginCreds.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlined />
                    </InputAdornment>
                  ),
                }}
                label="Username"
                onChange={({ target: { value } }) =>
                  setLoginCreds((prevVals) => ({ ...prevVals, username: value }))
                }
                className="animate-field"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="w-full">
              <TextField
                fullWidth
                type={showPass ? "text" : "password"}
                variant="outlined"
                value={loginCreds.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyOutlined />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ maxLength: 15 }}
                label="Password"
                onChange={({ target: { value } }) =>
                  setLoginCreds((prevVals) => ({ ...prevVals, password: value }))
                }
                className="animate-field"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="w-full">
              <FormGroup>
                <FormControlLabel
                  label="Show password"
                  control={
                    <Checkbox onClick={() => setShowPass((prev) => !prev)} />
                  }
                />
              </FormGroup>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`bg-blue-700 px-4 py-2 text-white rounded-md w-full text-base lg:text-lg duration-300 
                ${loginCreds.username.length < 4 || loginCreds.password.length < 10
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-800 hover:shadow-lg transform transition-all"
                }`}
              disabled={loginCreds.username.length < 4 || loginCreds.password.length < 10}
            >
              Login
            </motion.button>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ color: 'blue', marginTop: '10px' }}
              onClick={() => navigate("/change-password")}
              className="hover:text-blue-700 transition-colors"
            >
              Forget Password?
            </motion.button>
          </form>
        </div>

        {/* About button */}
        <Tooltip title="About Us" placement="left" arrow>
          <motion.button
            onClick={() => navigate('/aboutus')}
            whileHover={{ scale: 1.1, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-700 transition-all duration-300"
            style={{
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
            }}
          >
            <InfoOutlined className="text-2xl" />
          </motion.button>
        </Tooltip>
        {/* </div> */}
      </motion.div>
    </div>
  );
}
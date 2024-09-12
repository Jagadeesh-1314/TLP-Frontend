0// LoginForm.tsx
import { useState, useContext, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { PersonOutlineOutlined, VpnKeyOutlined } from "@mui/icons-material";
import { AlertContext } from "../../components/Context/AlertDetails";
import Logo from "/assets/cam2.png";
import Logo1 from "/assets/Logo.png";
import Axios from "axios";
import { LoadingContext } from "../../components/Context/Loading";
import { useAuth } from "../../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";

interface LoginCredentialsProps {
  username: string;
  password: string;
  displayName: string;
  branch: string;
  batch: number;
}

export default function LoginForm() {
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);
  const {setUser} = useAuth()!;

  const [showPass, setShowPass] = useState(false);
  const [loginCreds, setLoginCreds] = useState<LoginCredentialsProps>({
    username: "",
    password: "",
    displayName: "",
    branch: "",
    batch: 0,
  });
  const navigate = useNavigate();
  // if(user?.desg === 'admin') {
  //   navigate('/report')
  // }
  // else{
  //   navigate('/sem')
  // }

  const [desg, setDesg] = useState<string>("");
  useEffect(() => {
    Axios.get(`api/desg?username=${loginCreds.username}`)
      .then(({ data }) => {
        setDesg(data.desg)
      })
  }, [loginCreds.username]);

  return (
    <div className="h-screen flex justify-center items-center bg-cover" style={{ backgroundImage: `url(${Logo})` }}>
      <div className="bg-white py-7 md:px-6 px-3 rounded-lg">
        <div className="flex flex-col items-center">
          <img
            src={Logo1}
            alt="College Logo"
            className="lg:block size-24 ml-15 mb-5 mx-auto"
          />
          <div className="text-center md:text-5xl text-5xl mb-7">
            <span className="text-black">GCET</span> <br />
            <b className="text-blue-600">TLP FEEDBACK</b> <br />
            <span className="text-black">Application</span>
          </div>

          <form
            className="flex flex-col gap-3 items-center max-w-[400px] w-full"
            onSubmit={async (e) => {
              e.preventDefault();
              loading?.showLoading(true);

              Axios.post(`api/login`, {
                withCredentials: true,
                username: desg === 'admin' ? loginCreds.username : loginCreds.username.toUpperCase(),
                password: loginCreds.password,
              })
                .then(({ data }) => {
                  if (!data.goahead)
                    alert?.showAlert(data.error as string, "error");
                  else {
                    // console.log(data);
                    sessionStorage.setItem("username", loginCreds.username);
                    sessionStorage.setItem("displayName", data.displayName);
                    sessionStorage.setItem("desg", data.desg);
                    sessionStorage.setItem("branch", data.branch);
                    sessionStorage.setItem("batch", data.batch);
                    sessionStorage.setItem("sem", data.sem);
                    setUser({username: loginCreds.username, displayName:data.displayName, desg: data.desg, branch: data.branch, batch: data.batch, sem: data.sem })
                    document.cookie = `Token=${data.token}`;
                    if(data.desg === 'admin') {
                      navigate('/report');
                    } else {
                      navigate("/sem");
                    }
                  }
                })
                .catch((_error) => alert?.showAlert("Please Try after 5 mins", "warning"))
                .finally(() => loading?.showLoading(false));
            }}
          >
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
            />
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
            />
            <FormGroup sx={{ marginRight: "auto" }}>
              <FormControlLabel
                label="Show password"
                control={
                  <Checkbox onClick={() => setShowPass((prev) => !prev)} />
                }
              />
            </FormGroup>
            <button
              type="submit"
              className={`bg-blue-700 px-4 py-2 text-white rounded-md ml-auto lg:text-xl md:text-lg text-base duration-300 w-full ${loginCreds.username.length < 4 || loginCreds.password.length < 10 ? 'disabled' : ''}`}
              disabled={loginCreds.username.length < 4 || loginCreds.password.length < 10}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

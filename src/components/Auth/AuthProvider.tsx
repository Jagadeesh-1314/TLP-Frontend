import Axios, { AxiosStatic } from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";


type AuthContextType = {
  token: string;
  user: {
    username: string,
    desg: string,
    displayName: string,
    branch: string;
    batch: number;
  } | null;
  Axios: AxiosStatic;
  setUser: (v:{
    username: string,
    desg: string,
    displayName: string,
    branch: string;
    batch: number;
  } | null)=>void;
  logOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{
    username: string,
    desg: string,
    displayName: string,
    branch: string;
    batch: number;
  } | null>(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (sessionStorage.getItem('username')) {
      setUser({username: sessionStorage.getItem('username')!,displayName:sessionStorage.getItem("displayName")!, desg:sessionStorage.getItem('desg')!, branch: sessionStorage.getItem('branch')!, batch: Number(sessionStorage.getItem('batch'))! })
      Axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("token", token);
      
      
    } else {
      
    }
  }, []);
  const setUserInAuth = (v:{
    username: string,
    desg: string,
    displayName: string,
    branch: string;
    batch: number;
  } | null) => {
    setUser(v);
  }

  

  const logOut = useMemo(
    () => () => {
      setUser(null);
      setToken("");
      
    },
    []
  );

  return (
    <AuthContext.Provider value={{ token, user, Axios, setUser: setUserInAuth, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
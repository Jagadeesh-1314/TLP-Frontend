import { Navigate, Outlet } from "react-router-dom";
import Title from "../Title";

const PrivateRoute = () => {
  if (!sessionStorage.getItem('username')) return <Navigate to="/login" />;

  return <>
    
    <Outlet />
  </>
};

export default PrivateRoute;
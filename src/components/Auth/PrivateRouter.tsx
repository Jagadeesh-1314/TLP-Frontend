import { Navigate, Outlet } from "react-router-dom";
import Title from "../Title";

const PrivateRoute = () => {
  if (!sessionStorage.getItem('username')) return <Navigate to="/login" />;

  return <>
    <Title />
    <Outlet />
  </>
};

export default PrivateRoute;
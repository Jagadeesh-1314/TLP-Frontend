import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PrivateRoute = () => {
    const { user } = useAuth()!;
    const lastPage = sessionStorage.getItem('lastPage')
    if (!user || user.desg !== 'admin') {
        return (
            <Navigate to={`${lastPage}`} />
        );
    }

    return <Outlet />;
};

export default PrivateRoute;

import { useLocation } from "react-router-dom";

const useShowNavbar = () => {
  const location = useLocation();
  const excludedPaths = ["/thank-you", "/completed"];
  return !excludedPaths.includes(location.pathname);
};

export default useShowNavbar;

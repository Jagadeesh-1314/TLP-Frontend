import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const showNavbar = () => {
  const location = useLocation();
  const excludedPaths = ["/thank-you", "/completed"];
  return !excludedPaths.includes(location.pathname) ?  <Navbar
  user={sessionStorage.getItem("username") as string}
  desg={sessionStorage.getItem("desg") as string}
/>: <></>;
};

export default showNavbar;

import { useLocation } from "react-router-dom";

export default function Title() {
  const { pathname } = useLocation();

  return (
    <div className="flex no-print items-center gap-4 justify-center mb-6">
      <span className="page-title">
        {pathname
          .split("/")
          .filter((path) => path !== "")[0]
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </span>
    </div>
  );
}

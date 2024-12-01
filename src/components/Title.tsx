import { useContext, useState, useLayoutEffect } from "react";
import Axios from "axios";
import { AlertContext } from "./Context/AlertDetails";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface TitleProps {
  title: string;
}

export default function Title({ title }: TitleProps) {
  const alert = useContext(AlertContext);
  const [term, setTerm] = useState<number>(0);
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    Axios.get<{ done: boolean, term: number }>(`api/fetchterm`)
      .then(({ data }) => {
        if (data.done) {
          setTerm(data.term);
        }
      })
      .catch((err) => {
        console.log(err);
        alert?.showAlert("Error fetching term", "error");
      });
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }

          .term-box {
            display: flex;
            align-items: center;
            font-size: 2.5vh;
            font-weight: bold;
            padding: 1vh;
            color: violet;
            border-radius: 5px;
            background-color: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .term-box:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
          }

          .blinker-dot {
            margin-right: 8px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: green;
            animation: blink 1s infinite;
          }
        `}
      </style>

      <motion.div 
        className="flex flex-col md:flex-row items-center justify-between mb-6" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex-1 text-center md:text-center lg:ml-[190px] md:ml-[160px]" 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <span className="page-title text-2xl font-semibold text-gray-800">
            {title
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </span>
        </motion.div>

        {(pathname !== "/control" && pathname !== "/manage-users") && (
          <motion.div 
            className="term-box ml-auto mt-2 md:mt-0" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }}
          >
            <span className="blinker-dot"></span>
            {term !== null ? `Current Term: ${term}` : "Loading current term..."}
          </motion.div>
        )}

      </motion.div>
    </>
  );
}

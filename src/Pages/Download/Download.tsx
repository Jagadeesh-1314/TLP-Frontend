import {
  MenuItem,
} from "@mui/material";
import { CustTextField } from "../../components/Custom/CustTextField";
import { useContext, useRef, useState } from "react";
import {
  DownloadOutlined,
} from "@mui/icons-material";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { LoadingContext } from "../../components/Context/Loading";
import { motion } from "framer-motion";
import Title from "../../components/Title";

export default function Download() {
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  // ANCHOR STATES && VARS  ||========================================================================
  const [type, setType] = useState("timetable");
  const buttonPopoverRef = useRef<HTMLButtonElement>(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };


  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4"
      >
        <Title title="Download" />

        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 no-print">
          <CustTextField
            select
            label="Type"
            value={type}
            onChange={({ target: { value } }) =>
              setType(value)
            }
          >
            <MenuItem value="timetable">Time table</MenuItem>
            <MenuItem value="studentinfo">Student Info</MenuItem>
            <MenuItem value="subjects">Subjects</MenuItem>
            <MenuItem value="faculty">Faculty</MenuItem>
            <MenuItem value="electives">Electives</MenuItem>
            <MenuItem value="questions">Questions</MenuItem>
          </CustTextField>

          <div className="flex w-full col-span-2 row-start-2 gap-4">

          </div>

          <div className="row-start-3 col-span-1 flex items-center divide-x divide-blue-600">
            <button
              className="blue-button-filled w-full flex items-center justify-between"
              style={{ borderRadius: "6px 0px 0px 6px" }}
              ref={buttonPopoverRef}
            >
              <span
                className={`duration-300`}
              >
                {type.toUpperCase()}
              </span>
            </button>
            <button
              className="blue-button-filled"
              style={{ borderRadius: "0px 6px 6px 0px" }}
              onClick={() => {
                loading?.showLoading(true, "Downloading file...");
                Axios.get(
                  `api/download/table?tableName=${type}`,
                  { responseType: "blob" }
                )
                  .then(({ data, headers }) => {
                    if (data.type !== "application/json") {
                      const url = window.URL.createObjectURL(new Blob([data]));
                      const link = document.createElement("a");
                      link.href = url;
                      const fileName =
                        headers["content-disposition"]?.split("filename=")[1];
                      link.setAttribute("download", `${fileName.slice(1, -1)}`);
                      document.body.appendChild(link);
                      link.click();
                      alert?.showAlert("File downloaded successfully", "success");
                    } else alert?.showAlert("No data found", "warning");
                  })
                  .catch(() =>
                    alert?.showAlert("Error while downloading file", "error")
                  )
                  .finally(() => loading?.showLoading(false));
              }}
            >
              <DownloadOutlined fontSize="small" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

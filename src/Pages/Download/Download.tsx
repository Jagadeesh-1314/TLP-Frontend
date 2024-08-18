import {
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from "@mui/material";
import { CustTextField } from "../../components/Custom/CustTextField";
import { useContext, useRef, useState } from "react";
import {
  DeleteForeverOutlined,
  DownloadOutlined,
} from "@mui/icons-material";
import { CustDialog } from "../../components/Custom/CustDialog";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { LoadingContext } from "../../components/Context/Loading";

export default function Download() {
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  // ANCHOR STATES && VARS  ||========================================================================
  const [type, setType] = useState("report");
  const buttonPopoverRef = useRef<HTMLButtonElement>(null);


  return (
    <>
      <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-4 no-print">
        <CustTextField
          select
          label="Type"
          value={type}
          onChange={({ target: { value } }) =>
            setType(value)
          }
        >
          <MenuItem value="report">Report</MenuItem>
          <MenuItem value="theoryscore1">Theory Score</MenuItem>
          <MenuItem value="labscore">Lab Score</MenuItem>
          
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

      <Truncate />
    </>
  );
}

function Truncate() {
  const loading = useContext(LoadingContext);
  const alert = useContext(AlertContext);

  const [openDialog, setOpenDialog] = useState(false);
  const [exam, setExam] = useState("supple");
  const [acYear, setAcYear] = useState("0");
  const [sem, setSem] = useState("0");

  return (
    <>
      <button
        className="red-button-filled fixed bottom-4 right-4 flex items-center gap-2"
        onClick={() => setOpenDialog(true)}
      >
        <DeleteForeverOutlined />
        Truncate
      </button>

      <CustDialog open={openDialog} maxWidth="md" fullWidth>
        <DialogTitle component={"div"}>
          <span className="lg:text-5xl md:text-4xl text-3xl text-red-600 font-semibold">
            Truncate
          </span>
        </DialogTitle>
        <DialogContent>
          <div className="flex gap-2 items-center justify-between mt-4">
            <CustTextField
              select
              label="Exam"
              value={exam}
              onChange={({ target: { value } }) => setExam(value)}
            >
              <MenuItem value="supple">Supplementary</MenuItem>
              <MenuItem value="reval">Revaluation</MenuItem>
              <MenuItem value="cbt">Written Test</MenuItem>
            </CustTextField>
            <CustTextField
              select
              label="Academic Year"
              value={acYear}
              onChange={({ target: { value } }) => setAcYear(value)}
            >
              <MenuItem value="0">All</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="4">4</MenuItem>
            </CustTextField>
            <CustTextField
              select
              label="Semester"
              value={sem}
              onChange={({ target: { value } }) => setSem(value)}
            >
              <MenuItem value="0">Both</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
            </CustTextField>
          </div>
        </DialogContent>
        <DialogActions>
          <button className="red-button" onClick={() => setOpenDialog(false)}>
            Cancel
          </button>
          <button
            className="blue-button"
            onClick={() => {
              loading?.showLoading(true);
              Axios.delete(`api/${exam}?acYear=${acYear}&sem=${sem}`)
                .then(({ data }) => {
                  if (data.done) {
                    alert?.showAlert(
                      `${
                        exam.charAt(0).toUpperCase() + exam.slice(1)
                      } tables cleared`,
                      "success"
                    );
                  } else {
                    console.log(data);
                    alert?.showAlert(
                      "There was an error while processing request",
                      "error"
                    );
                  }
                })
                .catch((e) => {
                  alert?.showAlert("There was an error in the server", "error");
                  console.log(e);
                })
                .finally(() => loading?.showLoading(false));
            }}
            disabled={
              (acYear === "0" && sem !== "0") || (acYear !== "0" && sem === "0")
            }
          >
            Truncate
          </button>
        </DialogActions>
      </CustDialog>
    </>
  );
}
import { MenuItem } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { CustTextField } from "../../components/Custom/CustTextField";
import { UploadOutlined } from "@mui/icons-material";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { LoadingContext } from "../../components/Context/Loading";
import * as xlsx from "xlsx";

export default function Upload() {
  const [tableName, setTableName] = useState("timetable");
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [subType, setSubType] = useState<string>("theory");
  const alert = useContext(AlertContext);
  const folderLocationRef = useRef<HTMLInputElement>();
  const loading = useContext(LoadingContext);

  useEffect(() => {
    folderLocationRef.current?.focus();
  }, []);

  return (
    <>
      <div className="grid lg:grid-cols-6 md:grid-cols-2 grid-cols-2 gap-x-4 gap-y-4 no-print">
        <CustTextField
          select
          label="Type"
          value={tableName}
          onChange={({ target: { value } }) => {
            setTableName(value);
          }}
        >
          <MenuItem value="timetable">Time-Table</MenuItem>
          <MenuItem value="studentinfo">StudentsInfo</MenuItem>
          <MenuItem value="faculty">Faculty</MenuItem>
          <MenuItem value="subjects">Subjects</MenuItem>
        </CustTextField>
      </div>

      {/* Folder location */}
      <div className="grid pt-4 lg:grid-cols-6 md:grid-cols-2 grid-cols-2 gap-4 no-print">
        {/* Subject Type */}
        {tableName === "subjects" && (
          <CustTextField
            select
            label="Type"
            value={subType}
            onChange={({ target: { value } }) => {
              setSubType(value);
            }}
          >
            <MenuItem value="theory">Theory</MenuItem>
            <MenuItem value="lab">Lab</MenuItem>
          </CustTextField>
        )}
        <div className="col-span-4 row-start-2 flex gap-3 items-center">
          <input
            type="file"
            name="file"
            onChange={(e) => {
              if (e.target.files) setUploadingFile(e.target.files[0]);
            }}
          />
        </div>

        {/* button */}
        <div className="col-span-3 row-start-3 flex gap-4 items-center">
          <button
            type="submit"
            className="blue-button-filled col-span-1 h-fit flex items-center gap-2"
            disabled={uploadingFile === null || !uploadingFile}
            onClick={async () => {
              if (!uploadingFile) {
                alert?.showAlert("Please select a file", 'warning');
                return;
              }

              loading?.showLoading(true, "Uploading file...");
              const formData = new FormData();
              formData.append('file', uploadingFile);
              formData.append('subtype', subType);

              await Axios.post(`/api/upload/${tableName}`, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                }
              })
                .then(({ data }) => {
                  console.log(data);
                  if (data.done) alert?.showAlert("Uploaded", "success");
                  else alert?.showAlert("Failed to upload", "error");
                })
                .catch(() =>
                  alert?.showAlert("Error while uploading file", "error")
                )
                .finally(() => loading?.showLoading(false));
            }}
          >
            <UploadOutlined fontSize="small" />
            Upload
          </button>

          {/* Download template button */}
          {tableName && (
            <button
              type="submit"
              className="blue-button-filled col-span-1 flex items-center gap-2"
              onClick={async () => {
                loading?.showLoading(true, "Downloading file...");
                let columnNames: string[] = [];
                let name: string | null = null;
                if (tableName === "timetable") {
                  columnNames = ["facId", "subCode", "sem", "sec"];
                  name = "Time-Table";
                } else if (tableName === "studentinfo") {
                  columnNames = ["rollno", "sec", "sem"];
                  name = "StudentsInfo";
                } else if (tableName === "faculty") {
                  columnNames = ["facId", "facName"];
                  name = "Faculty";
                } else if (tableName === "subjects") {
                  columnNames = ["subCode", "subName"];
                  name = "Subjects";
                }
                const wb = xlsx.utils.book_new();
                const ws = xlsx.utils.aoa_to_sheet([columnNames]);
                xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
                const excelBuffer = xlsx.write(wb, { type: "buffer", bookType: 'xlsx' });
                const blob = new Blob([excelBuffer as BlobPart], {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `${name} Template.xlsx`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                alert?.showAlert("File downloaded successfully", "success");
                loading?.showLoading(false);
              }}
            >
              Download Template
            </button>
          )}
        </div>
      </div>
    </>
  );
}

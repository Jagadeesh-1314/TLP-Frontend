import { MenuItem } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { CustTextField } from "../../components/Custom/CustTextField";
import { UploadOutlined } from "@mui/icons-material";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { LoadingContext } from "../../components/Context/Loading";
import * as xlsx from "xlsx";
import dayjs from "dayjs";
import { useAuth } from "../../components/Auth/AuthProvider";
import Title from "../../components/Title";
import { Download, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";

export default function Upload() {
  const currentYear = dayjs().year();
  const [tableName, setTableName] = useState("timetable");
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [batch, setBatch] = useState<number>(currentYear);
  const alert = useContext(AlertContext);
  const folderLocationRef = useRef<HTMLInputElement>();
  const [dragActive, setDragActive] = useState(false);

  const loading = useContext(LoadingContext);
  const { user } = useAuth()!;

  useEffect(() => {
    folderLocationRef.current?.focus();
  }, []);


  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadingFile(e.dataTransfer.files[0]);
    }
  };

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
        <Title title="Upload" />
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-x-4 gap-y-4 no-print">
          <CustTextField
            select
            label="Type"
            value={tableName}
            onChange={({ target: { value } }) => {
              setTableName(value);
              setUploadingFile(null);
            }}
          >
            <MenuItem value="timetable">Time-Table</MenuItem>
            <MenuItem value="studentinfo">StudentsInfo</MenuItem>
            <MenuItem value="faculty">Faculty</MenuItem>
            <MenuItem value="subjects">Subjects</MenuItem>
            <MenuItem value="electives">Electives</MenuItem>
          </CustTextField>
        </div>

        {/* Batch location */}
        <div className="grid pt-4 lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-x-4 gap-y-5 no-print">
          {tableName === "studentinfo" && (
            <CustTextField
              select
              label="Batch"
              value={batch}
              onChange={({ target: { value } }) => {
                setBatch(parseInt(value));
              }}
            >
              <MenuItem value={currentYear}>{currentYear}</MenuItem>
              <MenuItem value={currentYear - 1}>{currentYear - 1} (Lateral Entry)</MenuItem>
            </CustTextField>
          )}
        </div>

        {/* File Upload Area */}
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-fadeIn">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 mb-4
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".xlsx, .csv"
              onChange={(e) => {
                if (e.target.files) setUploadingFile(e.target.files[0]);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="space-y-4">
              <div className="flex justify-center">
                <FileSpreadsheet
                  className={`w-12 h-12 transition-all duration-300 transform
                  ${uploadingFile ? 'text-green-500 scale-110' : 'text-gray-400'}`}
                />
              </div>
              <div>
                {uploadingFile ? (
                  <p className="text-green-600 font-medium animate-fadeIn">{uploadingFile.name}</p>
                ) : (
                  <>
                    <p className="text-gray-600">Drag and drop your file here or click to browse</p>
                    <p className="text-sm text-gray-500 mt-2">Excel files only</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105
              ${uploadingFile
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              disabled={!uploadingFile}
              onClick={async () => {
                if (!uploadingFile) {
                  alert?.showAlert("Please select a file", 'warning');
                  return;
                }

                loading?.showLoading(true, "Uploading file...");
                const formData = new FormData();
                formData.append('file', uploadingFile);
                formData.append('batch', batch.toString());


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
                  .catch((err) => {
                    alert?.showAlert("Error while uploading file", "error");
                    console.log(err.response.data.error)
                  })
                  .finally(() => loading?.showLoading(false));
              }}
            >
              <UploadOutlined fontSize="small" />
              Upload
            </button>

            {/* Download template button */}
            {tableName && (
              <button
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-blue-600 border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                onClick={async () => {
                  loading?.showLoading(true, "Downloading file...");
                  let columnNames: string[] = [];
                  let name: string | null = null;
                  if (user?.branch === 'FME') {
                    if (tableName === "timetable") {
                      columnNames = ["facId", "subCode", "sec", "sem", "branch"];
                      name = "Time-Table";
                    } else if (tableName === "studentinfo") {
                      columnNames = ["rollno", "Name", "sec", "sem", "branch"];
                      name = `${user?.branch} StudentsInfo ${currentYear}`;
                    } else if (tableName === "faculty") {
                      columnNames = ["facultyId", "facultyName"];
                      name = "Faculty";
                    } else if (tableName === "subjects") {
                      columnNames = ["subjectCode", "subjectName", "type(lab, theory)", "core(r) / Elective(e))"];
                      name = "Subjects";
                    }
                  } else {
                    if (tableName === "timetable") {
                      columnNames = ["facId", "subCode", "sem", "sec"];
                      name = "Time-Table";
                    } else if (tableName === "studentinfo") {
                      columnNames = ["rollno", "Name", "sec", "sem"];
                      name = `${user?.branch} StudentsInfo ${currentYear}`;
                    } else if (tableName === "faculty") {
                      columnNames = ["facultyId", "facultyName"];
                      name = "Faculty";
                    } else if (tableName === "subjects") {
                      columnNames = ["subjectCode", "subjectName", "type(lab, theory)", "core(r) / Elective(e))"];
                      name = "Subjects";
                    }
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
                <Download className="w-5 h-5" />
                Download Template
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
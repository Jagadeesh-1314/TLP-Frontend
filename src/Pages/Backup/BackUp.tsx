import { MenuItem } from "@mui/material";
import { CustTextField } from "../../components/Custom/CustTextField";
import { useContext, useEffect, useRef, useState } from "react";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { LoadingContext } from "../../components/Context/Loading";

export default function backup() {
  const [action, setAction] = useState("backUp");
  const [loc, setLoc] = useState("");
  const folderLocationRef = useRef<HTMLInputElement>();
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  useEffect(() => {
    folderLocationRef.current?.focus();
  }, [action]);

  return (
    <>
      {/* Backup... Restore... */}
      <div className="grid lg:grid-cols-6 md:grid-cols-2 grid-cols-2 gap-x-4 gap-y-4 no-print">
        <CustTextField
          select
          label="Action"
          value={action}
          onChange={({ target: { value } }) => {
            setAction(value);
          }}
        >
          <MenuItem value="backUp">Backup</MenuItem>
          <MenuItem value="restore">Restore</MenuItem>
        </CustTextField>

        {action === "backUp" && (
          <>
            <button
              type="submit"
              className="blue-button-filled col-span-1 mr-auto h-fit flex items-center gap-2 row-start-2"
              onClick={async () => {
                loading?.showLoading(true, "Downloading file...");
                await Axios.get(
                  "/api/download/table?tableName=studentinfo&sem=0&acYear=0",
                  { responseType: "blob" }
                )
                  .then(({ data }) => {
                    if (data.type !== "application/json") {
                      const url = window.URL.createObjectURL(new Blob([data]));
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute("download", "backup.xlsx");
                      document.body.appendChild(link);
                      link.click();
                      alert?.showAlert(
                        "File downloaded successfully",
                        "success"
                      );
                    } else alert?.showAlert("No data found", "warning");
                  })
                  .catch(() =>
                    alert?.showAlert("Error while downloading file", "error")
                  )
                  .finally(() => loading?.showLoading(false));
              }}
            >
              Create Backup
            </button>
          </>
        )}

        {action === "restore" && (
          <>
            <div className="text-red-600 text-l font-bold text-2xl col-span-2 row-start-2 flex gap-4 whitespace-nowrap">
              The file name MUST be <code>backup.csv</code> /{" "}
              <code>backup.xlsx</code>
            </div>

            {/* Folder loaction */}
            <div className="col-span-2 row-start-3 flex gap-4">
              <CustTextField
                fullWidth
                type="string"
                label="Folder Location"
                value={loc}
                inputRef={folderLocationRef}
                onChange={({ target: { value } }) => {
                  setLoc(value);
                }}
              />
            </div>

            {/* button */}
            <div className="col-span-2 row-start-3 flex gap-4 items-center">
              <button
                type="submit"
                className="blue-button-filled col-span-1 mr-auto h-fit flex items-center gap-2"
                onClick={async () => {
                  loading?.showLoading(true, "Restoring file...");
                  if (action === "restore") {
                    await Axios.post("/api/upload/studentinfo", {
                      loc: loc,
                    })
                      .then(({ data }) => {
                        console.log(data);
                        if (data.done) alert?.showAlert("Restored", "success");
                        else alert?.showAlert("Failed to Restore", "error");
                      })
                      .catch(() =>
                        alert?.showAlert("Error while Uploading file", "error")
                      )
                      .finally(() => loading?.showLoading(false));
                  }
                }}
              >
                Restore
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

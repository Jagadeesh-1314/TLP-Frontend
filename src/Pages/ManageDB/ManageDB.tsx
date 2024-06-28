import {
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { CustTextField } from "../../components/Custom/CustTextField";
import { useContext, useState } from "react";
import {
  Add,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { LoadingContext } from "../../components/Context/Loading";
import { CustDataGrid } from "../../components/Custom/CustDataGrid";
import {
  GridActionsCellItem,
  GridColDef,
  GridFooter,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
  AvailableDbTables,
  ManageDBResponseArr,
  ManageDBResponseProps,
} from "../../Types/responseTypes";
import { CustDialog } from "../../components/Custom/CustDialog";
import dayjs from "dayjs";
import { formatCost } from "../../misc/CostFormater";

export default function ManageDB() {
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  // ANCHOR STATES && VARS  ||========================================================================
  const [table, setTable] = useState<AvailableDbTables>("studentInfo");
  const [rollNo, setRollNo] = useState("");
  const [responseData, setResponseData] = useState<ManageDBResponseArr>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const datagridCols: GridColDef[] = [
    { field: "id", headerName: "S No.", minWidth: 80, editable: false },
    {
      field: "subCode",
      headerName: "Subject Code",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "subName",
      headerName: "Subject Name",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "grade",
      headerName: "Grade",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "acYear",
      headerName: "AC Year",
      flex: 1,
      minWidth: 130,
      type: "number",
      renderCell: ({ value }) => value,
    },
    {
      field: "sem",
      headerName: "Semester",
      flex: 1,
      minWidth: 140,
      type: "number",
      renderCell: ({ value }) => value,
    },
    {
      field: "stat",
      headerName: "Status",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "exYear",
      headerName: "Exam Year",
      flex: 1,
      minWidth: 150,
      type: "number",
      renderCell: ({ value }) => value,
    },
    {
      field: "exMonth",
      headerName: "Exam Month",
      flex: 1,
      minWidth: 160,
      type: "number",
      renderCell: ({ value }) => value,
    },
    {
      field: "user",
      headerName: "User",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "grandTotal",
      headerName: "Amount Paid",
      flex: 1,
      minWidth: 150,
      type: "number",
      renderCell: ({ value }) => formatCost(value),
    },
    {
      field: "regDate",
      headerName: "Registered Date",
      flex: 1,
      minWidth: 180,
      renderCell: ({ value }) => dayjs(value).format("DD MMM, YYYY"),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 130,
      cellClassName: "actions",
      renderCell: ({ row }) => {
        return [
          <ManageRowDetails
            key={1}
            row={row as ManageDBResponseProps}
            type="edit"
            responseData={responseData}
            setResponseData={setResponseData}
            rollNo={rollNo}
            table={table}
          />,
          <DeleteConfirmDialog
            table={table}
            tablesNames={tablesNames}
            row={row}
            setResponseData={setResponseData}
            key={2}
            rollNo={rollNo}
          />,
        ];
      },
    },
  ];

  const tablesNames: Record<AvailableDbTables, string> = {
    studentInfo: "Student Database",
    subjects: "Subjects",
    facutly: "faculty",
    printReval: "Unregistered Revaluation",
    paidReEvaluation: "Registered Revaluation",
    printCBT: "Unregistered Written Test",
    paidCBT: "Registered Written Test",
  };

  // ANCHOR JSX  ||========================================================================
  return (
    <>
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 no-print items-center">
        <CustTextField
          select
          label="Table"
          value={table}
          onChange={({ target: { value } }) => {
            setTable(value as AvailableDbTables);
            setResponseData([]);
            setSelectedRows([]);
          }}
        >
          <MenuItem value={"studentInfo"}>Student Database</MenuItem>
          <MenuItem value={"subjects"}>Subjects</MenuItem>
          <MenuItem value={"facutly"}>Faculty</MenuItem>
        </CustTextField>

        {/* ANCHOR FORM ||======================================================================== */}
        <form
          className="row-start-2 grid sm:grid-cols-3 grid-cols-1 items-center gap-x-4 gap-y-2 sm:col-span-3 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            loading?.showLoading(true);
            Axios.get(
              `api/manage/database/search?rollNo=${rollNo}&tableName=${table}`
            )
              .then(
                ({
                  data: { stdData },
                }: {
                  data: { stdData: ManageDBResponseArr };
                }) => {
                  if (stdData.length === 0) {
                    setResponseData([]);
                    alert?.showAlert("No data found", "warning");
                  } else
                    setResponseData(
                      stdData.map((element, indx) => ({
                        ...element,
                        id: indx + 1,
                      }))
                    );
                }
              )
              .catch(() =>
                alert?.showAlert("Couldn't connect to the server", "error")
              )
              .finally(() => loading?.showLoading(false));
          }}
        >
          {table === "studentInfo" && (
            <CustTextField
              autoFocus
              label="Roll Number"
              className="row-start-1"
              inputProps={{ maxLength: 10 }}
              value={rollNo}
              onChange={({ target: { value } }) => {
                setRollNo(value.trim().toUpperCase());
                setResponseData([]);
                setSelectedRows([]);
              }}
            />
          )}

          {table === "subjects" && (
            <CustTextField
              select
              label="AC - Sem"
              value={table}
              className="row-start-1"
              onChange={({ target: { value } }) => {
                setTable(value as AvailableDbTables);
                setResponseData([]);
                setSelectedRows([]);
              }}
            >
              <MenuItem value={"1-1"}>1-1</MenuItem>
              <MenuItem value={"1-2"}>1-2</MenuItem>
              <MenuItem value={"2-1"}>2-1 </MenuItem>
              <MenuItem value={"2-2"}>2-2</MenuItem>
              <MenuItem value={"3-1"}>3-1</MenuItem>
              <MenuItem value={"3-2"}>3-2</MenuItem>
              <MenuItem value={"4-1"}>4-1</MenuItem>
              <MenuItem value={"4-2"}>4-2</MenuItem>

            </CustTextField>
          )}


          {table === "facutly" && (
            <CustTextField
              autoFocus
              label="Faculty ID"
              className="row-start-1"
              inputProps={{ maxLength: 10 }}
              value={rollNo}
              onChange={({ target: { value } }) => {
                setRollNo(value.trim().toUpperCase());
                setResponseData([]);
                setSelectedRows([]);
              }}
            />
          )}

          <button
            className="blue-button-filled flex items-center gap-2 sm:ml-0 ml-auto"
            disabled={rollNo.length < 10}
          >
            <SearchOutlined fontSize="small" />
            Search
          </button>
        </form>
      </div>

      {/* ANCHOR DATAGRID ||======================================================================== */}
      {responseData.length > 0 && (
        <div className={`bg-white p-4 rounded-sm mt-8 h-fit`}>
          <div className="flex mb-4 items-center justify-between lg:text-6xl text-4xl font-semibold text-blue-500">
            <span className="">{rollNo}</span>
            {table === "studentInfo" && (
              <span>
                <span className="text-red-500">
                  {responseData.filter(({ grade }) => grade === "F").length}
                </span>

                <span className="lg:text-4xl text-2xl font-normal">
                  /{responseData.length}
                </span>
              </span>
            )}
          </div>
          <CustDataGrid
            columns={datagridCols}
            rows={responseData}
            disableRowSelectionOnClick
            checkboxSelection
            columnVisibilityModel={{
              grade: table === "studentInfo",
              exYear: table === "studentInfo",
              exMonth: table === "studentInfo",
              user: table !== "studentInfo",
              total: table !== "studentInfo",
              regDate: table !== "studentInfo",
              stat: table === "paidReEvaluation",
              branch: table === "paidCBT",
            }}
            // isCellEditable={(params) => {
            //   const {row} = params

            // }}
            sx={{ height: 600 }}
            rowSelectionModel={selectedRows}
            onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
            slots={{
              toolbar: () => (
                <div className="flex items-center gap-2 justify-between p-4">
                  <div className="text-blue-500 lg:text-4xl text-2xl">
                    {tablesNames[table]}
                  </div>
                  {table === "studentInfo" && (
                    <ManageRowDetails
                      rollNo={rollNo}
                      responseData={responseData}
                      setResponseData={setResponseData}
                      type="add"
                      table="studentInfo"
                    />
                  )}
                </div>
              ),
              footer: () => (
                <div className="flex flex-col p-4">
                  <GridFooter />
                  <MultiDeleteDialog
                    rollNo={rollNo}
                    table={table}
                    setResponseData={setResponseData}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    responseData={responseData}
                  />
                </div>
              ),
            }}
            initialState={{ pagination: { paginationModel: { pageSize: 50 } } }}
            getRowClassName={({ row }) => {
              if (row?.grade == "F") return "datagrid-row-red";
              return "";
            }}
          />
        </div>
      )}
    </>
  );
}

// ANCHOR MANAGE ROW DETAILS  ||========================================================================
function ManageRowDetails({
  row,
  type,
  rollNo,
  responseData,
  setResponseData,
  table,
}: {
  row?: ManageDBResponseProps;
  type: "add" | "edit";
  rollNo: string;
  responseData: ManageDBResponseArr;
  setResponseData: React.Dispatch<React.SetStateAction<ManageDBResponseArr>>;
  table: AvailableDbTables;
}) {
  // STATES && VARS  ||========================================================================
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);
  const [openRowDetailsDialog, setOpenRowDetailsDialog] = useState(false);
  const [neuroDetails, setNeuroDetails] = useState<ManageDBResponseProps>(
    row
      ? { ...row, stat: row?.stat === "R" ? "R" : "S" }
      : ({
        grade: "O",
        acYear: 1,
        sem: 1,
      } as ManageDBResponseProps)
  );
  const [subjectAlreadyExists, setSubjectAlreadyExists] = useState(false);
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);

  // EFFECTS  ||========================================================================

  // JSX  ||========================================================================
  return (
    <>
      {type === "add" ? (
        <button
          className={`flex items-center lg:gap-2 gap-1 blue-button-outline`}
          onClick={() => {
            setOpenRowDetailsDialog(true);
          }}
        >
          <Add /> Add New Record
        </button>
      ) : (
        <GridActionsCellItem
          icon={<EditOutlined />}
          label="Edit"
          className="textPrimary"
          onClick={() => {
            setOpenRowDetailsDialog(true);
            if (table === "paidCBT") {
              Axios.get(`api/cbt/branchs`)
                .then(({ data }) => setAvailableBranches(data.branch))
                .catch((e) => {
                  console.log(e);
                  alert?.showAlert(
                    "There was an error while fetching available branches",
                    "error"
                  );
                });
            }
          }}
          color="inherit"
        />
      )}

      {/* ANCHOR ROW EDIT DIALOG ||======================================================================== */}
      <CustDialog
        open={openRowDetailsDialog}
        onClose={() => setOpenRowDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle component={"div"}>
          <span className="text-3xl font-semibold text-blue-500">
            {type === "add"
              ? `Add new record for ${rollNo}`
              : `Edit ${row?.subCode} - ${row?.subName}`}
          </span>
        </DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loading?.showLoading(true);
            if (type === "add") {
              Axios.post(`api/manage/database/${rollNo}`, {
                details: neuroDetails,
                tableName: "studentinfo",
              })
                .then(({ data }) => {
                  if (data.done) {
                    alert?.showAlert("New record created", "success");
                    setResponseData((prevVals) => {
                      const indx = prevVals.findIndex(
                        ({ subCode }) => subCode === row?.subCode
                      );
                      if (indx > -1) {
                        return [
                          ...prevVals.slice(0, indx),
                          neuroDetails,
                          ...prevVals.slice(indx + 1),
                        ];
                      }

                      return [
                        ...prevVals,
                        { ...neuroDetails, id: prevVals.length + 1 },
                      ];
                    });
                    setOpenRowDetailsDialog(false);
                  } else alert?.showAlert(data.error.message, "error");
                })
                .catch((e) => {
                  console.log(e);
                  alert?.showAlert("There was an error while saving", "error");
                })
                .finally(() => loading?.showLoading(false));
            } else {
              Axios.patch(`api/manage/database/${rollNo}`, {
                details: { ...neuroDetails, oldSubCode: row?.subCode },
                tableName: table,
                username: sessionStorage.getItem("username"),
              })
                .then(({ data }) => {
                  if (data.updated) {
                    alert?.showAlert("Record updated", "success");
                    setResponseData((prevVals) => {
                      const indx = prevVals.findIndex(
                        ({ subCode }) => subCode === row?.subCode
                      );
                      if (indx > -1) {
                        return [
                          ...prevVals.slice(0, indx),
                          neuroDetails,
                          ...prevVals.slice(indx + 1),
                        ];
                      }

                      return [
                        ...prevVals,
                        { ...neuroDetails, id: prevVals.length + 1 },
                      ];
                    });
                    setOpenRowDetailsDialog(false);
                    return;
                  }
                  alert?.showAlert(data.error.message, "error");
                })
                .finally(() => loading?.showLoading(false));
            }
          }}
        >
          <DialogContent>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
              <CustTextField
                label="Subject Code"
                value={neuroDetails.subCode ?? ""}
                onChange={({ target: { value } }) => {
                  setNeuroDetails({
                    ...neuroDetails,
                    subCode: value.toUpperCase(),
                  });
                }}
                onBlur={({ target: { value } }) => {
                  value = value.trim();
                  const subCodeSplitted = value.split("");
                  setNeuroDetails((prevVals) => ({
                    ...prevVals,
                    acYear: parseInt(subCodeSplitted[4] ?? "1") as
                      | 1
                      | 2
                      | 3
                      | 4,
                    sem: parseInt(subCodeSplitted[5] ?? "1") as 1 | 2,
                  }));

                  if (value.length > 0) {
                    Axios.get(`api/manage/database/sub-name/${value}`)
                      .then(({ data }) => {
                        if (!data.error)
                          setNeuroDetails((prevVals) => ({
                            ...prevVals,
                            subName: data.subName,
                          }));
                      })
                      .catch((e) => {
                        alert?.showAlert(e.response.data.error, "error");
                      });
                  }

                  if (
                    responseData.filter(
                      ({ subCode }) =>
                        subCode.toLowerCase() === value.toLowerCase()
                    ).length > 0 &&
                    value !== row?.subCode
                  ) {
                    setSubjectAlreadyExists(true);
                    setOpenRowDetailsDialog(true);
                    alert?.showAlert("Subject code already exists", "warning");
                  } else setSubjectAlreadyExists(false);
                }}
              />
              <CustTextField
                label="Subject Name"
                value={neuroDetails.subName ?? ""}
                onChange={({ target: { value } }) => {
                  setNeuroDetails({
                    ...neuroDetails,
                    subName: value.toUpperCase(),
                  });
                }}
              />

              {table === "studentInfo" ? (
                <CustTextField
                  label="Grade"
                  value={neuroDetails?.grade}
                  onChange={({ target: { value } }) => {
                    setNeuroDetails({
                      ...neuroDetails,
                      grade: value as Grades,
                    });
                  }}
                  select
                >
                  <MenuItem value="O">O</MenuItem>
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                  <MenuItem value="C">C</MenuItem>
                  <MenuItem value="F">F</MenuItem>
                </CustTextField>
              ) : (
                <CustTextField
                  value={neuroDetails.regDate}
                  label="Registered Date"
                  disabled
                />
              )}
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 mt-6 items-center gap-6">
              {table === "studentInfo" && (
                <>
                  <CustTextField
                    label="Exam Year"
                    type="number"
                    value={neuroDetails.exYear ?? ""}
                    InputProps={{
                      inputProps: {
                        min: dayjs().year() - 4,
                        max: dayjs().year(),
                      },
                    }}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        exYear: parseInt(value) > 0 ? parseInt(value) : 0,
                      });
                    }}
                  />
                  <CustTextField
                    label="Exam Month"
                    type="number"
                    value={neuroDetails.exMonth ?? ""}
                    InputProps={{
                      inputProps: { min: 1, max: 12 },
                    }}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        exMonth: parseInt(value) > 0 ? parseInt(value) : 0,
                      });
                    }}
                  />
                </>
              )}

              <CustTextField
                label="Academic Year"
                value={neuroDetails?.acYear}
                onChange={({ target: { value } }) => {
                  setNeuroDetails({
                    ...neuroDetails,
                    acYear: parseInt(value) as 1 | 2 | 3 | 4,
                  });
                }}
                select
              >
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
              </CustTextField>
              <CustTextField
                label="Semester"
                value={neuroDetails?.sem}
                onChange={({ target: { value } }) => {
                  setNeuroDetails({
                    ...neuroDetails,
                    sem: parseInt(value) as 1 | 2,
                  });
                }}
                select
              >
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
              </CustTextField>
              {table !== "studentInfo" && (
                <CustTextField
                  value={neuroDetails.user}
                  label="User"
                  onChange={({ target: { value } }) => {
                    setNeuroDetails({ ...neuroDetails, user: value });
                  }}
                />
              )}
              {table === "paidReEvaluation" ? (
                <CustTextField
                  value={neuroDetails.stat !== "R" ? "S" : "R"}
                  label="Status"
                  onChange={({ target: { value } }) =>
                    setNeuroDetails({
                      ...neuroDetails,
                      stat: (value === "R" ? "R" : "S") as "R" | "S",
                    })
                  }
                  select
                >
                  <MenuItem value="R">Regular</MenuItem>
                  <MenuItem value="S">Supplementary</MenuItem>
                </CustTextField>
              ) : table === "paidCBT" ? (
                <CustTextField
                  value={neuroDetails.branch}
                  label="Branch"
                  onChange={({ target: { value } }) =>
                    setNeuroDetails({ ...neuroDetails, branch: value })
                  }
                  select
                >
                  {availableBranches.map((branch) => (
                    <MenuItem key={branch} value={branch}>
                      {branch}
                    </MenuItem>
                  ))}
                </CustTextField>
              ) : null}
            </div>
          </DialogContent>
          <DialogActions>
            <button
              className="red-button"
              onClick={() => {
                setOpenRowDetailsDialog(false);
                setNeuroDetails(row as ManageDBResponseProps);
              }}
              type="button"
            >
              Cancel
            </button>
            <button
              className="blue-button"
              disabled={
                !neuroDetails.subCode ||
                !neuroDetails.subName ||
                (table === "studentInfo"
                  ? !neuroDetails.exYear || !neuroDetails.exMonth
                  : !neuroDetails.user) ||
                (table === "paidReEvaluation" &&
                  neuroDetails.stat !== "R" &&
                  neuroDetails.stat !== "S" &&
                  neuroDetails.stat !== "") ||
                subjectAlreadyExists
              }
              type="submit"
            >
              Save
            </button>
          </DialogActions>
        </form>
      </CustDialog>

      {/* ANCHOR DELETE CONFIRM DIALOG  */}
    </>
  );
}

// ANCHOR DELTE CONFIRM DIALOG  ||========================================================================
function DeleteConfirmDialog({
  table,
  row,
  setResponseData,
  tablesNames,
  rollNo,
}: {
  table: AvailableDbTables;
  row: ManageDBResponseProps;
  setResponseData: React.Dispatch<
    React.SetStateAction<ManageDBResponseProps[]>
  >;
  tablesNames: Record<AvailableDbTables, string>;
  rollNo: string;
}) {
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);

  return (
    <>
      <GridActionsCellItem
        icon={<DeleteOutlined />}
        label="Delete"
        className="textPrimary"
        onClick={() => setOpenDeleteConfirmDialog(true)}
        color="error"
        disabled={table.substring(0, 5) === "print"}
      />
      <CustDialog
        open={openDeleteConfirmDialog}
        onClose={() => setOpenDeleteConfirmDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle component={"div"}>
          <span className="text-red-600 font-semibold text-4xl">
            Delete {row?.subCode}-{row?.subName}?
          </span>
        </DialogTitle>
        <DialogContent>
          <div>
            This will permanatly delete this subject from{" "}
            <span className="font-bold">{tablesNames[table]}</span> for{" "}
            <span className="font-bold">{rollNo}</span>.
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="red-button"
            onClick={() => setOpenDeleteConfirmDialog(false)}
          >
            Cancel
          </button>
          <button
            className="blue-button"
            onClick={() => {
              loading?.showLoading(true);
              setOpenDeleteConfirmDialog(false);
              Axios.delete(
                `api/manage/database?rollNo=${rollNo}&subCode=${JSON.stringify([
                  row.subCode,
                ])}&tableName=${table}`
              )
                .then(() => {
                  setResponseData((prevVals) =>
                    prevVals
                      .filter(({ subCode }) => subCode !== row?.subCode)
                      .map((details, indx) => ({ ...details, id: indx + 1 }))
                  );
                  alert?.showAlert("Record deleted", "success");
                })
                .catch((e) => {
                  console.log(e);
                  alert?.showAlert(
                    "There was an error while downloading.",
                    "error"
                  );
                })
                .finally(() => loading?.showLoading(false));
            }}
          >
            Delete
          </button>
        </DialogActions>
      </CustDialog>
    </>
  );
}

// ANCHOR MULTI DELETE CONFIRM DIALOG  ||================================================================
function MultiDeleteDialog({
  table,
  setResponseData,
  responseData,
  rollNo,
  selectedRows,
  setSelectedRows,
}: {
  table: AvailableDbTables;
  setResponseData: React.Dispatch<
    React.SetStateAction<ManageDBResponseProps[]>
  >;
  responseData: ManageDBResponseProps[];
  rollNo: string;
  selectedRows: GridRowSelectionModel;
  setSelectedRows: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
}) {
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  let selectedRowsSubCodes: string[] = [];
  selectedRows.forEach((rowId) => {
    selectedRowsSubCodes.push(responseData[(rowId as number) - 1].subCode);
  });

  return (
    <>
      <button
        className="red-button-outline ml-auto"
        disabled={selectedRows.length === 0}
        onClick={() => {
          if (table.substring(0, 5) !== "print") setOpenDeleteDialog(true);
          else {
            if (selectedRows.length === responseData.length)
              setOpenDeleteDialog(true);
            else alert?.showAlert("Select all records to delete", "warning");
          }
        }}
      >
        Delete Selected
      </button>

      <CustDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle component={"div"}>
          <span className="text-4xl text-red-600 font-semibold">
            Delete multiple records
          </span>
        </DialogTitle>
        <DialogContent>
          <div className="font-semibold">
            All the following records will be deleted permanently.
          </div>
          <div className="mt-4">{selectedRowsSubCodes.join(", ")}</div>
        </DialogContent>
        <DialogActions>
          <button
            className="red-button"
            onClick={() => setOpenDeleteDialog(false)}
          >
            Cancel
          </button>
          <button
            className="blue-button"
            onClick={() => {
              loading?.showLoading(true);
              Axios.delete(
                `api/manage/database?rollNo=${rollNo}&subCode=${JSON.stringify(
                  selectedRowsSubCodes
                )}&tableName=${table}`
              )
                .then(({ data }) => {
                  if (data.deleted) {
                    alert?.showAlert("Record deleted", "success");
                    setResponseData((prevVals) =>
                      prevVals
                        .filter(({ id }) => !selectedRows.includes(id))
                        .map((row, indx) => ({ ...row, id: indx + 1 }))
                    );
                    setSelectedRows([]);
                  }
                })
                .catch((e) => {
                  console.log(e);
                  alert?.showAlert(
                    "There was an error while deleting",
                    "error"
                  );
                })
                .finally(() => loading?.showLoading(false));
            }}
          >
            Delete
          </button>
        </DialogActions>
      </CustDialog>
    </>
  );
}

import {
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { CustTextField } from "../../components/Custom/CustTextField";
import { useContext, useLayoutEffect, useState } from "react";
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
import { useAuth } from "../../components/Auth/AuthProvider";
import Title from "../../components/Title";

export default function ManageDB() {
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  // ANCHOR STATES && VARS  ||========================================================================
  const [table, setTable] = useState<AvailableDbTables>("timetable");
  const [responseData, setResponseData] = useState<ManageDBResponseArr>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [branch, setBranch] = useState<string>("");
  const [branches, setBranches] = useState<string[]>([]);
  const { user } = useAuth()!;

  const studentdatagridCols: GridColDef[] = [
    { field: "id", headerName: "S No.", minWidth: 80, editable: false },
    {
      field: "rollno",
      headerName: "ROLL-NO",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "Name",
      headerName: "Student Name",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "sem",
      headerName: "Semester",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "sec",
      headerName: "Section",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 1,
      minWidth: 130,
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
            table={table}
          />,
          <DeleteConfirmDialog
            table={table}
            tablesNames={tablesNames}
            row={row}
            setResponseData={setResponseData}
            key={2}
          />,
        ];
      },
    },
  ]

  const facultydatagridCols: GridColDef[] = [
    { field: "id", headerName: "S No.", minWidth: 80, editable: false },
    {
      field: "facID",
      headerName: "Faculty ID",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "facName",
      headerName: "Faculty Name",
      flex: 1,
      minWidth: 170,
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
            table={table}
          />,
          <DeleteConfirmDialog
            table={table}
            tablesNames={tablesNames}
            row={row}
            setResponseData={setResponseData}
            key={2}
          />,
        ];
      },
    },
  ]

  const subjectsdatagridCols: GridColDef[] = [
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
      field: "qtype",
      headerName: "Subject Type",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "def",
      headerName: "Core Subject / Elective  ",
      flex: 1,
      valueGetter(params) {
        return params.row.def === 'e' ? "Elective" : "Core Subject"
      },
      minWidth: 170,
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
            table={table}
          />,
          <DeleteConfirmDialog
            table={table}
            tablesNames={tablesNames}
            row={row}
            setResponseData={setResponseData}
            key={2}
          />,
        ];
      },
    },
  ]

  const timetabledatagridCols: GridColDef[] = [
    { field: "id", headerName: "S No.", minWidth: 80, editable: false },
    {
      field: "facID",
      headerName: "Faculty ID",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "facname",
      headerName: "Faculty Name",
      flex: 1,
      minWidth: 170,
    },
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
      field: "sem",
      headerName: "Semester",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "sec",
      headerName: "Section",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 1,
      minWidth: 130,
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
            table={table}
          />,
          <DeleteConfirmDialog
            table={table}
            tablesNames={tablesNames}
            row={row}
            setResponseData={setResponseData}
            key={2}
          />,
        ];
      },
    },
  ];

  const tablesNames: Record<AvailableDbTables, string> = {
    studentInfo: "Student Database",
    subjects: "Subjects",
    faculty: "Faculty",
    timetable: "TimeTable",
  };

  useLayoutEffect(() => {
    Axios.get(`/api/manage/branchdetails`)
      .then(({ data }) => {
        setBranches(data.branchDetails);
      })
  }, [])

  // ANCHOR JSX  ||========================================================================
  return (
    <>
      <Title title="Manage DataBase" />
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
          <MenuItem value={"timetable"}>Time Table</MenuItem>
          <MenuItem value={"studentInfo"}>Student Database</MenuItem>
          <MenuItem value={"subjects"}>Subjects</MenuItem>
          <MenuItem value={"faculty"}>Faculty</MenuItem>
        </CustTextField>
        {((table === 'timetable' || table === 'studentInfo') &&
          (user?.branch === 'FME' || user?.branch === '')) && (
            <CustTextField
              select
              label="Branch"
              value={branch}
              onChange={({ target: { value } }) => {
                setBranch(value);
                setResponseData([]);
                setSelectedRows([]);
              }}
            >
              {branches.map((branchItem: string) => (
                <MenuItem key={branchItem} value={branchItem}>
                  {branchItem}
                </MenuItem>
              ))}
            </CustTextField>
          )}
      </div>

      {/* ANCHOR FORM ||======================================================================== */}
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 no-print items-center">
        <form
          className="row-start-2 grid sm:grid-cols-3 grid-cols-1 items-center gap-x-4 gap-y-2 sm:col-span-3 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            if (branches.length !== 0 && branch === '') {
              alert?.showAlert('Please select a branch', "warning");
            } else {
              loading?.showLoading(true);
              Axios.get(
                `api/manage/table?tableName=${table}&fbranch=${branch}`
              )
                .then(
                  ({
                    data: { tableData },
                  }: {
                    data: { tableData: ManageDBResponseArr };
                  }) => {
                    if (tableData.length === 0) {
                      setResponseData([]);
                      alert?.showAlert("No data found", "warning");
                    } else
                      setResponseData(
                        tableData.map((element, indx) => ({
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
            }
          }}
        >
          <button
            className="blue-button-filled flex items-center gap-2"
          >
            <SearchOutlined fontSize="small" />
            Search
          </button>
        </form>
      </div>

      {/* ANCHOR DATAGRID ||======================================================================== */}
      {responseData.length > 0 && (
        <div className={`bg-white p-4 rounded-sm mt-8 h-fit`}>
          <CustDataGrid
            columns={table === "timetable" ? timetabledatagridCols : table === "studentInfo" ? studentdatagridCols : table === "faculty" ? facultydatagridCols : subjectsdatagridCols}
            rows={responseData}
            disableRowSelectionOnClick
            checkboxSelection
            sx={{ height: 600 }}
            rowSelectionModel={selectedRows}
            onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
            slots={{
              toolbar: () => (
                <div className="flex items-center gap-2 justify-between p-4">
                  <div className="text-blue-500 lg:text-4xl text-2xl">
                    {tablesNames[table]}
                  </div>
                  <ManageRowDetails
                    responseData={responseData}
                    setResponseData={setResponseData}
                    type="add"
                    table={table}
                  />
                </div>
              ),
              footer: () => (
                <div className="flex flex-col p-4">
                  <GridFooter />
                  <MultiDeleteDialog
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
  responseData,
  setResponseData,
  table,
}: {
  row?: ManageDBResponseProps;
  type: "add" | "edit";
  responseData: ManageDBResponseArr;
  setResponseData: React.Dispatch<React.SetStateAction<ManageDBResponseArr>>;
  table: AvailableDbTables;
}) {
  // STATES && VARS  ||========================================================================
  const { user } = useAuth()!;
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);
  const [openRowDetailsDialog, setOpenRowDetailsDialog] = useState(false);
  const [neuroDetails, setNeuroDetails] = useState<ManageDBResponseProps>(
    row
      ? { ...row }
      : ({
        facID: "",
        subCode: "",
        sem: 1,
        sec: "",
        branch: "",
      })
  );
  const [subjectAlreadyExists, setSubjectAlreadyExists] = useState(false);

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
              ? `Add new record `
              : `Edit ${row?.sem} - ${row?.sec}`}
          </span>
        </DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loading?.showLoading(true);
            if (type === "add") {
              Axios.post(`api/manage/database`, {
                details: neuroDetails,
                tableName: "timetable",
              })
                .then(({ data }) => {
                  if (data.done) {
                    alert?.showAlert("New record created", "success");
                    setResponseData((prevVals) => {
                      const indx = prevVals.findIndex(
                        ({ facID }) => facID === row?.facID
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
                .catch(() => {
                  // console.log(e);
                  alert?.showAlert("There was an error while saving", "error");
                })
                .finally(() => loading?.showLoading(false));
            } else {
              Axios.patch(`api/manage/database`, {
                details: { ...neuroDetails, oldSubCode: row?.facID },
                tableName: table,
                username: user?.username
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
              {table === "timetable" && (
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
              )}
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 mt-6 items-center gap-6">
              {table === "timetable" && (
                <>
                  <CustTextField
                    label="Faculty ID"
                    value={neuroDetails?.sec}
                    onChange={({ }) => {

                      setNeuroDetails({
                        ...neuroDetails,
                        facID: ""
                      });
                    }}
                  >
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
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                    <MenuItem value="5">5</MenuItem>
                    <MenuItem value="6">6</MenuItem>
                    <MenuItem value="7">7</MenuItem>
                    <MenuItem value="8">8</MenuItem>
                  </CustTextField>
                  <CustTextField
                    label="Section"
                    value={neuroDetails?.sec}
                    onChange={({ }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        sec: ""
                      });
                    }}
                  >
                  </CustTextField>
                </>
              )}
              {table !== "studentInfo" && (
                <CustTextField
                  value={user?.branch}
                  label="Branch"
                  disabled
                />
              )}
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
}: {
  table: AvailableDbTables;
  row: ManageDBResponseProps;
  setResponseData: React.Dispatch<
    React.SetStateAction<ManageDBResponseProps[]>
  >;
  tablesNames: Record<AvailableDbTables, string>;
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
            Delete {row?.subCode}-{row?.subCode}?
          </span>
        </DialogTitle>
        <DialogContent>
          <div>
            This will permanatly delete this subject from{" "}
            <span className="font-bold">{tablesNames[table]}</span> for{" "}
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
                `api/manage/database?subCode=${JSON.stringify([
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
                .catch(() => {
                  // console.log(e);
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
  // rollNo,
  selectedRows,
  setSelectedRows,
}: {
  table: AvailableDbTables;
  setResponseData: React.Dispatch<
    React.SetStateAction<ManageDBResponseProps[]>
  >;
  responseData: ManageDBResponseProps[];
  // rollNo: string;
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
                `api/manage/database?subCode=${JSON.stringify(
                  selectedRowsSubCodes
                )}&tableName=${table}`
              )
                .then(({ data }) => {
                  if (data.deleted) {
                    alert?.showAlert("Record deleted", "success");
                    setResponseData((prevVals) =>
                      prevVals
                        .filter(({ sem }) => !selectedRows.includes(sem))
                        .map((row, indx) => ({ ...row, id: indx + 1 }))
                    );
                    setSelectedRows([]);
                  }
                })
                .catch(() => {
                  // console.log(e);
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

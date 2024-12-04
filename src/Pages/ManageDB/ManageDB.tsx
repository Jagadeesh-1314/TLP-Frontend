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
  TableVisibilityType,
} from "../../Types/responseTypes";
import { CustDialog } from "../../components/Custom/CustDialog";
import { useAuth } from "../../components/Auth/AuthProvider";
import Title from "../../components/Title";


export default function ManageDB() {
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);
  const { user } = useAuth()!;

  // ANCHOR STATES && VARS  ||========================================================================
  const [table, setTable] = useState<AvailableDbTables>("timetable");
  const [responseData, setResponseData] = useState<ManageDBResponseArr>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [branches, setBranches] = useState<string[]>([]);
  const [SelectedBranch, setSelectedBranch] = useState<string>("");
  const [showRollNos, setShowRollNos] = useState<Record<string, boolean>>({});
  const [tableVisibility, setTableVisibility] = useState<TableVisibilityType>({});

  const toggleTableVisibility = (semester: string, section: string) => {
    const key = `${semester}-${section}`;
    setTableVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleRollNos = (facIndex: number, subIndex: number) => {
    const key = `${facIndex}-${subIndex}`;
    setShowRollNos((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };


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
      field: "batch",
      headerName: "Batch",
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
            setResponseData={setResponseData}
            selectedBranch={SelectedBranch}
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
            setResponseData={setResponseData}
            selectedBranch={SelectedBranch}
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
            setResponseData={setResponseData}
            selectedBranch={SelectedBranch}
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
      field: "facName",
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
            setResponseData={setResponseData}
            selectedBranch={SelectedBranch}
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
    studentinfo: "Student Database",
    subjects: "Subjects",
    faculty: "Faculty",
    timetable: "TimeTable",
    electives: "Electives",
  };

  const electivesdatagridCols: GridColDef[] = [
    { field: "id", headerName: "S No.", minWidth: 80, editable: false },
    {
      field: "rollno",
      headerName: "Rollno",
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
            setResponseData={setResponseData}
            selectedBranch={SelectedBranch}
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

  if (user?.branch === 'FME' || user?.branch === '') {
    useLayoutEffect(() => {
      Axios.get(`/api/manage/branchdetails`)
        .then(({ data }) => {
          setBranches(data.branchDetails);
        })
    }, [])
  }

  // ANCHOR JSX  ||========================================================================
  return (
    <>
      <Title title="Manage DataBase" />
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 no-print items-center">
        {/* Table Selection */}
        <CustTextField
          select
          label="Table"
          value={table}
          onChange={({ target: { value } }) => {
            setTable(value as AvailableDbTables);
            setResponseData([]);
            setSelectedRows([]);
            setShowPreview(false);
          }}
        >
          <MenuItem value={"timetable"}>Time Table</MenuItem>
          <MenuItem value={"studentinfo"}>Student Database</MenuItem>
          <MenuItem value={"subjects"}>Subjects</MenuItem>
          <MenuItem value={"faculty"}>Faculty</MenuItem>
          {user?.branch !== 'FME' && (
            <MenuItem value={"electives"}>Electives</MenuItem>
          )}

        </CustTextField>

        {/* Branch Selection (conditional) */}
        {((table === 'timetable' || table === 'studentinfo') &&
          (user?.branch === 'FME' || user?.branch === '')) && (
            <CustTextField
              select
              label="Branch"
              value={SelectedBranch}
              onChange={({ target: { value } }) => {
                setSelectedBranch(value);
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

        {/* ANCHOR FORM ||======================================================================== */}
        <form
          className="sm:col-span-2 w-full flex items-center gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (branches.length !== 0 && SelectedBranch === '' && table !== 'subjects' && table !== 'faculty') {
              alert?.showAlert('Please select a branch', 'warning');
            } else {
              loading?.showLoading(true);
              Axios.get(`api/manage/table?tableName=${table}&fbranch=${SelectedBranch}`)
                .then(
                  ({
                    data: { tableData },
                  }: {
                    data: { tableData: ManageDBResponseArr };
                  }) => {
                    if (tableData.length === 0) {
                      setResponseData([]);
                      alert?.showAlert('No data found', 'warning');
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
                  alert?.showAlert("Couldn't connect to the server", 'error')
                )
                .finally(() => loading?.showLoading(false));
            }
          }}
        >
          {/* Search button */}
          <button className="blue-button-filled flex items-center gap-2">
            <SearchOutlined fontSize="small" />
            Search
          </button>
        </form>
      </div>

      {/* Preview Section */}
      {(table === 'electives' || table === 'timetable') && (
        <button
          className="blue-button-filled mt-4"
          disabled={responseData.length <= 0}
          onClick={() => {
            if (responseData.length <= 0) {
              alert?.showAlert("No data available to display. Click Search!", "info");
            } else {
              setShowPreview((prev) => !prev);
            }
          }}
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      )}

      {showPreview && table === "electives" && (
        Object.entries(
          responseData.reduce<Record<string, Record<string, ManageDBResponseProps[]>>>((acc, row) => {
            const facID = row.facID || "No Faculty";
            const subcode = row.subCode || "No Subject";

            if (!acc[facID]) acc[facID] = {};
            if (!acc[facID][subcode]) acc[facID][subcode] = [];

            acc[facID][subcode].push(row);
            return acc;
          }, {})
        ).map(([_facID, subcodes], facIndex) => (
          <div key={facIndex} className="mb-5 mt-5 ml-5 mr-5 rounded-xl border border-green-500 p-4">
            {Object.entries(subcodes).map(([_subcode, rows], subIndex) => {
              const totalCount = rows.length;
              return (
                <div key={subIndex} className="mb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h4 className="font-semibold text-lg mb-2 sm:mb-0">
                      Faculty: <span className="text-orange-700">{`${rows[0].facName || "No Faculty"}`}</span> -
                      Subject: <span className="text-purple-700">{`${rows[0].subName || "No Subject"}`}</span>
                    </h4>
                    <button
                      onClick={() => toggleRollNos(facIndex, subIndex)}
                      className="ml-0 mb-3 sm:ml-4 p-2 bg-blue-500 text-white rounded"
                    >
                      {showRollNos[`${facIndex}-${subIndex}`] ? "Hide Roll Numbers" : "Show Roll Numbers"}
                    </button>
                  </div>
                  <span className="ml-4 font-bold text-black-600">Total Count: {totalCount}</span>
                  {showRollNos[`${facIndex}-${subIndex}`] && (
                    <div className="overflow-x-auto mt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {rows.map((row, idx) => (
                          <div key={idx} className="p-4 border border-gray-300 rounded-lg text-center bg-orange-100">
                            {row.rollno || "N/A"}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))
      )}


      {showPreview && table === "timetable" && (
        Object.entries(
          responseData.reduce<Record<string, Record<string, ManageDBResponseProps[]>>>((acc, row) => {
            const semester = row.sem || "No Semester";
            const section = row.sec || "No Section";

            if (!acc[semester]) acc[semester] = {};
            if (!acc[semester][section]) acc[semester][section] = [];

            acc[semester][section].push(row);

            return acc;
          }, {})
        ).map(([semester, sections], semIndex) => (
          <div key={semIndex} className="mb-5 mt-5 ml-4 mr-4 rounded-xl border border-green-500 p-4 ">
            {Object.entries(sections).map(([section, rows], secIndex) => {
              const key = `${semester}-${section}`;

              return (
                <div key={secIndex} className="mb-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-orange-700 text-lg">Section: {`${semester} - ${section}`}</h4>
                    <button
                      onClick={() => toggleTableVisibility(semester, section)}
                      className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                    >
                      {tableVisibility[key] ? 'Hide Table' : 'Show Table'}
                    </button>
                  </div>

                  {tableVisibility[key] && (
                    <div className="w-full mt-2 bg-white border border-pink-500 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="p-2 border border-gray-300">S.No</th>
                              <th className="p-2 border border-gray-300">Subject Name</th>
                              <th className="p-2 border border-gray-300">Faculty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row, idx) => (
                              <tr key={idx}>
                                <td className="p-2 border border-gray-300">{idx + 1 || "N/A"}</td>
                                <td className="p-2 border border-gray-300">{row.subName || "N/A"}</td>
                                <td className="p-2 border border-gray-300">{row.facName || "N/A"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))
      )}

      {/* ANCHOR DATAGRID ||======================================================================== */}
      {responseData.length > 0 && (
        <div className={`bg-white p-4 rounded-sm mt-8 h-fit`}>
          <CustDataGrid
            columns={table === "timetable" ? timetabledatagridCols : table === "studentinfo" ? studentdatagridCols : table === "faculty" ? facultydatagridCols : table === "electives" ? electivesdatagridCols : subjectsdatagridCols}
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
                    setResponseData={setResponseData}
                    type="add"
                    table={table}
                    selectedBranch={SelectedBranch}
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
  setResponseData,
  selectedBranch,
  table,
}: {
  row?: ManageDBResponseProps;
  type: "add" | "edit";
  setResponseData: React.Dispatch<React.SetStateAction<ManageDBResponseArr>>;
  selectedBranch: string;
  table: AvailableDbTables;
}) {
  // STATES && VARS  ||========================================================================
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);
  const { user } = useAuth()!;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, index) => currentYear - index);
  const [openRowDetailsDialog, setOpenRowDetailsDialog] = useState(false);
  const [neuroDetails, setNeuroDetails] = useState<ManageDBResponseProps>(
    row
      ? { ...row }
      : ({
        facID: "",
        facName: "",
        qtype: "",
        subCode: "",
        def: "",
        subName: "",
        rollno: "",
        Name: "",
        sem: "",
        sec: "",
        branch: "",
        batch: "",
      })
  );

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

            const payload: ManageDBResponseProps = (() => {
              if (table === "timetable") {
                return {
                  facID: neuroDetails.facID,
                  subCode: neuroDetails.subCode,
                  sem: neuroDetails.sem,
                  sec: neuroDetails.sec,
                  branch: user?.branch === "FME" ? selectedBranch : user?.branch,
                };
              } else if (table === "subjects") {
                return {
                  subCode: neuroDetails.subCode,
                  subName: neuroDetails.subName,
                  qtype: neuroDetails.qtype,
                  def: neuroDetails.def,
                };
              } else if (table === "studentinfo") {
                return {
                  rollno: neuroDetails.rollno,
                  Name: neuroDetails.Name,
                  sec: neuroDetails.sec,
                  sem: neuroDetails.sem,
                  branch: neuroDetails.branch,
                  batch: neuroDetails.batch,
                };
              } else if (table === "electives") {
                return {
                  rollno: neuroDetails.rollno,
                  facID: neuroDetails.facID,
                  subCode: neuroDetails.subCode,
                };
              } else if (table === "faculty") {
                return {
                  facID: neuroDetails.facID,
                  facName: neuroDetails.facName,
                };
              }
              return {};
            })();


            if (type === "add") {
              Axios.post(`api/manage/database`, {
                details: payload,
                tableName: table,
              })
                .then(({ data }) => {
                  if (data.done) {
                    alert?.showAlert("New record created", "success");
                    setResponseData((prevVals) => [...prevVals, { ...payload, id: prevVals.length + 1 }]);
                    setOpenRowDetailsDialog(false);
                  } else {
                    alert?.showAlert(data.error.message, "error");
                    console.log(data)
                  }
                })
                .catch((err) => {
                  console.error(err);
                  alert?.showAlert(err.response.data.message, "error");
                })
                .finally(() => {
                  loading?.showLoading(false);
                });
            } else {
              Axios.patch(`api/manage/database`, {
                details: { ...payload },
                tableName: table,
              })
                .then(({ data }) => {
                  if (data.updated) {
                    alert?.showAlert("Record updated", "success");
                    setOpenRowDetailsDialog(false);
                    setResponseData((prevVals) => {
                      let indx: number = -1;

                      if (table === 'timetable') {
                        indx = prevVals.findIndex(({ subCode }) => subCode === row?.subCode);
                      } else if (table === 'subjects') {
                        indx = prevVals.findIndex(({ subCode }) => subCode === row?.subCode);
                      } else if (table === 'studentinfo') {
                        indx = prevVals.findIndex(({ rollno }) => rollno === row?.rollno);
                      } else if (table === 'electives') {
                        indx = prevVals.findIndex(({ rollno, subCode }) => rollno === row?.rollno && subCode === row?.subCode);
                      } else if (table === 'faculty') {
                        indx = prevVals.findIndex(({ facID }) => facID === row?.facID);
                      }

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
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
              {/* For 'Time Table' table */}
              {table === "timetable" && (
                <>
                  <CustTextField
                    label="Faculty ID"
                    value={neuroDetails.facID ?? ""}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        facID: value.toUpperCase(),
                      });
                    }}
                  />
                  <CustTextField
                    label="Subject Code"
                    value={neuroDetails.subCode ?? ""}
                    disabled={type !== "add"}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        subCode: value.toUpperCase(),
                      });
                    }}
                  // onBlur={({ target: { value } }) => {
                  //   value = value.trim();
                  //   const subCodeSplitted = value.split("");
                  //   setNeuroDetails((prevVals) => ({
                  //     ...prevVals,
                  //     acYear: parseInt(subCodeSplitted[4] ?? "1") as 1 |
                  //       2 |
                  //       3 |
                  //       4,
                  //     sem: parseInt(subCodeSplitted[5] ?? "1") as 1 | 2,
                  //   }));

                  // if (value.length > 0) {
                  //   Axios.get(`api/manage/database/sub-name/${value}`)
                  //     .then(({ data }) => {
                  //       if (!data.error)
                  //         setNeuroDetails((prevVals) => ({
                  //           ...prevVals,
                  //           subName: data.subName,
                  //         }));
                  //     })
                  //     .catch((e) => {
                  //       alert?.showAlert(e.response.data.error, "error");
                  //     });
                  // }

                  // }} 
                  />
                  <CustTextField
                    label="Semester"
                    value={neuroDetails.sem ?? ""}
                    disabled={type !== "add"}
                    onChange={({ target: { value } }) => {
                      const singleDigitPattern = /^[1-8]?$/;
                      if (singleDigitPattern.test(value)) {
                        setNeuroDetails({
                          ...neuroDetails,
                          sem: value,
                        });
                      }
                    }}
                  />
                  {/* <CustTextField
                    label="Batch"
                    value={neuroDetails.batch ?? ""}
                    select
                    disabled={type !== "add"}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        batch: value,
                      });
                    }}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </CustTextField> */}
                  <CustTextField
                    label="Section"
                    value={neuroDetails?.sec}
                    disabled={type !== "add"}
                    onChange={({ target: { value } }) => {
                      if (value.length <= 1 && /^[A-Za-z]*$/.test(value)) {
                        setNeuroDetails({
                          ...neuroDetails,
                          sec: value.toUpperCase(),
                        });
                      }
                    }}
                  />
                  <CustTextField
                    label="Branch"
                    value={user?.branch === "FME" ? selectedBranch : user?.branch}
                    disabled
                  />
                </>
              )}


              {/* For 'subjects' table */}
              {table === "subjects" && (
                <>
                  <CustTextField
                    label="Subject Code"
                    value={neuroDetails.subCode ?? ""}
                    disabled={type !== "add"}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        subCode: value.toUpperCase(),
                      });
                    }}
                  />
                  <CustTextField
                    label="Subject Name"
                    value={neuroDetails.subName ?? ""}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        subName: value,
                      });
                    }}
                  />
                  <CustTextField
                    label="Subject Type"
                    value={neuroDetails.qtype ?? ""}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        qtype: value,
                      });
                    }}
                    select
                  >
                    <MenuItem value="theory">Theory</MenuItem>
                    <MenuItem value="lab">Lab</MenuItem>
                  </CustTextField>
                  <CustTextField
                    label="R (Core) / E (Elective)"
                    value={neuroDetails.def ?? ""}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        def: value,
                      });
                    }}
                    select
                  >
                    <MenuItem value="r">R - Core</MenuItem>
                    <MenuItem value="e">E - Elective</MenuItem>
                  </CustTextField>
                </>
              )}

              {/* For 'studentinfo' table */}
              {table === "studentinfo" && (
                <>
                  <CustTextField
                    label="Roll Number"
                    value={neuroDetails.rollno ?? ""}
                    disabled={type !== "add"}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        rollno: value.toUpperCase(),
                      });
                    }}
                  />
                  <CustTextField
                    label="Name"
                    value={neuroDetails.Name ?? ""}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        Name: value,
                      });
                    }}
                  />
                  <CustTextField
                    label="Section"
                    value={neuroDetails?.sec}
                    disabled={type !== "add"}
                    onChange={({ target: { value } }) => {
                      if (value.length <= 1 && /^[A-Za-z]*$/.test(value)) {
                        setNeuroDetails({
                          ...neuroDetails,
                          sec: value.toUpperCase(),
                        });
                      }
                    }}
                  />
                  <CustTextField
                    label="Semester"
                    value={neuroDetails.sem ?? ""}
                    onChange={({ target: { value } }) => {
                      const singleDigitPattern = /^[1-8]?$/;
                      if (singleDigitPattern.test(value)) {
                        setNeuroDetails({
                          ...neuroDetails,
                          sem: value,
                        });
                      }
                    }}
                  />
                  <CustTextField
                    label="Batch"
                    value={neuroDetails.batch ?? ""}
                    select
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        batch: value,
                      });
                    }}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </CustTextField>
                  <CustTextField
                    label="Branch"
                    value={neuroDetails?.branch}
                    disabled={type !== "add"}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        branch: value.toUpperCase(),
                      });
                    }}
                  />
                </>
              )}

              {/* For 'electives' table */}
              {table === "electives" && (
                <>
                  <CustTextField
                    label="Faculty ID"
                    value={neuroDetails.facID ?? ""}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        facID: value.toUpperCase(),
                      });
                    }}
                  />
                  <CustTextField
                    label="Roll Number"
                    value={neuroDetails.rollno ?? ""}
                    disabled={type !== "add"}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        rollno: value.toUpperCase(),
                      });
                    }}
                  />
                  <CustTextField
                    label="Subject Code"
                    value={neuroDetails.subCode ?? ""}
                    disabled={type !== "add"}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        subCode: value.toUpperCase(),
                      });
                    }}
                  />
                </>
              )}

              {/* For 'faculty' table */}
              {table === "faculty" && (
                <>
                  <CustTextField
                    label="Faculty ID"
                    value={neuroDetails.facID ?? ""}
                    disabled={type !== "add"}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        facID: value.toUpperCase(),
                      });
                    }}
                  />
                  <CustTextField
                    label="Faculty Name"
                    value={neuroDetails.facName ?? ""}
                    onChange={({ target: { value } }) => {
                      setNeuroDetails({
                        ...neuroDetails,
                        facName: value,
                      });
                    }}
                  />
                </>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <button
              className="red-button"
              onClick={() => {
                setOpenRowDetailsDialog(false);
                type !== "add" ? setNeuroDetails(row as ManageDBResponseProps) : "";
              }}
              type="button"
            >
              Cancel
            </button>
            <button
              className="blue-button"
              // disabled={
              //   subjectAlreadyExists
              // }
              type="submit"
            >
              Save
            </button>
          </DialogActions>
        </form>
      </CustDialog>

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

  const handleDelete = () => {
    loading?.showLoading(true);
    setOpenDeleteConfirmDialog(false);

    let deleteUrl = "";
    let keyField: Partial<ManageDBResponseProps> = {};

    if (table === "timetable") {
      deleteUrl = `api/manage/database?facID=${row.facID}&subCode=${row.subCode}&sem=${row.sem}&sec=${row.sec}&branch=${row.branch}&batch=${row.batch}&tableName=${table}`;
      keyField = {
        subCode: row.subCode,
        facID: row.facID,
        sec: row.sec,
        sem: row.sem,
      };
    } else if (table === "subjects") {
      deleteUrl = `api/manage/database?subCode=${row.subCode}&tableName=${table}`;
      keyField = { subCode: row.subCode };
    } else if (table === "studentinfo") {
      deleteUrl = `api/manage/database?rollno=${row.rollno}&tableName=${table}`;
      keyField = { rollno: row.rollno };
    } else if (table === "electives") {
      deleteUrl = `api/manage/database?rollno=${row.rollno}&subCode=${row.subCode}&tableName=${table}`;
      keyField = { rollno: row.rollno, subCode: row.subCode };
    } else if (table === "faculty") {
      deleteUrl = `api/manage/database?facID=${row.facID}&tableName=${table}`;
      keyField = { facID: row.facID };
    }

    Axios.delete(deleteUrl)
      .then(({ data }) => {
        if (data.deleted) {
          setResponseData((prevVals) =>
            prevVals
              .filter((item) => {
                if (table === "timetable") {
                  return !(
                    item.subCode === row.subCode &&
                    item.facID === row.facID &&
                    item.sec === row.sec &&
                    item.sem === row.sem
                  );
                }
                if (table === "electives") {
                  return !(
                    item.rollno === row.rollno &&
                    item.subCode === row.subCode
                  );
                }
                return Object.keys(keyField).every(
                  (key) => item[key as keyof ManageDBResponseProps] !== keyField[key as keyof ManageDBResponseProps]
                );
              })
              .map((details, indx) => ({ ...details, id: indx + 1 }))
          );
          alert?.showAlert("Record deleted", "success");
        }
      })
      .catch((e) => {
        alert?.showAlert("There was an error while deleting.", "error");
        console.log(e)
      })
      .finally(() => loading?.showLoading(false));
  };

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
            Delete {row?.subCode || row?.rollno || row?.facID}?
          </span>
        </DialogTitle>
        <DialogContent>
          <div>
            This will permanently delete this entry from
            <span className="font-bold"> {tablesNames[table]}</span> {row?.subCode || row?.rollno || row?.facID}?
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="red-button"
            onClick={() => setOpenDeleteConfirmDialog(false)}
          >
            Cancel
          </button>
          <button className="blue-button" onClick={handleDelete}>
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
  selectedRows,
  setSelectedRows,
}: {
  table: AvailableDbTables;
  setResponseData: React.Dispatch<React.SetStateAction<ManageDBResponseProps[]>>;
  responseData: ManageDBResponseProps[];
  selectedRows: GridRowSelectionModel;
  setSelectedRows: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
}) {
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const selectedRowKeys: { [key: string]: string[] } = {
    subCodes: [],
    facIDs: [],
    rollnos: [],
  };

  const getKeyFields = () => {
    switch (table) {
      case 'subjects':
        return { subCodes: 'subCode' };
      case 'faculty':
        return { facIDs: 'facID' };
      case 'studentinfo':
        return { rollnos: 'rollno' };
      case 'timetable':
        return {
          subCodes: 'subCode',
          facIDs: 'facID',
          sem: 'sem',
          sec: 'sec',
          branch: 'branch',
          batch: 'batch',
        };
      case 'electives':
        return { rollnos: 'rollno', subCodes: 'subCode' };
      default:
        return { id: 'id' };
    }
  };

  const keyFields = getKeyFields();

  selectedRows.forEach((rowId) => {
    const rowData = responseData[(rowId as number) - 1];
    if (rowData) {
      Object.entries(keyFields).forEach(([key, field]) => {
        if (rowData[field as keyof ManageDBResponseProps]) {
          if (!selectedRowKeys[key]) {
            selectedRowKeys[key] = [];
          }
          selectedRowKeys[key].push(rowData[field as keyof ManageDBResponseProps] as string);
        }
      });
    }
  });

  return (
    <>
      <button
        className="red-button-outline ml-auto"
        disabled={selectedRows.length === 0}
        onClick={() => {
          if (table.substring(0, 5) !== 'print') {
            setOpenDeleteDialog(true);
          } else {
            if (selectedRows.length === responseData.length) {
              setOpenDeleteDialog(true);
            } else {
              alert?.showAlert('Select all records to delete', 'warning');
            }
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
        <DialogTitle component={'div'}>
          <span className="text-4xl text-red-600 font-semibold">
            Delete multiple records
          </span>
        </DialogTitle>
        <DialogContent>
          <div className="font-semibold">
            All the following records will be deleted permanently.
          </div>
          <div className="mt-4">
            SubCodes: {selectedRowKeys.subCodes.join(', ')}<br />
            FacIDs: {selectedRowKeys.facIDs.join(', ')}<br />
            Rollnos: {selectedRowKeys.rollnos.join(', ')}
          </div>
        </DialogContent>
        <DialogActions>
          <button className="red-button" onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </button>
          <button
            className="blue-button"
            onClick={() => {
              loading?.showLoading(true);
              Axios.delete(
                `api/manage/database?subCodes=${selectedRowKeys.subCodes
                }&facIDs=${selectedRowKeys.facIDs}&rollnos=${selectedRowKeys.rollnos
                }&tableName=${table}`
              )
                .then(({ data }) => {
                  if (data.deleted) {
                    alert?.showAlert('Records deleted', 'success');
                    setResponseData((prevVals) =>
                      prevVals.filter((row) =>
                        !selectedRowKeys.subCodes.includes(row.subCode as string) &&
                        !selectedRowKeys.facIDs.includes(row.facID as string) &&
                        !selectedRowKeys.rollnos.includes(row.rollno as string)
                      )
                    );
                    setSelectedRows([]);
                  }
                })
                .catch(() => {
                  alert?.showAlert('There was an error while deleting', 'error');
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


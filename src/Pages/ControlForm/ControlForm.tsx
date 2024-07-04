import { MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { AlertContext } from "../../components/Context/AlertDetails";
import { useContext, useState } from "react";
import { CustTextField } from "../../components/Custom/CustTextField";
import { SearchOutlined } from "@mui/icons-material";
import { LoadingContext } from "../../components/Context/Loading";
import Axios from "axios";

export default function ControlForm() {
    const alert = useContext(AlertContext);
    const [table, setTable] = useState("timetable");
    const [data, setData] = useState<any[]>([]);
    const loading = useContext(LoadingContext);

    const handleSearch = () => {
        loading?.showLoading(true);
        Axios.get(`api/manage/table?tableName=${table}`)
            .then(({ data }) => {
                setData(data); // Update state with fetched data
            })
            .catch(() =>
                alert?.showAlert("Couldn't connect to the server", "error")
            )
            .finally(() => loading?.showLoading(false));
    };

    return (
        <>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-x-4 gap-y-4 no-print">
                <CustTextField
                    select
                    label="Type"
                    value={table}
                    onChange={({ target: { value } }) => {
                        setTable(value);
                    }}
                >
                    <MenuItem value="timetable" className="p-2">Time-Table</MenuItem>
                    <MenuItem value="studentinfo" className="p-2">StudentsInfo</MenuItem>
                    <MenuItem value="faculty" className="p-2">Faculty</MenuItem>
                    <MenuItem value="subjects" className="p-2">Subjects</MenuItem>
                </CustTextField>
            </div>
            <div className="grid pt-4 lg:grid-cols-6 md:grid-cols-2 grid-cols-2 gap-4 ">
                <div className="col-span-3 row-start-1 flex gap-4 items-center">
                    <button
                        className="blue-button-filled flex items-center gap-2 sm:ml-0 ml-auto"
                        onClick={handleSearch}
                    >
                        <SearchOutlined fontSize="small" />
                        Search
                    </button>
                </div>
                {data.length > 0 && (
                    <div className={`bg-white p-4 rounded-sm mt-8 h-fit`}>
                        <div className="flex mb-4 items-center justify-between lg:text-6xl text-4xl font-semibold text-blue-500">
                            <span className=""></span>
                            {table === "timetable" && (
                                <span>
                                    {/* <span className="text-red-500">
                                    {data.filter(({ grade }) => grade === "F").length}
                                </span> */}

                                    <span className="lg:text-4xl text-2xl font-normal">
                                        /{data.length}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

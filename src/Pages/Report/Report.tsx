import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { useContext, useState } from "react";
import "./Report.css";
import { FilterList } from "@mui/icons-material";
import { LoadingContext } from "../../components/Context/Loading";

interface Report {
    facName: string;
    subcode: string;
    subname: string;
    sec: string;
    sem: number;
    percentile: number;
}

interface ApiResponse {
    sec: { sec: string; sem: number }[];
    done: boolean;
    report: Report[];
}

export default function Report() {
    const alert = useContext(AlertContext);
    const loading = useContext(LoadingContext);
    const [report, setReport] = useState<Report[]>([]);
    const [sems, setSems] = useState<number[]>([]);
    const [secs, setSecs] = useState<string[]>([]);
    const [selectedSem, setSelectedSem] = useState<number | null>(null);
    const [selectedSec, setSelectedSec] = useState<string>("");
    const [show, setShow] = useState<boolean>(true);
    const [showReport, setShowReport] = useState<boolean>(false);
    const [filterLowPercentile, setFilterLowPercentile] = useState<boolean>(false);

    async function handleClick() {
        try {
            const response = await Axios.get<ApiResponse>(`api/report`);
            const data = response.data;
            console.log(data);
            if (data.done && Array.isArray(data.report)) {
                const sortedReport = data.report.sort((a, b) => a.sec.localeCompare(b.sec));
                setReport(sortedReport);

                const uniqueSems = [...new Set(data.sec.map((item) => item.sem))];
                const sortedSems = uniqueSems.sort((a, b) => a - b);
                setSems(sortedSems);

                const uniqueSecs = [...new Set(data.sec.map((item) => item.sec))];
                const sortedSecs = uniqueSecs.sort((a, b) => a.localeCompare(b));
                setSecs(sortedSecs);

                setSelectedSem(null);
                setSelectedSec("");
                setShow(false);
                alert?.showAlert("Report generated successfully", "success");
            } else {
                alert?.showAlert("Score is empty", "warning");
            }
        } catch (err) {
            console.error("Error fetching report:", err);
            alert?.showAlert("Error fetching report", "error");
        }
    }

    function handleSemClick(sem: number) {
        setSelectedSem(sem);
        const filteredReport = report.filter(item => item.sem === sem);
        const uniqueSecs = [...new Set(filteredReport.map(item => item.sec))];
        setSecs(uniqueSecs);
        setSelectedSec("");
        setShowReport(true);
        setFilterLowPercentile(false);
    }

    function handleSecClick(sec: string) {
        setSelectedSec(sec);
    }
    const handleDownload = async () => {
        loading?.showLoading(true, "Downloading file...");

        try {
            const response = await Axios.get(
                `/api/download/downloadReport?sem=${selectedSem}&sec=${selectedSec}`,
                { responseType: "blob" }
            );

            if (response.data) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;

                const contentDisposition = response.headers["content-disposition"];
                let fileName = "downloaded_file.docx";
                if (contentDisposition) {
                    const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                    if (fileNameMatch.length > 1) {
                        fileName = fileNameMatch[1];
                    }
                }

                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);

                alert?.showAlert("File downloaded successfully", "success");
            } else {
                alert?.showAlert("No data found", "warning");
            }
        } catch (error) {
            alert?.showAlert("Error while downloading file", "error");
        } finally {
            loading?.showLoading(false);
        }
    };


    return (
        <>
            {show ? (
                <div className="center-button">
                    <button
                        type="button"
                        className="green-button-filled col-span-1 flex items-center gap-2"
                        onClick={handleClick}
                    >
                        Generate Report
                    </button>
                </div>
            ) : (
                <>
                    <div className="filter-buttons">
                        {sems.map((sem, index) => (
                            <button
                                key={index}
                                className={`filter-button ${selectedSem === sem ? 'selected' : ''}`}
                                onClick={() => handleSemClick(sem)}
                            >
                                Semester {sem}
                            </button>
                        ))}
                    </div>
                    {selectedSem !== null && (
                        <div className="filter-buttons">
                            <button
                                className={`filter-button ${selectedSec === "" ? 'selected' : ''}`}
                                onClick={() => handleSecClick("")}
                            >
                                ALL Sections
                            </button>
                            {secs.map((sec, index) => (
                                <button
                                    key={index}
                                    className={`filter-button ${selectedSec === sec ? 'selected' : ''}`}
                                    onClick={() => handleSecClick(sec)}
                                >
                                    Section {sec}
                                </button>
                            ))}
                            <button
                                className={`filter-button ${filterLowPercentile ? 'selected' : ''}`}
                                onClick={() => setFilterLowPercentile(!filterLowPercentile)}
                            >
                                <FilterList /> &lt;= 70
                            </button>
                        </div>
                    )}
                    {showReport && (
                        <>
                            <div className="report-container">
                                {report
                                    .filter(item => (selectedSem === null || item.sem === selectedSem) && (selectedSec === "" || item.sec === selectedSec) && (!filterLowPercentile || item.percentile <= 70))
                                    .map((item, index) => (
                                        <div key={index} className={`report-item ${item.percentile <= 70 ? 'low-percentile-item' : ''}`}>
                                            <p><strong>Faculty Name:</strong> {item.facName}</p>
                                            <p><strong>Subject Code:</strong> {item.subcode}</p>
                                            <p><strong>Subject Name:</strong> {item.subname}</p>
                                            <p><strong>Section:</strong> {item.sec}</p>
                                            <p><strong>Semester:</strong> {item.sem}</p>
                                            <p><strong>Percentile:</strong> {item.percentile}</p>
                                        </div>
                                    ))}
                            </div>
                            <div className="download-button-container">
                                <button className="download-button" onClick={handleDownload}>
                                    Download
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
}

import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { useContext, useState } from "react";
import "./Report.css";
import { FilterList } from "@mui/icons-material";

interface Report {
    facName: string;
    subcode: string;
    subname: string;
    sec: string;
    percentile: number;
}

interface ApiResponse {
    done: boolean;
    report: Report[];
}

export default function Report() {
    const alert = useContext(AlertContext);
    const [report, setReport] = useState<Report[]>([]);
    const [secs, setSecs] = useState<string[]>([]);
    const [selectedSec, setSelectedSec] = useState<string>("");
    const [show, setShow] = useState<boolean>(true);
    const [filterLowPercentile, setFilterLowPercentile] = useState<boolean>(false);

    async function handleClick() {
        try {
            const response = await Axios.get<ApiResponse>(`api/report`);
            const data = response.data;
            if (data.done && Array.isArray(data.report)) {
                const sortedReport = data.report.sort((a, b) => a.sec.localeCompare(b.sec));
                setReport(sortedReport);
                const uniqueSecs = [...new Set(sortedReport.map(item => item.sec))];
                setSecs(uniqueSecs);
                setSelectedSec("");
                setShow(!show);
                alert?.showAlert("done", "success");
            } else {
                alert?.showAlert("Score is Empty", "warning");
            }
        } catch (err) {
            console.error("Error fetching report:", err);
            alert?.showAlert("Error fetching report", "error");
        }
    }

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
                    <div className="section-buttons">
                        <button
                            className={`section-button ${selectedSec === "" ? 'selected' : ''}`}
                            onClick={() => setSelectedSec("")}
                        >
                            ALL Sections
                        </button>
                        {secs.map((sec, index) => (
                            <button
                                key={index}
                                className={`section-button ${selectedSec === sec ? 'selected' : ''}`}
                                onClick={() => setSelectedSec(sec)}
                            >
                                Section {sec}
                            </button>
                        ))}
                        <button
                            className={`section-button ${filterLowPercentile ? 'selected' : ''}`}
                            onClick={() => setFilterLowPercentile(!filterLowPercentile)}
                        >
                            <FilterList /> &lt;= 70
                        </button>
                    </div>
                    <div className="report-container">
                        {report
                            .filter(item => (selectedSec === "" || item.sec === selectedSec) && (!filterLowPercentile || item.percentile <= 70))
                            .map((item, index) => (
                                <div key={index} className={`report-item ${item.percentile <= 70 ? 'low-percentile-item' : ''}`}>
                                    <p><strong>Faculty Name:</strong> {item.facName}</p>
                                    <p><strong>Subject Code:</strong> {item.subcode}</p>
                                    <p><strong>Subject Name:</strong> {item.subname}</p>
                                    <p><strong>Section:</strong> {item.sec}</p>
                                    <p><strong>Percentile:</strong> {item.percentile}</p>
                                </div>
                            ))}
                    </div>
                </>
            )}
        </>
    );
}

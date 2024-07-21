import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { useContext, useState } from "react";
import "./CFReport.css";
import { LoadingContext } from "../../components/Context/Loading";

interface CFReportResponse {
    details: { batch: number, branch: string }[];
    done: boolean;
}

interface CFReportItem {
    branch: string;
    batch: number;
    percentile: number;
}

export default function CFReport() {
    const alert = useContext(AlertContext);
    const loading = useContext(LoadingContext);
    const [batches, setBatches] = useState<number[]>([]);
    const [branches, setBranches] = useState<string[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<string>("");
    const [show, setShow] = useState<boolean>(true);
    const [term, setTerm] = useState<number>(0);
    const [report, setReport] = useState<CFReportItem[]>([]);
    const [showReport, setShowReport] = useState<boolean>(false);

    async function generateReport1() {
        try {
            const response = await Axios.get<CFReportResponse>(`api/cfreport1`);
            const data = response.data;
            if (data.done) {
                setTerm(1);
                const uniqueBatches = [...new Set(data.details.map(item => item.batch))];
                setBatches(uniqueBatches);
                setShow(false);
                alert?.showAlert("CF - Report-1 generated successfully", "success");
            } else {
                alert?.showAlert("CF - Report-1 is empty", "warning");
            }
        } catch (err) {
            console.error("Error fetching report:", err);
            alert?.showAlert("Error fetching report", "error");
        }
    }

    async function generateReport2() {
        try {
            const response = await Axios.get<CFReportResponse>(`api/cfreport2`);
            const data = response.data;
            if (data.done) {
                setTerm(2);
                const uniqueBatches = [...new Set(data.details.map(item => item.batch))];
                setBatches(uniqueBatches);
                const uniqueBranches = [...new Set(data.details.map(item => item.branch))];
                setBranches(uniqueBranches);
                setShow(false);
                alert?.showAlert("CF - Report-2 generated successfully", "success");
            } else {
                alert?.showAlert("CF - Report-2 is empty", "warning");
            }
        } catch (err) {
            console.error("Error fetching report:", err);
            alert?.showAlert("Error fetching report", "error");
        }
    }

    function handleBatchClick(batch: number) {
        setSelectedBatch(batch);
        setSelectedBranch("");
        setShowReport(false);
    }

    async function handleBranchClick(branch: string) {
        setSelectedBranch(branch);
        if (selectedBatch !== null) {
            try {
                const response = await Axios.get<{ cfreport2: CFReportItem[] }>(`api/fetchcfreport${term}?batch=${selectedBatch}&branch=${branch}`);
                const data = response.data;
                if (Array.isArray(data.cfreport2)) {
                    setReport(data.cfreport2);
                    setShowReport(true);
                } else {
                    console.error("Data format is incorrect. Expected an array for 'cfreport2'.");
                    setReport([]);
                }
            } catch (error) {
                console.error("Error fetching details:", error);
                setReport([]);
            }
        } else {
            console.error("Batch is not selected");
        }
    }

    const handleDownload = async () => {
        loading?.showLoading(true, "Downloading file...");

        try {
            const response = await Axios.get(
                `/api/download/downloadReport`, {
                params: {
                    branch: selectedBranch,
                    batch: selectedBatch,
                    count: term,
                },
                responseType: "blob"
            });

            if (response.data) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;

                const contentDisposition = response.headers["content-disposition"];
                let fileName = "downloaded_file.docx";
                if (contentDisposition) {
                    const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                    if (fileNameMatch && fileNameMatch.length > 1) {
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
                        onClick={generateReport1}
                    >
                        Generate CF Report 1
                    </button>
                    <button
                        type="button"
                        className="green-button-filled col-span-1 flex items-center gap-2"
                        onClick={generateReport2}
                    >
                        Generate CF Report 2
                    </button>
                </div>
            ) : (
                <>
                    <div className="filter-buttons">
                        {batches.map((batch, index) => (
                            <button
                                key={index}
                                className={`filter-button ${selectedBatch === batch ? 'selected' : ''}`}
                                onClick={() => handleBatchClick(batch)}
                            >
                                Batch {batch}
                            </button>
                        ))}
                    </div>
                    {selectedBatch !== null && (
                        <div className="filter-buttons">
                            {branches.map((branch, index) => (
                                <button
                                    key={index}
                                    className={`filter-button ${selectedBranch === branch ? 'selected' : ''}`}
                                    onClick={() => handleBranchClick(branch)}
                                >
                                    Branch {branch}
                                </button>
                            ))}
                        </div>
                    )}
                    {showReport && (
                        <>
                            <div className="report-container">
                                {report.length > 0 ? (
                                    report.map((item, index) => (
                                        <div key={`${item.batch}-${item.branch}-${index}`} className="report-item">
                                            <p><strong>Branch:</strong> {item.branch}</p>
                                            <p><strong>Batch:</strong> {item.batch}</p>
                                            <p><strong>Percentile:</strong> {item.percentile}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-report-message">
                                        No report available for the selected criteria.
                                    </div>
                                )}
                            </div>
                            {report.length > 0 && (
                                <div className="download-button-container">
                                    <button className="download-button" onClick={handleDownload}>
                                        Download
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
}

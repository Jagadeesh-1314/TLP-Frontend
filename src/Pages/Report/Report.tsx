import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { useContext, useLayoutEffect, useState } from "react";
import "./Report.css";
import { FilterList } from "@mui/icons-material";
import { LoadingContext } from "../../components/Context/Loading";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend } from "chart.js";
import { Bar } from 'react-chartjs-2';
import Title from "../../components/Title";
import { useLocation } from "react-router-dom";
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

interface Report {
    facName: string;
    subcode: string;
    facID: string;
    subname: string;
    sec: string;
    sem: number;
    percentile: number;
    batch: number;
}

interface ReportResponse {
    details: { sem: number, batch: number, sec: string }[];
    done: boolean;
}

interface CountdoneStundents {
    done: boolean;
    donestds: number;
    donetotstds: number;
}

interface ReportQuestion {
    question: string;
    branch: string;
    sem: number;
    count: number;
    total: number;
    adjusted_total: number;
}

export default function Report() {
    const alert = useContext(AlertContext);
    const loading = useContext(LoadingContext);
    const location = useLocation();

    const [report, setReport] = useState<Report[]>(location.state?.report || []);
    const [sems, setSems] = useState<number[]>([]);
    const [secs, setSecs] = useState<string[]>([]);
    const [batches, setBatches] = useState<number[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
    const [selectedSem, setSelectedSem] = useState<number | null>(null);
    const [selectedSec, setSelectedSec] = useState<string>("");
    const [show, setShow] = useState<boolean>(true);
    const [term, setTerm] = useState<number>(0);
    const [showReport, setShowReport] = useState<boolean>(false);
    const [filterLowPercentile, setFilterLowPercentile] = useState<boolean>(false);
    const [filterClicked, setFilterClicked] = useState<boolean>(false);
    const [donestudents, setDoneStudents] = useState<number>(0);
    const [donetotstudents, setDoneTotStudents] = useState<number>(0);
    const [selectedItem, setSelectedItem] = useState<Report | null>(null);
    const [questions, setQuestions] = useState<ReportQuestion[]>([]);
    const [showQuestions, setShowQuestions] = useState<boolean>(false);

    useLayoutEffect(() => {
        const savedScrollPosition = location.state?.scrollPosition || 0;
        window.scrollTo(0, savedScrollPosition);
    }, [location.state?.scrollPosition]);


    async function generateReport1() {
        loading?.showLoading(true, "Generating Report 1...");
        try {
            const response = await Axios.get<ReportResponse>(`api/report1`);
            const data = response.data;
            if (data.done) {
                setTerm(1);
                const uniqueBatches = [...new Set(data.details.map(item => item.batch))];
                const sortedBatches = uniqueBatches.sort((a, b) => a - b);
                setBatches(sortedBatches);
                const uniqueSems = [...new Set(data.details.map(item => item.sem))];
                const sortedSems = uniqueSems.sort((a, b) => a - b);
                setSems(sortedSems);
                const uniqueSecs = [...new Set(data.details.map(item => item.sec))];
                const sortedSecs = uniqueSecs.sort((a, b) => a.localeCompare(b));
                setSecs(sortedSecs);
                setShow(false);
                alert?.showAlert("Report-1 generated successfully", "success");
            } else {
                alert?.showAlert("Report-1 is empty", "warning");
            }
        } catch (err) {
            console.error("Error fetching report:", err);
            alert?.showAlert("Error fetching report", "error");
        } finally {
            loading?.showLoading(false);
        }
    }

    async function generateReport2() {
        loading?.showLoading(true, "Generating Report 2...");
        try {
            const response = await Axios.get<ReportResponse>(`api/report2`);
            const data = response.data;
            if (data.done) {
                setTerm(2);
                const uniqueBatches = [...new Set(data.details.map(item => item.batch))];
                const sortedBatches = uniqueBatches.sort((a, b) => a - b);
                setBatches(sortedBatches);
                const uniqueSems = [...new Set(data.details.map(item => item.sem))];
                const sortedSems = uniqueSems.sort((a, b) => a - b);
                setSems(sortedSems);
                const uniqueSecs = [...new Set(data.details.map(item => item.sec))];
                const sortedSecs = uniqueSecs.sort((a, b) => a.localeCompare(b));
                setSecs(sortedSecs);
                setShow(false);
                alert?.showAlert("Report-2 generated successfully", "success");
            } else {
                alert?.showAlert("Report-2 is empty", "warning");
            }
        } catch (err) {
            console.error("Error fetching report:", err);
            alert?.showAlert("Error fetching report", "error");
        } finally {
            loading?.showLoading(false);
        }
    }

    function handleBatchClick(batch: number) {
        setSelectedBatch(batch);
        setSelectedSem(null);
        setSelectedSec("");
        setShowReport(false);
        setFilterLowPercentile(false);
        setFilterClicked(false);
    }

    function handleSemClick(sem: number) {
        setSelectedSem(sem);
        setSelectedSec("");
        setFilterLowPercentile(false);
        setFilterClicked(false);
        setShowReport(false);
    }

    async function handleSecClick(sec: string) {
        loading?.showLoading(true, "Fecthing Data...");
        try {
            setSelectedSec(sec);
            setFilterLowPercentile(false);
            setFilterClicked(false);

            if (selectedBatch !== null && selectedSem !== null) {
                const reportResponse = await Axios.get<{ report: Report[] }>(`api/fetchreport${term}?batch=${selectedBatch}&sem=${selectedSem}&sec=${sec}`);
                const sortedReport = reportResponse.data.report.sort((a, b) => a.sec.localeCompare(b.sec));
                setReport(sortedReport);
                setShowReport(true);
                const doneStudentsResponse = await Axios.get<CountdoneStundents>(`api/donestudents?batch=${selectedBatch}&sem=${selectedSem}&sec=${sec}&term=${term}`);
                setDoneStudents(doneStudentsResponse.data.donestds);
                setDoneTotStudents(doneStudentsResponse.data.donetotstds);
            } else {
                console.error("Batch or Semester is not selected");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        } finally {
            loading?.showLoading(false);
        }
    }


    const handleDownload = async () => {
        loading?.showLoading(true, "Downloading file...");

        try {
            const response = await Axios.get(
                `/api/download/downloadreport`, {
                params: {
                    sem: selectedSem,
                    sec: selectedSec,
                    batch: selectedBatch,
                    count: term,
                },
                responseType: "blob"
            }
            );

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


    // const data = {
    //     labels: report.map(r => r.subname),
    //     datasets: [
    //         {
    //             label: "Percentile",
    //             data: report.map(r => r.percentile), 
    //             backgroundColor: report.map(r => (r.percentile > 70 ? '#3CB371' : "red" )),
    //         },
    //     ],
    // };

    // const options = {
    //     scales: {
    //         y: {
    //             ticks: {
    //                 stepSize: 20,
    //             },
    //             min: 20,
    //             max: 100,
    //         },
    //     },
    // };


    const data = {
        labels: report.map(r => r.subname),
        datasets: [
            {
                label: 'Percentile',
                data: report.map(r => r.percentile),
                backgroundColor: (context: { dataset: { data: { [x: string]: any; }; }; dataIndex: string | number; }) => {
                    const value = context.dataset.data[context.dataIndex];
                    return value >= 70 ? '#3CB371' : 'red';
                },
                barThickness: 35,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        scales: {
            x: {
                ticks: {
                    stepSize: 20,
                },
                min: 0,
                max: 100,
            },
            y: {
                ticks: {
                    font: {
                        weight: 'bold' as const,
                        size: 15,
                    },
                },
            },
        },
    };

    const queData = {
        labels: questions.map(r => r.question),
        datasets: [
            {
                label: 'Percentile',
                data: questions.map(r => r.adjusted_total),
                backgroundColor: (context: { dataset: { data: { [x: string]: any; }; }; dataIndex: string | number; }) => {
                    const value = context.dataset.data[context.dataIndex];
                    return value >= 70 ? '#3CB371' : 'red';
                },
                barThickness: 35,
            },
        ],
    };



    const handleShowQuestionsClick = async (item: Report) => {
        setSelectedItem(item);
        setShowReport(false);
        setShow(false);
        setShowQuestions(true);

        try {
            loading?.showLoading(true, "Generating Questions...");

            const response = await Axios.post<{ reportquestions: ReportQuestion[] }>(
                `/api/reportquestions`,
                {
                    term: term,
                    sem: item.sem,
                    sec: item.sec,
                    facID: item.facID,
                    subcode: item.subcode,
                    batch: item.batch
                }
            );
            const data = response.data;
            setQuestions(data.reportquestions || []);
        } catch (error) {
            console.error("Error fetching questions:", error);
            alert?.showAlert("Error fetching questions", "error");
        } finally {
            loading?.showLoading(false);
        }
    };

    const handleReportDownload = async () => {
        loading?.showLoading(true, "Downloading file...");
        try {
            const response = await Axios.get(
                `/api/download/downloadreportquestion`,
                {
                    params: {
                        term: term,
                        sem: selectedItem?.sem,
                        sec: selectedItem?.sec,
                        facID: selectedItem?.facID,
                        subcode: selectedItem?.subcode,
                        batch: selectedItem?.batch
                    },
                    responseType: "blob",
                }
            );
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
            <Title title="Report" />
            {show ? (
                <div className="center-button">
                    <button
                        type="button"
                        className="green-button-filled col-span-1 flex items-center gap-2"
                        onClick={generateReport1}
                    >
                        Generate Report 1
                    </button>
                    <button
                        type="button"
                        className="green-button-filled col-span-1 flex items-center gap-2"
                        onClick={generateReport2}
                    >
                        Generate Report 2
                    </button>
                </div>
            ) : (
                <>
                    <div className="filter-buttons no-print">
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
                        <div className="filter-buttons no-print">
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
                    )}
                    {selectedSem !== null && (
                        <div className="filter-buttons no-print">
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
                                onClick={() => {
                                    setFilterLowPercentile(!filterLowPercentile);
                                    setFilterClicked(!filterClicked);
                                }}
                            >
                                <FilterList /> &lt;= 70
                            </button>
                        </div>
                    )}
                    {showReport && (
                        <>
                            <div
                                className="students-status"
                                style={{
                                    backgroundColor: "#FAFAD2",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    textAlign: "center",
                                    fontSize: "18px",
                                    color: "#333",
                                    width: "50%",
                                    maxWidth: "400px",
                                    margin: "0 auto",
                                }}
                            >
                                {donestudents !== undefined && donetotstudents !== undefined ? (
                                    <p>
                                        <strong>Completed Students: </strong> <span style={{ marginLeft: "5px", color: "#2E8B57", fontWeight: "bold" }} > {donestudents} </span> / {donetotstudents}
                                    </p>
                                ) : (
                                    <p>Loading data...</p>
                                )}
                            </div>

                            {report.length > 0 ? (
                                <>
                                    <div className="report-container">
                                        {report
                                            .filter(item => (selectedBatch === null || item.batch === selectedBatch) &&
                                                (selectedSem === null || item.sem === selectedSem) &&
                                                (selectedSec === "" || item.sec === selectedSec) &&
                                                (!filterLowPercentile || item.percentile <= 70)
                                            )
                                            .map((item, index) => (
                                                <div key={index} className={`report-item ${item.percentile <= 70 ? 'low-percentile-item' : ''}`}>
                                                    <p><strong>Faculty Name:</strong> {item.facName}</p>
                                                    <p><strong>Subject Code:</strong> {item.subcode}</p>
                                                    <p><strong>Subject Name:</strong> {item.subname}</p>
                                                    <p><strong>Section:</strong> {item.sec}</p>
                                                    <p><strong>Semester:</strong> {item.sem}</p>
                                                    <p><strong>Batch:</strong> {item.batch}</p>
                                                    <p><strong>Percentile:</strong> {item.percentile}</p>
                                                    <button
                                                        className="Show-Questions-button"
                                                        onClick={() => handleShowQuestionsClick(item)}
                                                    >
                                                        Show Questions
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                    {filterClicked && report.filter(item => filterLowPercentile && item.percentile <= 70).length === 0 ? (
                                        <div className="no-report-message">
                                            <p>No members found with percentile less than or equal to 70.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Bar data={data} options={options} />
                                            <div className="download-button-container no-print">
                                                <button className="download-button" onClick={handleDownload}>
                                                    Download Report
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="no-report-message">
                                    <p>No report available for the selected criteria.</p>
                                </div>
                            )}

                        </>
                    )}
                    {/* {selectedItem && (
                        <>
                            <p><strong>Faculty Name:</strong> {selectedItem.facID}</p>
                            <p><strong>Subject Code:</strong> {selectedItem.subcode}</p>
                            <p><strong>Subject Name:</strong> {selectedItem.subname}</p>
                            <p><strong>Section:</strong> {selectedItem.sec}</p>
                            <p><strong>Semester:</strong> {selectedItem.sem}</p>
                            <p><strong>Batch:</strong> {selectedItem.batch}</p>
                            <p><strong>Percentile:</strong> {selectedItem.percentile}</p>
                        </>
                    )} */}
                    {showQuestions && (
                        <>
                            {selectedItem && (
                                <>
                                    <div className="report-container1">
                                        <div className={`report-item ${selectedItem.percentile <= 70 ? 'low-percentile-item' : ''}`}>
                                            <p><strong>Faculty Name:</strong> {selectedItem.facName}</p>
                                            <p><strong>Subject Code:</strong> {selectedItem.subcode}</p>
                                            <p><strong>Subject Name:</strong> {selectedItem.subname}</p>
                                            <p><strong>Section:</strong> {selectedItem.sec}</p>
                                            <p><strong>Semester:</strong> {selectedItem.sem}</p>
                                            <p><strong>Batch:</strong> {selectedItem.batch}</p>
                                            <p><strong>Percentile:</strong> {selectedItem.percentile}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="questions-table-container">
                                <div className="close-button-container">
                                    <button
                                        className="close-button"
                                        onClick={() => { setShowQuestions(false); setShowReport(true) }}
                                    >
                                        Close
                                    </button>
                                </div>
                                <table className="questions-table">
                                    <thead>
                                        <tr>
                                            <th>S.NO</th>
                                            <th>Question</th>
                                            <th>Percentile</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questions.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.question}</td>
                                                <td>{item.adjusted_total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Bar data={queData} options={options} />
                            <div className="download-button-container no-print">
                                <button className="download-button" onClick={handleReportDownload}>
                                    Download Report Questionare
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
}

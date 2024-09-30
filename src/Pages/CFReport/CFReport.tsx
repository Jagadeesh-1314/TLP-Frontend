import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { LoadingContext } from "../../components/Context/Loading";
import { useContext, useLayoutEffect, useState } from "react";
import "./CFReport.css";
import { Bar } from "react-chartjs-2";
import Title from "../../components/Title";
import { useAuth } from "../../components/Auth/AuthProvider";

interface CFReportResponse {
    details: { batch: number; branch: string, sem: number }[];
    done: boolean;
}

interface CFQuestion {
    question: string;
    branch: string;
    sem: number;
    count: number;
    total: number;
    adjusted_total: number;
}

interface CFReportItem {
    branch: string;
    batch: number;
    percentile: number;
}

export default function CFReport() {
    const alert = useContext(AlertContext);
    const loading = useContext(LoadingContext);
    const { user } = useAuth()!;

    const [batches, setBatches] = useState<number[]>([]);
    const [sems, setSems] = useState<number[]>([]);
    const [branches, setBranches] = useState<string[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<string>("");
    const [selectedSem, setSelectedSem] = useState<number>(0);
    const [show, setShow] = useState<boolean>(true);
    const [term, setTerm] = useState<number>(0);
    const [report, setReport] = useState<CFReportItem[]>([]);
    const [showReport, setShowReport] = useState<boolean>(false);
    const [questions, setQuestions] = useState<CFQuestion[]>([]);
    const [showQuestions, setShowQuestions] = useState<boolean>(false);

    async function generateReport(term: number, successMessage: string) {
        try {
            loading?.showLoading(true, `Generating CFReport ${term}...`);
            const response = await Axios.get<CFReportResponse>(`api/cfreport${term}?fbranch=${selectedBranch}`);
            const data = response.data;

            if (data.done) {
                setTerm(term);
                const uniqueBatches = [...new Set(data.details.map(item => item.batch))];
                setBatches(uniqueBatches);
                const uniqueSems = [...new Set(data.details.map(item => item.sem))];
                setSems(uniqueSems);
                setShow(false);
                alert?.showAlert(successMessage, "success");
            } else {
                alert?.showAlert(`CF - Report-${term} is empty`, "warning");
            }
        } catch (err) {
            console.error(`Error fetching Report ${term}:`, err);
            alert?.showAlert(`Error fetching Report ${term}`, "error");
        } finally {
            loading?.showLoading(false);
        }
    }

    async function generateReport1() {
        if (branches.length !== 0 && selectedBranch === '') {
            alert?.showAlert('Please select a branch', "warning");
            return;
        }
        await generateReport(1, "CF - Report-1 generated successfully");
    }

    async function generateReport2() {
        if (branches.length !== 0 && selectedBranch === '') {
            alert?.showAlert('Please select a branch', "warning");
            return;
        }
        await generateReport(2, "CF - Report-2 generated successfully");
    }


    function handleBatchClick(batch: number) {
        setSelectedBatch(batch);
        setSelectedSem(0);
        setShowReport(false);
        setShowQuestions(false);
    }

    async function handleSemClick(sem: number) {
        setSelectedSem(sem);
        setShowReport(true);
        setShowQuestions(false);
        if (selectedBatch !== null) {
            try {
                loading?.showLoading(true, `Generating CFReport - ${term}...`);
                const response = await Axios.post<{ cfreport: CFReportItem[] }>(
                    `api/fetchcfreport`,
                    {
                        term: term,
                        batch: selectedBatch,
                        fbranch: selectedBranch,
                        sem: sem,
                    }
                );
                const data = response.data;
                if (data.cfreport) {
                    setReport(data.cfreport);
                    setShowReport(true);
                } else {
                    console.error("Data format is incorrect. Expected an array for 'cfreport'.");
                    setReport([]);
                }
            } catch (error) {
                console.error("Error fetching details:", error);
                setReport([]);
            } finally {
                loading?.showLoading(false);
            }
        } else {
            console.error("Batch is not selected");
        }
    }

    function handleBranchClick(branch: string) {
        setSelectedBranch(branch ? branch : "");
        setShowReport(false);
    }

    const handleDownload = async () => {
        loading?.showLoading(true, "Downloading file...");
        try {
            const response = await Axios.get(
                `/api/download/downloadcfreport`,
                {
                    params: {
                        sem: selectedSem,
                        batch: selectedBatch,
                        count: term,
                        fbranch: selectedBranch
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

    async function cfreportquestions() {
        setShowQuestions(true);
        try {
            loading?.showLoading(true, "Generating Questions...");
            const response = await Axios.post<{ cfreportquestions: CFQuestion[] }>(
                `/api/cfreportquestions`,
                {
                    batch: selectedBatch,
                    term: term,
                    sem: selectedSem,
                    fbranch: selectedBranch
                }
            );
            const data = response.data;
            setQuestions(data.cfreportquestions || []);
        } catch (error) {
            console.error("Error fetching questions:", error);
            alert?.showAlert("Error fetching questions", "error");
        } finally {
            loading?.showLoading(false);
        }
    }




    async function prev1() {
        try {
            setTerm(1);
            loading?.showLoading(true, `Generating CFReport - ${term}...`);
            const res1 = await Axios.post<CFReportResponse>(`api/fetchcfreport`, { term: 1 });
            const data1 = res1.data;
            if (data1.done) {
                const uniqueBatches = [...new Set(data1.details.map(item => item.batch))];
                setBatches(uniqueBatches);
                const uniqueSems = [...new Set(data1.details.map(item => item.sem))];
                setSems(uniqueSems);
                setShow(false);
                alert?.showAlert("Fecthing Previous CF - Report-1", "success");
            } else {
                alert?.showAlert("CF - Report-1 is empty", "warning");
            }

        } catch (error) {
            console.error("Error fetching details:", error);
            setReport([]);
        } finally {
            loading?.showLoading(false);
        }
    }


    async function prev2() {
        try {
            setTerm(2);
            loading?.showLoading(true, `Generating CFReport - ${term}...`);
            const response = await Axios.post<CFReportResponse>(`api/fetchcfreport`, { term: 2 });
            const data = response.data;
            if (data.done && data.details.length !== 0) {
                const uniqueBatches = [...new Set(data.details.map(item => item.batch))];
                setBatches(uniqueBatches);
                const uniqueSems = [...new Set(data.details.map(item => item.sem))];
                setSems(uniqueSems);
                setShow(false);
                alert?.showAlert("Fecthing Previous CF - Report-2", "success");
            } else {
                alert?.showAlert("CF - Report-2 is empty", "warning");
            }

        } catch (error) {
            console.error("Error fetching details:", error);
            setReport([]);
        } finally {
            loading?.showLoading(false);
        }
    }


    const data = {
        labels: questions.map((_r, index) => `Que - ${index + 1}`),
        datasets: [
            {
                label: 'Percentile',
                data: questions.map(q => q.adjusted_total),
                backgroundColor: (context: { dataset: { data: { [x: string]: any; }; }; dataIndex: string | number; }) => {
                    const value = context.dataset.data[context.dataIndex];
                    return value >= 70 ? '#3CB371' : 'red';
                },
                barThickness: 35,
            },
        ],
    };

    const options = {
        indexAxis: 'x' as const,
        scales: {
            x: {
                ticks: {
                    font: {
                        weight: 'bold' as const,
                        size: 15,
                    },
                },
            },
            y: {
                ticks: {
                    stepSize: 25,
                    font: {
                        weight: 'bold' as const,
                        size: 15,
                    },
                },
                min: 0,
                max: 100,
            },
        },
        layout: {
            padding: {
                left: 100,
                right: 100,
                top: 10,
                bottom: 10,
            },
        },
    };


    // const options = {
    //     indexAxis: 'y' as const,
    //     scales: {
    //         x: {
    //             ticks: {
    //                 stepSize: 25, 
    //                 font: {
    //                     size: 15,
    //                 },
    //             },
    //             min: 0,
    //             max: 100,
    //         },
    //         y: {
    //             ticks: {
    //                 font: {
    //                     weight: 'bold' as const,
    //                     size: 15, 
    //                 },
    //             },
    //         },
    //     },
    //     layout: {
    //         padding: {
    //             left: 100,
    //             right: 100,
    //             top: 10,
    //             bottom: 10, 
    //         },
    //     },
    // };


    if (user?.branch === 'FME' || user?.branch === '') {
        useLayoutEffect(() => {
            Axios.get(`/api/manage/branchdetails`)
                .then(({ data }) => {
                    setBranches(data.branchDetails);
                })
        }, [])
    }


    return (
        <>
            <Title title="Central Facilities Report" />
            {show ? (
                <>
                    <div className="filter-buttons no-print">                    {branches.map((branch, index) => (
                        <button
                            key={index}
                            className={`filter-button ${selectedBranch === branch ? 'selected' : ''}`}
                            onClick={() => handleBranchClick(branch)}
                        >
                            {branch}
                        </button>
                    ))}
                    </div>
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', position: 'absolute', bottom: '20px', right: '20px' }}>
                        <button
                            type="button"
                            style={{ backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px' }}
                            onClick={() => prev1()}
                        >
                            Previous CF Report 1
                        </button>
                        <button
                            type="button"
                            style={{ backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
                            onClick={() => prev2()}
                        >
                            Previous CF Report 2
                        </button>
                    </div>

                </>
            ) : (
                <>
                    {selectedBranch !== '' && (
                        <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9', textAlign: 'center', maxWidth: '300px', margin: '10px auto' }}>
                            Selected Branch :
                            <b style={{ color: '#FF7F50', fontSize: '18px' }}>  {selectedBranch}</b> <br />
                        </div>
                    )}
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
                            {sems
                            .filter(sem => user?.branch === 'FME' ? [1, 2].includes(sem) : true)
                            .map((sem, index) => (
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
                    {showReport && (
                        <>
                            <div className="report-container1">
                                {report.length > 0 ? (
                                    report.map((item, index) => (
                                        <div key={`${item.batch}-${item.branch}-${index}`} className="report-item1">
                                            <p><strong>Branch:</strong> {item.branch}</p>
                                            <p><strong>Batch:</strong> {item.batch}</p>
                                            <p><strong>Percentile:</strong> {item.percentile}</p>
                                            <button
                                                className="Show-Questions-button"
                                                onClick={() => cfreportquestions()}
                                            >
                                                Show Questions
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-report-message">
                                        No report available for the selected criteria.
                                    </div>
                                )}
                            </div>

                            {showQuestions && (
                                <>
                                    <div className="questions-table-container">
                                        <div className="close-button-container">
                                            <button
                                                className="close-button"
                                                onClick={() => setShowQuestions(false)}
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
                                    <Bar data={data} options={options} />
                                </>
                            )}
                            {showQuestions && (
                                <>
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
            )}
        </>
    );
}

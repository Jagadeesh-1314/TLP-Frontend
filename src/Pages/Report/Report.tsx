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
import { Dialog, DialogTitle, DialogContent, FormControlLabel, DialogActions, Button, Radio, RadioGroup } from "@mui/material";
import { useAuth } from "../../components/Auth/AuthProvider";
import { ReportDetails, ReportQuestion, ReportResponse, SecList } from "../../Types/responseTypes";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, FileText, BarChart2, ArrowLeft, AlertCircle, GraduationCap, User, Book, Code, Download, X } from "lucide-react";
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);


export default function Report() {
    const alert = useContext(AlertContext);
    const loading = useContext(LoadingContext);
    const location = useLocation();
    const { user } = useAuth()!;

    const [report, setReport] = useState<ReportDetails[]>(location.state?.report || []);
    const [sems, setSems] = useState<number[]>([]);
    const [secs, setSecs] = useState<string[]>([]);
    const [batches, setBatches] = useState<number[]>([]);
    const [branches, setBranches] = useState<string[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
    const [selectedSem, setSelectedSem] = useState<number | null>(null);
    const [selectedSec, setSelectedSec] = useState<string>("");
    const [selectedBranch, setSelectedBranch] = useState<string>("");
    const [show, setShow] = useState<boolean>(true);
    const [term, setTerm] = useState<number>(0);
    const [showReport, setShowReport] = useState<boolean>(false);
    const [filterLowPercentile, setFilterLowPercentile] = useState<boolean>(false);
    const [filterClicked, setFilterClicked] = useState<boolean>(false);
    const [donestudents, setDoneStudents] = useState<number>(0);
    const [donetotstudents, setDoneTotStudents] = useState<number>(0);
    const [selectedItem, setSelectedItem] = useState<ReportDetails | null>(null);
    const [questions, setQuestions] = useState<ReportQuestion[]>([]);
    const [showQuestions, setShowQuestions] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [rsec, setRsec] = useState<string>(selectedSec);


    useLayoutEffect(() => {
        const savedScrollPosition = location.state?.scrollPosition || 0;
        window.scrollTo(0, savedScrollPosition);
    }, [location.state?.scrollPosition]);


    async function generateReport(reportType: 'report' | 'reportavg', term: number, successMessage: string) {
        if (branches.length !== 0 && selectedBranch === '') {
            alert?.showAlert('Please select a branch', "warning");
            return;
        }
        try {
            loading?.showLoading(true, `Generating ${successMessage}...`);
            const response = await Axios.post<ReportResponse>(`api/${reportType}`, {
                fbranch: selectedBranch,
                term: term,
            });
            const data = response.data;

            if (data.done) {
                setTerm(term);

                const uniqueBranches = data?.details?.some(item => item.branch)
                    ? [...new Set(data.details.map(item => item.branch))].sort((a, b) => a.localeCompare(b))
                    : [];
                setBranches(uniqueBranches);

                const uniqueBatches = [...new Set(data.details.map(item => item.batch))].sort((a, b) => a - b);
                setBatches(uniqueBatches);

                const uniqueSems = [...new Set(data.details.map(item => item.sem))].sort((a, b) => a - b);
                setSems(uniqueSems);

                setShow(false);
                alert?.showAlert(`${successMessage} generated successfully`, "success");
            } else {
                alert?.showAlert(`${successMessage} is empty`, "warning");
            }
        } catch (err) {
            console.error(`Error fetching ${successMessage}:`, err);
            alert?.showAlert(`Error fetching ${successMessage}`, "error");
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
        Axios.post<{ secList: SecList[] }>(`api/seclist`, {
            batch: selectedBatch,
            sem: sem,
            fbranch: selectedBranch,
        })
            .then(({ data }) => {
                const uniqueSecs = [...new Set(data.secList.map(item => item.sec))].sort((a, b) => a.localeCompare(b));
                setSecs(uniqueSecs);
            })
            .catch((error) => {
                console.log(error);
                alert?.showAlert(error, "error");
            })
        setSelectedSec("");
        setFilterLowPercentile(false);
        setFilterClicked(false);
        setShowReport(false);
    }

    function handleBranchClick(branch: string) {
        setSelectedBranch(branch ? branch : "");
        setSelectedSec("");
        setFilterLowPercentile(false);
        setFilterClicked(false);
        setShowReport(false);
    }

    async function handleSecClick(sec: string) {
        loading?.showLoading(true, "Fecthing Data...");
        try {
            setSelectedSec(sec);
            setRsec(sec)
            setFilterLowPercentile(false);
            setFilterClicked(false);
            setShowQuestions(false);

            if (selectedBatch !== null && selectedSem !== null && term !== 0) {
                const response = await Axios.post<{ report: ReportDetails[] }>(
                    `api/fetchreport`,
                    {
                        term: term,
                        batch: selectedBatch,
                        sem: selectedSem,
                        sec: sec,
                        fbranch: selectedBranch,
                    }
                );
                const data = response.data;
                const sortedReport = data.report.sort((a, b) => a.sec.localeCompare(b.sec));
                setReport(sortedReport);
                setShowReport(true);
                setDoneStudents(data.report[0].completed);
                setDoneTotStudents(data.report[0].total_students);
            } else {
                const response = await Axios.post<{ report: ReportDetails[] }>(
                    `api/fetchavgreport`,
                    {
                        batch: selectedBatch,
                        sem: selectedSem,
                        sec: sec,
                        fbranch: selectedBranch,
                    }
                );
                const data = response.data;
                const sortedReport = data.report.sort((a, b) => a.sec.localeCompare(b.sec));
                setReport(sortedReport);
                setShowReport(true);
                setDoneStudents(data.report[0].completed);
                setDoneTotStudents(data.report[0].total_students);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        } finally {
            loading?.showLoading(false);
        }
    }


    if (user?.branch === 'FME' || user?.branch === '') {
        useLayoutEffect(() => {
            Axios.get(`/api/manage/branchdetails`)
                .then(({ data }) => {
                    setBranches(data.branchDetails);
                })
        }, [alert])
    }

    const handleDownload = async () => {
        try {
            setDialogOpen(false);
            loading?.showLoading(true, "Downloading file...");
            if (term === 0) {
                const response = await Axios.get(
                    `/api/download/downloadavgreport`, {
                    params: {
                        sem: selectedSem,
                        sec: rsec,
                        batch: selectedBatch,
                        term: term,
                        fbranch: selectedBranch,
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
                }
            } else {
                const response = await Axios.get(
                    `/api/download/downloadreport`, {
                    params: {
                        sem: selectedSem,
                        sec: rsec,
                        batch: selectedBatch,
                        term: term,
                        fbranch: selectedBranch,
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
                }
            }
        } catch (error) {
            alert?.showAlert("Error while downloading file", "error");
        } finally {
            loading?.showLoading(false);
        }
    };


    const data = (term === 0)
        ? {
            labels: report.map(r => r.subname),
            datasets: [
                {
                    label: 'Report-1',
                    data: report.map(r => r.percentile1),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 0.5,
                    barThickness: 20,
                },
                {
                    label: 'Report-2',
                    data: report.map(r => r.percentile2),
                    backgroundColor: 'rgba(2, 97, 250, 0.2)',
                    borderColor: 'rgba(2, 97, 250, 1)',
                    borderWidth: 0.5,
                    barThickness: 20,
                },
            ],
        }
        : {
            labels: report.map(r => r.subname),
            datasets: [
                {
                    label: 'Percentage',
                    data: report.map(r => r.percentile),
                    backgroundColor: report.map(r =>
                        r.percentile > 70 ? 'rgba(2, 97, 250, 0.2)' : 'rgba(255, 99, 132, 0.2)'
                    ),
                    borderColor: report.map(r =>
                        r.percentile > 70 ? 'rgba(2, 97, 250, 1)' : 'rgba(255, 99, 132, 1)'
                    ),
                    borderWidth: 0.5,
                    barThickness: 50,
                },
            ],
        };

    const options = {
        indexAxis: 'x' as const,
        scales: {
            y: {
                ticks: {
                    stepSize: 20,
                    font: {
                        size: 15,
                    },
                },
                min: 0,
                max: 100,
            },
            x: {
                ticks: {
                    font: {
                        weight: 'bold' as const,
                        size: 15,
                    },
                },
            },
        },
        layout: {
            padding: {
                left: 200,
                right: 200,
                top: 100,
                bottom: 10,
            },
        },
    };

    const queData = (term === 0)
        ? {
            labels: questions.map((_r, index) => `Que - ${index + 1}`),
            datasets: [
                {
                    label: 'Report-1',
                    data: questions.map(r => r.adjusted_total1),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 0.5,
                    barThickness: 20,
                },
                {
                    label: 'Report-2',
                    data: questions.map(r => r.adjusted_total2),
                    backgroundColor: 'rgba(2, 97, 250, 0.2)',
                    borderColor: 'rgba(2, 97, 250, 1)',
                    borderWidth: 0.5,
                    barThickness: 20,
                },
            ],
        } : {
            labels: questions.map((_r, index) => `Que - ${index + 1}`),
            datasets: [
                {
                    label: 'Percentage',
                    data: questions.map(r => r.adjusted_total),
                    backgroundColor: (context: { dataset: { data: { [x: string]: any; }; }; dataIndex: string | number; }) => {
                        const value = context.dataset.data[context.dataIndex];
                        return value >= 70 ? '#3CB371' : 'red';
                    },
                    barThickness: 45,
                },
            ],
        };


    const handleShowQuestionsClick = async (item: ReportDetails) => {
        window.scrollTo(1, 500);
        setSelectedItem(item);
        setShowReport(false);
        setShow(false);
        setShowQuestions(true);

        try {
            if (selectedBatch !== null && selectedSem !== null && term !== 0) {
                loading?.showLoading(true, "Generating Questions...");

                const response = await Axios.post<{ reportquestions: ReportQuestion[] }>(
                    `/api/reportquestions`,
                    {
                        term: term,
                        sem: item.sem,
                        sec: item.sec,
                        facID: item.facID,
                        subcode: item.subcode,
                        batch: item.batch,
                        fbranch: selectedBranch
                    }
                );
                const data = response.data;
                console.log(data)
                setQuestions(data.reportquestions || []);
            } else {
                const response = await Axios.post<{ reportquestions: ReportQuestion[] }>(
                    `/api/reportavgquestions`,
                    {
                        sem: item.sem,
                        sec: item.sec,
                        facID: item.facID,
                        subcode: item.subcode,
                        batch: item.batch,
                        fbranch: selectedBranch
                    }
                );
                const data = response.data;
                setQuestions(data.reportquestions || []);
                console.log(data.reportquestions)
            }
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
                        batch: selectedItem?.batch,
                        fbranch: selectedBranch,
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

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    function handleBack(): void {
        setShow(true);
        setShowReport(false);
        setShowQuestions(false);
        setSelectedBatch(null);
        setSelectedSem(null);
        setSelectedSec("");
        setShowReport(false);
        setFilterLowPercentile(false);
        setFilterClicked(false);
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4"
        >
            <div className="max-w-7xl mx-auto space-y-4">
                {/* Header */}
                <motion.div
                    className="text-center mb-5"
                    variants={itemVariants}
                >
                    <Title title="Academics Report" />
                </motion.div>

                {show ? (
                    <motion.div className="space-y-4" variants={containerVariants}>
                        {/* Branch Selection */}
                        {branches.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3 justify-center mx-auto">
                                {branches.map((branch, index) => (
                                    <motion.button
                                        key={index}
                                        variants={itemVariants}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                        whileHover={{ scale: 1.1, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)' }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`p-3 md:p-4 rounded-lg transition-transform duration-200 ${selectedBranch === branch
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                            : 'bg-white hover:bg-gray-100 text-gray-700'
                                            }`}
                                        onClick={() => handleBranchClick(branch)}
                                    >
                                        <div className="flex items-center justify-center gap-1 md:gap-2">
                                            <Building2 className="w-5 h-5 md:w-6 md:h-6" />
                                            <span className="font-medium md:font-semibold">{branch}</span>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        )}


                        {/* Report Generation Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                                onClick={async () => await generateReport('report', 1, "Report 1")}
                            >
                                <FileText className="w-5 h-5" />
                                Generate Report 1
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                                onClick={async () => await generateReport('report', 2, "Report 2")}
                            >
                                <FileText className="w-5 h-5" />
                                Generate Report 2
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                                onClick={async () => await generateReport('reportavg', 0, "Average Report")}
                            >
                                <FileText className="w-5 h-5" />
                                Generate Report Average
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedBranch ? "branch-selected" : "report-content"}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }} // Smooth easing for transitions
                                className="space-y-4"
                            >
                                {/* Branch Info */}
                                {selectedBranch && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-md p-4 hover:shadow-xl transition-shadow duration-300"
                                    >
                                        <button
                                            onClick={() => handleBack()}
                                            className="flex items-center gap-2 text-white hover:text-black transition-colors transform hover:scale-105 duration-200"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                            <span className="font-semibold">Back</span>
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-blue-600" />
                                            <span className="font-medium text-white">Selected Branch:</span>
                                            <span className="font-bold text-yellow-400">{selectedBranch}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex flex-wrap justify-center gap-4">
                                {batches.map((batch: number, index: number) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <button
                                            onClick={() => handleBatchClick(batch)}
                                            className={`filter-button ${selectedBatch === batch ? 'selected' : ''}`}
                                        >
                                            Batch {batch}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {(selectedBranch !== null && selectedBatch !== null) && (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key="semesters"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {sems
                                            .filter(sem => user?.branch === 'FME' ? [1, 2].includes(sem) : true)
                                            .map((sem, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <button
                                                        onClick={() => handleSemClick(sem)}
                                                        className={`filter-button ${selectedSem === sem ? 'selected' : ''}`}
                                                    >
                                                        Semester {sem}
                                                    </button>
                                                </motion.div>
                                            ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        )}

                        {selectedSem !== null && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {secs.length > 0 ? (
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {secs.map((sec, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <button
                                                    onClick={() => handleSecClick(sec)}
                                                    className={`filter-button ${selectedSec === sec ? 'selected' : ''}`}
                                                >
                                                    Section {sec}
                                                </button>
                                            </motion.div>
                                        ))}
                                        <button
                                            className={`filter-button ${filterLowPercentile ? 'selected' : ''}`}
                                            onClick={() => {
                                                setFilterLowPercentile(!filterLowPercentile);
                                                setFilterClicked(!filterClicked);
                                            }}
                                            disabled={!selectedSec}
                                        >
                                            <FilterList /> &lt;= 70
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-10 flex items-center justify-center gap-3 py-6 px-4 bg-grey-100 rounded-md shadow-md">
                                        <AlertCircle className="w-6 h-6 text-gray-600" />
                                        <p className="text-gray-600 font-semibold text-lg">
                                            No sections available to display.
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {showReport && (
                            <>
                                <div className="bg-yellow-100 p-2 rounded-lg text-center text-lg text-gray-800 w-1/2 max-w-xs mx-auto mb-6">
                                    {donestudents !== undefined && donetotstudents !== undefined ? (
                                        <p>
                                            <strong>Completed Students: </strong>
                                            <span className="ml-1 text-green-700 font-bold">
                                                {donestudents}
                                            </span> / {donetotstudents}
                                        </p>
                                    ) : (
                                        <p>Loading data...</p>
                                    )}
                                </div>

                                {report.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {report.length > 0 ? (
                                                report
                                                    .filter(item => (selectedBatch === null || item.batch === selectedBatch) &&
                                                        (selectedSem === null || item.sem === selectedSem) &&
                                                        (selectedSec === "" || item.sec === selectedSec) &&
                                                        (!filterLowPercentile || item.percentile <= 70)
                                                    )
                                                    .map((item, index) => (
                                                        <motion.div
                                                            key={`${item.batch}-${item.branch}-${index}`}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{
                                                                duration: 0.5,
                                                                ease: 'easeOut',
                                                                delay: index * 0.1,
                                                            }}
                                                            whileHover={{
                                                                scale: 1.05,
                                                                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                                                            }}
                                                            className={`rounded-xl shadow-lg overflow-hidden ${item.percentile < 70 ? 'bg-red-100' : 'bg-white'
                                                                }`}
                                                        >
                                                            <div className="p-4 space-y-3">
                                                                <div className="flex items-center gap-2">
                                                                    <User className="w-5 h-5 text-blue-600" />
                                                                    <span className="text-gray-600">Faculty:</span>
                                                                    <span className="font-medium">{item.facName}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Code className="w-5 h-5 text-blue-600" />
                                                                    <span className="text-gray-600">Subject Code:</span>
                                                                    <span className="font-medium">{item.subcode}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Book className="w-5 h-5 text-blue-600" />
                                                                    <span className="text-gray-600">Subject Name:</span>
                                                                    <span className="font-medium">{item.subname}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Building2 className="w-5 h-5 text-blue-600" />
                                                                    <span className="text-gray-600">Branch:</span>
                                                                    <span className="font-medium">{item.branch}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <GraduationCap className="w-5 h-5 text-purple-600" />
                                                                    <span className="text-gray-600">Batch:</span>
                                                                    <span className="font-medium">{item.batch}</span>
                                                                </div>
                                                                {(term === 0) && (
                                                                    <>
                                                                        <div className="flex items-center gap-2">
                                                                            <BarChart2 className="w-5 h-5 text-green-600" />
                                                                            <span className="text-gray-600">Report 1 Percentage:</span>
                                                                            <span className={`font-medium ${item.percentile >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                                                                {item.percentile1}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <BarChart2 className="w-5 h-5 text-green-600" />
                                                                            <span className="text-gray-600">Report 2 Percentage:</span>
                                                                            <span className={`font-medium ${item.percentile >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                                                                {item.percentile2}
                                                                            </span>
                                                                        </div>
                                                                    </>
                                                                )}
                                                                <div className="flex items-center gap-2">
                                                                    <BarChart2 className="w-5 h-5 text-green-600" />
                                                                    <span className="text-gray-600">Percentage:</span>
                                                                    <span className={`font-medium ${item.percentile >= 70 ? 'text-green-600' : 'text-red-600'
                                                                        }`}>
                                                                        {item.percentile}
                                                                    </span>
                                                                </div>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 bottom-0 left-0"
                                                                    onClick={() => handleShowQuestionsClick(item)}
                                                                >
                                                                    <FileText className="w-4 h-4" />
                                                                    Show Questions
                                                                </motion.button>
                                                            </div>
                                                        </motion.div>
                                                    ))
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="col-span-full flex items-center justify-center p-8 bg-white rounded-xl shadow-md"
                                                >
                                                    <div className="flex items-center gap-3 text-gray-500">
                                                        <AlertCircle className="w-6 h-6" />
                                                        <span>No report available for the selected criteria</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        {filterClicked && report.filter(item => filterLowPercentile && item.percentile <= 70).length === 0 ? (
                                            <div className="no-report-message flex items-center justify-center gap-3 py-6 px-4 bg-red-100 rounded-md shadow-md">
                                                <AlertCircle className="w-6 h-6 text-red-600" />
                                                <p className="text-red-600 font-semibold text-lg">
                                                    No members found with percentile less than or equal to 70.
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Chart */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    // style={{ width: '1200px', margin: '0 auto' }}
                                                    className="bg-white rounded-xl shadow-lg p-6"
                                                >
                                                    <Bar data={data} options={options} />
                                                </motion.div>

                                                {/* Download Button */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex justify-center"
                                                >
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setDialogOpen(true)}
                                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                                    >
                                                        <Download className="w-5 h-5" />
                                                        Download Report
                                                    </motion.button>
                                                </motion.div>
                                                <Dialog
                                                    open={dialogOpen}
                                                    onClose={() => setDialogOpen(false)}
                                                    PaperProps={{
                                                        style: {
                                                            width: '600px',
                                                            maxWidth: '600px',
                                                        }
                                                    }}
                                                    aria-labelledby="dialog-title"
                                                    aria-describedby="dialog-description"
                                                    role="dialog"
                                                >
                                                    <DialogTitle id="dialog-title">Select To Download File</DialogTitle>
                                                    <DialogContent id="dialog-description">
                                                        <RadioGroup
                                                            value={rsec}
                                                            onChange={(e) => setRsec(e.target.value)}
                                                        >
                                                            <FormControlLabel
                                                                value={""}
                                                                control={<Radio />}
                                                                label="All Sections"
                                                            />
                                                            <FormControlLabel
                                                                value={selectedSec}
                                                                control={<Radio />}
                                                                label="Selected Section"
                                                            />
                                                        </RadioGroup>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={() => setDialogOpen(false)} color="error">Cancel</Button>
                                                        <Button onClick={handleDownload} color="primary">
                                                            Download Report
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full flex items-center justify-center p-8 bg-red-50 rounded-xl shadow-md"
                                    >
                                        <div className="flex items-center gap-3 text-yellow-500">
                                            <AlertCircle className="w-6 h-6" />
                                            <span>No report available for the selected criteria</span>
                                        </div>
                                    </motion.div>
                                )}

                            </>
                        )}

                        {showQuestions && (
                            <>
                                {selectedItem && (
                                    <>
                                        <motion.div
                                            key={`${selectedItem.batch}-${selectedItem.branch}`}
                                            whileHover={{ scale: 1.02 }}
                                            className={`rounded-xl shadow-lg overflow-hidden mx-auto ${selectedItem.percentile < 70 ? 'bg-red-100' : 'bg-white'} max-w-xs sm:max-w-sm md:max-w-md`}
                                        >
                                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                                                <h3 className="text-white font-semibold center">Report Details</h3>
                                            </div>
                                            <div className="p-4 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-5 h-5 text-blue-600" />
                                                    <span className="text-gray-600">Faculty:</span>
                                                    <span className="font-medium">{selectedItem.facName}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Code className="w-5 h-5 text-blue-600" />
                                                    <span className="text-gray-600">Subject Code:</span>
                                                    <span className="font-medium">{selectedItem.subcode}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Book className="w-5 h-5 text-blue-600" />
                                                    <span className="text-gray-600">Subject Name:</span>
                                                    <span className="font-medium">{selectedItem.subname}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-5 h-5 text-blue-600" />
                                                    <span className="text-gray-600">Branch:</span>
                                                    <span className="font-medium">{selectedItem.branch}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="w-5 h-5 text-purple-600" />
                                                    <span className="text-gray-600">Batch:</span>
                                                    <span className="font-medium">{selectedItem.batch}</span>
                                                </div>
                                                {(term === 0) && (
                                                    <>
                                                        <div className="flex items-center gap-2">
                                                            <BarChart2 className="w-5 h-5 text-green-600" />
                                                            <span className="text-gray-600">Report 1 Percentage:</span>
                                                            <span className={`font-medium ${selectedItem.percentile >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {selectedItem.percentile1}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <BarChart2 className="w-5 h-5 text-green-600" />
                                                            <span className="text-gray-600">Report 2 Percentage:</span>
                                                            <span className={`font-medium ${selectedItem.percentile >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {selectedItem.percentile2}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <BarChart2 className="w-5 h-5 text-green-600" />
                                                    <span className="text-gray-600">Percentage:</span>
                                                    <span className={`font-medium ${selectedItem.percentile >= 70 ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {selectedItem.percentile}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </>
                                )}

                                {/* Questions Section */}
                                <AnimatePresence>
                                    {showQuestions && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-4"
                                        >
                                            {/* Questions Table */}
                                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600">
                                                    <h3 className="text-white font-bold text-xl flex-grow text-center">
                                                        TLP Analysis
                                                    </h3>
                                                    <button
                                                        onClick={() => { setShowReport(true); setShowQuestions(false); }}
                                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                                    >
                                                        <X className="w-5 h-5 text-white" />
                                                    </button>
                                                </div>
                                                <div className="p-4 overflow-x-auto">
                                                    <table className="w-full">
                                                        {term === 0 ? (
                                                            <>
                                                                <thead>
                                                                    <tr className="bg-gray-50">
                                                                        <th className="px-4 py-3 text-center text-lg font-semibold text-gray-600">S.NO</th>
                                                                        <th className="px-4 py-3 text-center text-lg font-semibold text-gray-600">TLP Parameter</th>
                                                                        <th className="px-4 py-3 text-center text-lg font-semibold text-gray-600">R - 1</th>
                                                                        <th className="px-4 py-3 text-center text-lg font-semibold text-gray-600">R - 2</th>
                                                                        <th className="px-4 py-3 text-center text-lg font-semibold text-gray-600">Avg Percentage</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {questions.map((item, index) => (
                                                                        <tr key={index} className="border-t border-gray-100">
                                                                            <td className="px-4 py-3 text-md text-center text-gray-600">{index + 1}</td>
                                                                            <td className="px-4 py-3 text-md text-gray-600">{item.question}</td>
                                                                            <td className={`px-4 py-3 text-md text-center font-medium ${item.adjusted_total1 >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                                                                {item.adjusted_total1}
                                                                            </td>
                                                                            <td className={`px-4 py-3 text-md text-center font-medium ${item.adjusted_total2 >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                                                                {item.adjusted_total2}
                                                                            </td>
                                                                            <td className={`px-4 py-3 text-md text-center font-medium ${item.avg_adjusted_total >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                                                                {item.avg_adjusted_total}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <thead>
                                                                    <tr className="bg-gray-50">
                                                                        <th className="px-4 py-3 text-center text-lg font-semibold text-gray-600">S.NO</th>
                                                                        <th className="px-4 py-3 text-center text-lg font-semibold text-gray-600">TLP Parameter</th>
                                                                        <th className="px-4 py-3 text-center text-lg font-semibold text-gray-600">Percentage</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {questions.map((item, index) => (
                                                                        <tr key={index} className="border-t border-gray-100">
                                                                            <td className="px-4 py-3 text-center text-md text-gray-600">{index + 1}</td>
                                                                            <td className="px-4 py-3 text-md text-gray-600">{item.question}</td>
                                                                            <td className={`px-4 py-3 text-center text-md font-medium ${item.adjusted_total >= 70 ? 'text-green-600' : 'text-red-600'
                                                                                }`}>
                                                                                {item.adjusted_total}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </>
                                                        )}
                                                    </table>
                                                </div>
                                            </div>

                                            {/* Chart */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white rounded-xl shadow-lg p-6"
                                            >
                                                <Bar data={queData} options={options} />
                                            </motion.div>

                                            {/* Download Button */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex justify-center"
                                            >
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={handleReportDownload}
                                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                                >
                                                    <Download className="w-5 h-5" />
                                                    Download Questionare Report
                                                </motion.button>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
}

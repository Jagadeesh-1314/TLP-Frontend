import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { LoadingContext } from "../../components/Context/Loading";
import { useContext, useState } from "react";
import { Bar } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, FileText, BarChart2, X, Download, GraduationCap } from "lucide-react";
import { CFReportItem, CFQuestion, CFReportResponse } from "../../Types/responseTypes";
import { Autocomplete, TextField } from "@mui/material";
import AnimatedPercentage from "./AnimatedPercantage";

export default function AdminCFReport() {
    const alert = useContext(AlertContext);
    const loading = useContext(LoadingContext);

    const [show, setShow] = useState<boolean>(true);
    const [isAvg, setIsAvg] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [download, setDownload] = useState<string | null>(null);
    const [term, setTerm] = useState<number>(0);
    const [report, setReport] = useState<CFReportItem[]>([]);
    const [showReport, setShowReport] = useState<boolean>(false);
    const [questions, setQuestions] = useState<CFQuestion[]>([]);
    const [showQuestions, setShowQuestions] = useState<boolean>(false);
    const [startYear, setStartYear] = useState<number | null>(null);
    const [endYear, setEndYear] = useState<number | null>(null);
    const [oddSemSelected, setOddSemSelected] = useState(false);
    const [evenSemSelected, setEvenSemSelected] = useState(false);
    const [semValues, setSemValues] = useState<number[]>([]);
    const [showBranches, setShowBranches] = useState(false);
    const overallData = report.find(item => item.branch === 'Overall')!;
    const branchData = report.filter(item => item.branch !== 'Overall');


    // Handle toggle for Odd Sem
    const handleOddSemToggle = () => {
        if (!oddSemSelected) {
            setSemValues([1, 3, 5, 7]);
            setOddSemSelected(true);
            setEvenSemSelected(false);
        } else {
            setOddSemSelected(false);
        }
    };

    // Handle toggle for Even Sem
    const handleEvenSemToggle = () => {
        if (!evenSemSelected) {
            setSemValues([2, 4, 6, 8]);
            setEvenSemSelected(true);
            setOddSemSelected(false);
        } else {
            setEvenSemSelected(false);
        }
    };

    async function generateReport(term: number, successMessage: string, semValues: number[], startYear: number, endYear: number) {
        // Validation for year range
        if (!startYear || !endYear) {
            alert?.showAlert("Please select valid start and end years", "warning");
            return;
        }

        // Ensure valid year range
        if (endYear <= startYear || endYear - startYear !== 3) {
            alert?.showAlert("Please select a valid range of 4 consecutive years", "warning");
            return;
        }

        if (!oddSemSelected && !evenSemSelected) {
            alert?.showAlert("Please Select any pair of Sems", "warning");
            return;
        }
        try {
            loading?.showLoading(true, `Generating CFReport ${term}...`);
            const response = await Axios.post<CFReportResponse>(`api/cfreport`, {
                term: term,
                sem: semValues,
                startYear: startYear,
                endYear: endYear,
            });
            const data = response.data;

            if (data.done) {
                setTerm(term);
                setShow(false);
                setShowReport(true);
                setReport(data.details)
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

    async function generateAvgCfReport(startYear: number, endYear: number, semValues: number[], successMessage: string) {
        setIsAvg(true);
        if (!startYear || !endYear) {
            alert?.showAlert("Please select valid start and end years", "warning");
            return;
        }

        // Ensure valid year range
        if (endYear <= startYear || endYear - startYear !== 3) {
            alert?.showAlert("Please select a valid range of 4 consecutive years", "warning");
            return;
        }

        if (!oddSemSelected && !evenSemSelected) {
            alert?.showAlert("Please Select any pair of Sems", "warning");
            return;
        }
        try {
            loading?.showLoading(true, `Generating CFReport ${term}...`);
            const response = await Axios.post<CFReportResponse>(`api/cfreportaverage`, {
                sem: semValues,
                startYear: startYear,
                endYear: endYear,
            });
            const data = response.data;
            console.log(data)

            if (data.done) {
                setTerm(term);
                setShow(false);
                setShowReport(true);
                setReport(data.details)
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

    const handleReportDownload = async () => {
        setOpenDialog(false);
        loading?.showLoading(true, "Downloading file...");
        try {
            const response = await Axios.get(
                `/api/download/downloadcfreport`,
                {
                    params: {
                        term: term,
                        sem: semValues,
                        startYear: startYear,
                        endYear: endYear,
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

    const handleAVGReportDownload = async () => {
        setOpenDialog(false);
        loading?.showLoading(true, "Downloading file...");
        try {
            const response = await Axios.get(
                `/api/download/downloadcfavgreport`,
                {
                    params: {
                        term: term,
                        sem: semValues,
                        startYear: startYear,
                        endYear: endYear,
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

    const handleCFQuestionareDownload = async () => {
        setOpenDialog(false);
        loading?.showLoading(true, "Downloading file...");
        try {
            const response = await Axios.get(
                `/api/download/downloadcfreportquestion`,
                {
                    params: {
                        term: term,
                        sem: semValues,
                        startYear: startYear,
                        endYear: endYear,
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
        window.scrollTo(1, 400);
        setShowQuestions(true);
        try {
            loading?.showLoading(true, "Generating Questions...");
            const response = await Axios.post<{ cfreportquestions: CFQuestion[] }>(
                `/api/cfreportquestions`,
                {
                    term: term,
                    sem: semValues,
                    startYear: startYear,
                    endYear: endYear,
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

    const Rdata = (!isAvg) ? {
        labels: branchData.map(b => b.branch),
        datasets: [
            {
                label: 'Percentage',
                data: branchData.map(b => b.percentile ?? 0),
                backgroundColor: report.map(r =>
                    (r.percentile ?? 0) > 70 ? 'rgba(2, 97, 250, 0.2)' : 'rgba(255, 99, 132, 0.2)'
                ),
                borderColor: report.map(r =>
                    (r.percentile ?? 0) > 70 ? 'rgba(2, 97, 250, 1)' : 'rgba(255, 99, 132, 1)'
                ),
                borderWidth: 0.5,
                barThickness: 50,
            },
        ]
    } : {
        labels: branchData.map(b => b.branch),
        datasets: [
            {
                label: 'Report-1',
                data: branchData.map(b => b.percentile1 ?? 0),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 0.5,
                barThickness: 20,
            },
            {
                label: 'Report-2',
                data: branchData.map(b => b.percentile2 ?? 0),
                backgroundColor: 'rgba(2, 97, 250, 0.2)',
                borderColor: 'rgba(2, 97, 250, 1)',
                borderWidth: 0.5,
                barThickness: 20,
            },
        ],
    };

    const Qdata = {
        labels: questions.map((q, _index) => `${q.question}`),
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

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 15 }, (_, index) => currentYear - index);
    };

    const yearOptions = generateYearOptions();

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-3"
        >
            <div className="max-w-7xl mx-auto">

                {show ? (
                    <motion.div className="space-y-4" variants={containerVariants}>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                            {/* Start Year Autocomplete */}
                            <Autocomplete
                                options={yearOptions}
                                getOptionLabel={(option) => option.toString()}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Start Year"
                                        variant="outlined"
                                        placeholder="Type to search..."
                                        sx={{ width: '240px' }}
                                    />
                                )}
                                onChange={(_event, value) => {
                                    setStartYear(value);
                                }}
                            />

                            {/* End Year Autocomplete */}
                            <Autocomplete
                                options={yearOptions}
                                getOptionLabel={(option) => option.toString()}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select End Year"
                                        variant="outlined"
                                        placeholder="Type to search..."
                                        sx={{ width: '240px' }}
                                    />
                                )}
                                onChange={(_event, value) => {
                                    setEndYear(value);
                                }}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            {/* Odd Sem Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-3 ${oddSemSelected ? 'bg-green-600' : 'bg-gray-600'} text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
                                onClick={() => { handleOddSemToggle(); }}
                            >
                                <FileText className="w-5 h-5" />
                                Odd Sem (1, 3, 5, 7)
                            </motion.button>

                            {/* Even Sem Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-3 ${evenSemSelected ? 'bg-orange-500' : 'bg-gray-600'} text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
                                onClick={() => { handleEvenSemToggle(); }}
                            >
                                <FileText className="w-5 h-5" />
                                Even Sem (2, 4, 6, 8)
                            </motion.button>
                        </div>


                        {/* Report Generation Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                                onClick={async () => {
                                    if (startYear !== null && endYear !== null) {
                                        await generateReport(1, "CF - Report-1 generated successfully", semValues, startYear, endYear);
                                    } else {
                                        alert?.showAlert("Please select valid years", "warning");
                                    }
                                }}
                            >
                                <FileText className="w-5 h-5" />
                                Generate CF Report 1
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                                onClick={async () => {
                                    if (startYear !== null && endYear !== null) {
                                        await generateReport(2, "CF - Report-2 generated successfully", semValues, startYear, endYear);
                                    } else {
                                        alert?.showAlert("Please select valid years", "warning");
                                    }
                                }}
                            >
                                <FileText className="w-5 h-5" />
                                Generate CF Report 2
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                                onClick={async () => {
                                    if (startYear !== null && endYear !== null) {
                                        await generateAvgCfReport(startYear, endYear, semValues, "CF - Avg-Report generated successfully");
                                    } else {
                                        alert?.showAlert("Please select valid years", "warning");
                                    }
                                }}
                            >
                                <FileText className="w-5 h-5" />
                                Generate Report Average
                            </motion.button>
                        </div>

                    </motion.div>
                ) : (
                    <>
                        {/* Report Content */}
                        {showReport && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                {/* Report Cards */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                                >
                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                                        <h2 className="text-white text-2xl font-bold text-center">Overall CF Report Performance Term - {term ? term : 'Average'}</h2>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            {/* Percentage Circle */}
                                            {/* <div className="relative w-48 h-48">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className={`w-40 h-40 rounded-full flex items-center justify-center border-8 ${overallData.percentile >= 70 ? 'border-green-500' : 'border-red-500'
                                                        }`}>
                                                        <span className={`text-4xl font-bold ${overallData.percentile >= 70 ? 'text-green-500' : 'text-red-500'
                                                            }`}>
                                                            {overallData.percentile.toFixed(2)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div> */}
                                            <AnimatedPercentage overallData={overallData} />

                                            {/* Batch Range */}
                                            <div className="bg-gray-100 p-4 rounded-lg shadow-md max-w-xs mx-auto">
                                                <div className="text-xl font-semibold text-center text-gray-800">
                                                    Batch: <span className="text-blue-500">{startYear}</span> - <span className="text-blue-500">{endYear}</span>
                                                </div>
                                            </div>
                                            {/* Selected Sem */}
                                            <div className="bg-gray-100 p-4 rounded-lg shadow-md max-w-xs mx-auto">
                                                <div className="text-xl font-semibold text-center text-gray-800">
                                                    {oddSemSelected && (
                                                        <div>
                                                            Odd Semesters:
                                                            <span className="text-blue-500">    1</span>,
                                                            <span className="text-blue-500">    3</span>,
                                                            <span className="text-blue-500">    5</span>,
                                                            <span className="text-blue-500">    7</span>
                                                        </div>
                                                    )}
                                                    {evenSemSelected && (
                                                        <div>
                                                            Even Semesters:
                                                            <span className="text-green-500">   2</span>,
                                                            <span className="text-green-500">   4</span>,
                                                            <span className="text-green-500">   6</span>,
                                                            <span className="text-green-500">   8</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => { (!showBranches && window.scrollTo(1, 400)); setShowBranches(!showBranches); setShowQuestions(false) }}
                                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                                                >
                                                    <Building2 className="w-5 h-5" />
                                                    Show Branches
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => { setShowQuestions(!showQuestions); setShowBranches(false); cfreportquestions() }}
                                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                                                >
                                                    <FileText className="w-5 h-5" />
                                                    Show Questionnaire
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Confirmation Dialog */}
                                {openDialog && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
                                    >
                                        <motion.div
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0.9 }}
                                            className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center"
                                        >
                                            <motion.h2
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-2xl font-bold text-gray-800"
                                            >
                                                Confirm Download
                                            </motion.h2>
                                            <motion.p
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-lg font-medium text-gray-600 mt-4"
                                            >
                                                Are you sure you want to download :
                                            </motion.p>
                                            <motion.p
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mt-4"
                                            >
                                                {download}
                                            </motion.p>
                                            <div className="mt-6 flex justify-center gap-4">
                                                {/* Cancel Button */}
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setOpenDialog(false)}
                                                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                                                >
                                                    Cancel
                                                </motion.button>

                                                {/* Confirm Button */}
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => { (isAvg) ? ((download === 'CF-Report') ? handleAVGReportDownload() : handleCFQuestionareDownload()) : ((download === 'CF-Report') ? handleReportDownload() : handleCFQuestionareDownload()) }}
                                                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition"
                                                >
                                                    Confirm
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}

                                {/* Branches Section */}
                                <AnimatePresence>
                                    {showBranches && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {branchData.map((branch, index) => (
                                                    (!isAvg) ? (
                                                        <motion.div
                                                            key={branch.branch}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className={`rounded-xl shadow-lg overflow-hidden ${branch.percentile < 70 ? 'bg-red-50' : 'bg-white'
                                                                }`}
                                                        >
                                                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                                                                <h3 className="text-white font-semibold">{branch.branch}</h3>
                                                            </div>
                                                            <div className="p-4 space-y-3">
                                                                <div className="flex items-center gap-2">
                                                                    <Building2 className="w-5 h-5 text-blue-600" />
                                                                    <span className="text-gray-600">Branch:</span>
                                                                    <span className="font-medium">{branch.branch}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <GraduationCap className="w-5 h-5 text-purple-600" />
                                                                    <span className="text-gray-600">Batch:</span>
                                                                    <span className="font-medium">{startYear} - {endYear}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <BarChart2 className="w-5 h-5 text-green-600" />
                                                                    <span className="text-gray-600">Percentage:</span>
                                                                    <span className={`font-medium ${branch.percentile >= 70 ? 'text-green-600' : 'text-red-600'
                                                                        }`}>
                                                                        {branch.percentile.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ) : (

                                                        <motion.div
                                                            key={branch.branch}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className={`rounded-xl shadow-lg overflow-hidden ${branch.avg_percentile < 70 ? 'bg-red-50' : 'bg-white'
                                                                }`}
                                                        >
                                                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                                                                <h3 className="text-white font-semibold">{branch.branch}</h3>
                                                            </div>
                                                            <div className="p-4 space-y-3">
                                                                <div className="flex items-center gap-2">
                                                                    <Building2 className="w-5 h-5 text-blue-600" />
                                                                    <span className="text-gray-600">Branch:</span>
                                                                    <span className="font-medium">{branch.branch}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <GraduationCap className="w-5 h-5 text-purple-600" />
                                                                    <span className="text-gray-600">Batch:</span>
                                                                    <span className="font-medium">{startYear} - {endYear}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <BarChart2 className="w-5 h-5 text-green-600" />
                                                                    <span className="text-gray-600">Percentage:</span>
                                                                    <span className={`font-medium ${branch.percentile1 >= 70 ? 'text-green-600' : 'text-red-600'
                                                                        }`}>
                                                                        {branch.percentile1}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <BarChart2 className="w-5 h-5 text-green-600" />
                                                                    <span className="text-gray-600">Percentage:</span>
                                                                    <span className={`font-medium ${branch.percentile2 >= 70 ? 'text-green-600' : 'text-red-600'
                                                                        }`}>
                                                                        {branch.percentile2}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <BarChart2 className="w-5 h-5 text-green-600" />
                                                                    <span className="text-gray-600">Percentage:</span>
                                                                    <span className={`font-medium ${branch.avg_percentile >= 70 ? 'text-green-600' : 'text-red-600'
                                                                        }`}>
                                                                        {branch.avg_percentile}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )
                                                ))}
                                            </div>
                                            {/* CF Report Chart */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white rounded-xl shadow-lg p-6"
                                            >
                                                <Bar data={Rdata} options={options} />
                                            </motion.div>

                                            {/* CF Report Download Button */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex justify-center"
                                            >
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => { setOpenDialog(true); setDownload('CF-Report'); }}
                                                    className="mt-5 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                                >
                                                    <Download className="w-5 h-5" />
                                                    Download CFReport
                                                </motion.button>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Questions Section */}
                                <AnimatePresence>
                                    {showQuestions && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-6"
                                        >
                                            {/* Questions Table */}
                                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600">
                                                    <h3 className="text-white font-semibold flex-grow text-center">
                                                        Questions Analysis
                                                    </h3>
                                                    <button
                                                        onClick={() => setShowQuestions(false)}
                                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                                    >
                                                        <X className="w-5 h-5 text-white" />
                                                    </button>
                                                </div>
                                                <div className="p-4 overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="bg-gray-50">
                                                                <th className="px-4 py-3 text-left text-md font-medium text-gray-600">S.NO</th>
                                                                <th className="px-4 py-3 text-left text-md font-medium text-gray-600">Parameter</th>
                                                                <th className="px-4 py-3 text-left text-md font-medium text-gray-600">Percentage</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {questions.map((item, index) => (
                                                                <tr key={index} className="border-t border-gray-100">
                                                                    <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                                                                    <td className="px-4 py-3 text-sm text-gray-600">{item.question}</td>
                                                                    <td className={`px-4 py-3 text-sm font-medium ${item.adjusted_total >= 70 ? 'text-green-600' : 'text-red-600'
                                                                        }`}>
                                                                        {item.adjusted_total}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* Chart */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white rounded-xl shadow-lg p-6"
                                            >
                                                <Bar data={Qdata} options={options} />
                                            </motion.div>

                                            {/* CF Questioniare Download Button */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex justify-center"
                                            >
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => { setOpenDialog(true); setDownload('CF-Report-Questioniare'); }}
                                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                                >
                                                    <Download className="w-5 h-5" />
                                                    Download CFReport Questioniare
                                                </motion.button>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
}
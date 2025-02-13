import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { LoadingContext } from "../../components/Context/Loading";
import { useContext, useLayoutEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Title from "../../components/Title";
import { useAuth } from "../../components/Auth/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, FileText, BarChart2, ArrowLeft, GraduationCap, AlertCircle, X, Download } from "lucide-react";
import { CFReportItem, CFQuestion, CFReportResponse } from "../../Types/responseTypes";
import AdminCFReport from "./AdminCF";


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
        if (branches.length !== 0 && selectedBranch === '') {
            alert?.showAlert('Please select a branch', "warning");
            return;
        }
        try {
            loading?.showLoading(true, `Generating CFReport ${term}...`);
            const response = await Axios.post<CFReportResponse>(`api/cfreport`, {
                fbranch: selectedBranch,
                term: term
            });
            const data = response.data;

            if (data.done) {
                setTerm(term);
                const uniqueBatches = [...new Set(data.details.map(item => item.batch))].sort();
                setBatches(uniqueBatches);

                const uniqueSems = [...new Set(data.details.map(item => item.sem))].sort();
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
                `/api/download/downloadcfreportquestion`,
                {
                    params: {
                        sem: selectedSem,
                        batch: selectedBatch,
                        term: term,
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
        window.scrollTo(1, 400);
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


    if (user?.branch === 'FME') {
        useLayoutEffect(() => {
            Axios.get(`/api/manage/branchdetails`)
                .then(({ data }) => {
                    setBranches(data.branchDetails);
                })
        }, [])
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6"
        >
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    variants={itemVariants}
                >
                    <Title title="Central Facilities Report" />
                </motion.div>
                {user?.username === 'admin' ? (
                    <AdminCFReport />
                ) : (
                    <>
                        {show ? (
                            <motion.div className="space-y-6" variants={containerVariants}>
                                {/* Branch Selection */}
                                {branches.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {branches.map((branch, index) => (
                                            <motion.button
                                                key={index}
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`p-4 rounded-xl transition-all duration-300 ${selectedBranch === branch
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                    : 'bg-white hover:bg-gray-50 text-gray-700'
                                                    }`}
                                                onClick={() => handleBranchClick(branch)}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    <Building2 className="w-5 h-5" />
                                                    <span>{branch}</span>
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
                                        onClick={async () => await generateReport(1, "CF - Report-1 generated successfully")}
                                    >
                                        <FileText className="w-5 h-5" />
                                        Generate CF Report 1
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                                        onClick={async () => await generateReport(2, "CF - Report-2 generated successfully")}
                                    >
                                        <FileText className="w-5 h-5" />
                                        Generate CF Report 2
                                    </motion.button>
                                </div>

                                {/* Previous Reports */}
                                <motion.div
                                    className="fixed bottom-6 right-6 space-y-3"
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2"
                                        onClick={prev1}
                                    >
                                        <BarChart2 className="w-4 h-4" />
                                        Previous CF Report 1
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2"
                                        onClick={prev2}
                                    >
                                        <BarChart2 className="w-4 h-4" />
                                        Previous CF Report 2
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key="report-content"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-6"
                                    >
                                        {/* Branch Info */}
                                        {selectedBranch && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center justify-between bg-white rounded-xl shadow-md p-4"
                                            >
                                                <button
                                                    onClick={() => setShow(true)}
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                                                >
                                                    <ArrowLeft className="w-5 h-5" />
                                                    Back
                                                </button>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-5 h-5 text-blue-600" />
                                                    <span className="font-medium text-gray-600">Selected Branch:</span>
                                                    <span className="font-bold text-blue-600">{selectedBranch}</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Batch Selection */}
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

                                {/* Report Content */}
                                {showReport && (

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-8"
                                    >
                                        {/* Report Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {report.length > 0 ? (
                                                report.map((item, index) => (
                                                    <motion.div
                                                        key={`${item.batch}-${item.branch}-${index}`}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        whileHover={{
                                                            scale: 1.05,
                                                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                                                        }}
                                                        className={`rounded-xl shadow-lg overflow-hidden ${item.percentile < 70 ? 'bg-red-100' : 'bg-white'
                                                            }`}
                                                    >
                                                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                                                            <h3 className="text-white font-semibold">Central Facilities Report Details</h3>
                                                        </div>
                                                        <div className="p-4 space-y-3">
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
                                                                className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                                                                onClick={() => cfreportquestions()}
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
                                                    className="col-span-full flex items-center justify-center p-8 bg-red-50 rounded-xl shadow-md"
                                                >
                                                    <div className="flex items-center gap-3 text-yellow-500">
                                                        <AlertCircle className="w-6 h-6" />
                                                        <span>No report available for the selected criteria</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

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
                                                            onClick={handleDownload}
                                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                                        >
                                                            <Download className="w-5 h-5" />
                                                            Download CFReport
                                                        </motion.button>
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </motion.div>

    );
}
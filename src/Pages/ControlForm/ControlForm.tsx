import { useContext, useLayoutEffect, useState } from "react";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, ChevronDown, ChevronUp, ArrowUpCircle, X, Calendar } from "lucide-react";
import { LoadingContext } from "../../components/Context/Loading";

export default function ControlForm() {
    const alert = useContext(AlertContext);
    const loading = useContext(LoadingContext);
    const [fTerm, setFTerm] = useState<number | null>(null);
    const [selectedSem, setSelectedSem] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [semesters, setSemesters] = useState<number[]>([]);
    const [promoteAll, setPromoteAll] = useState(false);
    const [branches, setBranches] = useState<string[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string[]>([]);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [dateOpen, setDateOpen] = useState<boolean>(false);
    // const [animationClass, setAnimationClass] = useState("");

    const fetchTerm = async () => {
        try {
            const { data } = await Axios.get<{ done: boolean, term: number }>(`api/fetchterm`);
            if (data.done) {
                setFTerm(data.term);
            }
        } catch (error) {
            console.error("Error fetching term:", error);
            alert?.showAlert("Error fetching term", "error");
        }
    };

    useLayoutEffect(() => {
        fetchTerm();
    }, []);

    useLayoutEffect(() => {
        Axios.get(`/api/manage/branchdetails`)
            .then(({ data }) => {
                setBranches(data.branchDetails);
                setSelectedBranch(data.branchDetails);
            });
    }, []);

    const incrementcount = async () => {
        try {
            const { data } = await Axios.post<{ done: boolean, term: number }>(`api/term1`);
            if (data.done) {
                fetchTerm();
                alert?.showAlert("Term 2 Activated", "success");
            } else {
                alert?.showAlert("Error in Activating", "error");
            }
        } catch (error) {
            console.error("Error Occurred in Activating:", error);
            alert?.showAlert("Error Occurred in Activating", "error");
        }
    };

    const decrementcount = async () => {
        try {
            const { data } = await Axios.post<{ done: boolean, term: number }>(`api/term2`);
            if (data.done) {
                fetchTerm();
                alert?.showAlert("Term 1 Activated", "success");
            } else {
                alert?.showAlert("Error in Activating", "error");
            }
        } catch (error) {
            console.error("Error Occurred in Activating:", error);
            alert?.showAlert("Error Occurred in Activating", "error");
        }
    };

    const promote = async () => {
        if (!promoteAll && selectedSem === null) {
            alert?.showAlert("Please select a semester", "warning");
            return;
        }
        try {
            const { data } = await Axios.post<{ done: boolean }>(`api/promote`, {
                sem: promoteAll ? "all" : selectedSem
            });
            if (data.done) {
                setSelectedSem(null);
                alert?.showAlert(
                    promoteAll
                        ? "All students promoted"
                        : `Students in Semester ${selectedSem} Promoted`,
                    "success"
                );
            } else {
                alert?.showAlert("Promotion not allowed: records exist in the next semester.", "error");
            }
        } catch (error) {
            console.error("Error Occurred in Promoting:", error);
            alert?.showAlert("Error Occurred in Promoting", "error");
        } finally {
            setOpenDialog(false);
        }
    };

    const handleOpenDialog = async () => {
        try {
            const { data } = await Axios.post<{ done: boolean, semesters: number[] }>(`api/promote`);
            if (data.done) {
                console.log(data)
                const sortedSemesters = data.semesters.sort((a, b) => a - b);
                setSemesters(sortedSemesters);
                setOpenDialog(true);
            } else {
                alert?.showAlert("Error fetching semesters", "error");
            }
        } catch (error) {
            console.error("Error fetching semesters:", error);
            alert?.showAlert("Error fetching semesters", "error");
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedSem(null);
        setPromoteAll(false);
        setSelectedBranch(branches);
    };

    const dateSubmit = async () => {
        if (!startDate || !endDate || !selectedBranch) {
            alert?.showAlert("Please select Branches, start and end dates.", "warning");
            return;
        }

        // Helper function to format dates as dd/mm/yyyy for display
        const formatDate = (date: Date): string => {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        // Validate that startDate is earlier than endDate
        if (startDate >= endDate) {
            alert?.showAlert("Start date must be earlier than the end date.", "error");
            return;
        }

        // Format dates for API submission (yyyy-mm-dd)
        const formatDateForAPI = (date: Date): string => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        const startDateString = formatDateForAPI(startDate);
        const endDateString = formatDateForAPI(endDate);

        try {
            loading?.showLoading(true, "Scheduling emails...");

            const response = await Axios.post("api/schedule-emails", JSON.stringify({
                startDate: startDateString,
                endDate: endDateString,
                branches: selectedBranch,
            }), {
                headers: {
                    "Content-Type": "application/json"
                }
            });            

            if (response.data.success) {
                alert?.showAlert(
                    `Emails scheduled successfully from ${formatDate(startDate)} to ${formatDate(endDate)}.`,
                    "success"
                );
                setStartDate(null);
                setEndDate(null);
            } else {
                alert?.showAlert("Failed to schedule emails.", "error");
            }
        } catch (error) {
            console.error("Error scheduling emails:", error);
            alert?.showAlert("Error scheduling emails. Please try again later.", "error");
        } finally {
            loading?.showLoading(false);
            setDateOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <motion.div
                            className="inline-block p-2 rounded-full bg-indigo-100 mb-4"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Settings2 className="w-8 h-8 text-indigo-600" />
                        </motion.div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Academic Term Control</h1>
                        <p className="text-gray-600">Manage terms and student promotions efficiently</p>
                    </div>

                    <motion.div
                        className="bg-white rounded-2xl shadow-xl p-8 mb-8"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="flex items-center justify-center space-x-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${fTerm === 1
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                onClick={() => decrementcount()}
                            >
                                <div className="flex items-center space-x-2">
                                    <ChevronDown className="w-5 h-5" />
                                    <span>Term 1</span>
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${fTerm === 2
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                onClick={() => incrementcount()}
                            >
                                <div className="flex items-center space-x-2">
                                    <ChevronUp className="w-5 h-5" />
                                    <span>Term 2</span>
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${dateOpen
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                onClick={() => setDateOpen(true)}
                            >
                                <div className="flex items-center space-x-2">
                                    <Calendar />
                                    <span>Set Date</span>
                                </div>
                            </motion.button>
                        </div>

                        <div className="mt-8 text-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-2xl font-semibold text-gray-700"
                            >
                                Current Term: {fTerm}
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center space-x-2 mx-auto"
                            onClick={() => handleOpenDialog()}
                            disabled={fTerm === 1}
                        >
                            <ArrowUpCircle className="w-5 h-5" />
                            <span>Promote Students</span>
                        </motion.button>
                    </motion.div>
                </motion.div>

                <AnimatePresence>
                    {openDialog && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-2xl p-8 max-w-2xl w-full"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Promote Students</h2>
                                    <button
                                        onClick={() => handleCloseDialog()}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="flex items-center space-x-3">
                                            <input
                                                type="radio"
                                                checked={promoteAll}
                                                onChange={() => setPromoteAll(true)}
                                                className="w-4 h-4 text-indigo-600"
                                            />
                                            <span className="text-gray-700">Promote All Semesters</span>
                                        </label>
                                        <label className="flex items-center space-x-3">
                                            <input
                                                type="radio"
                                                checked={!promoteAll}
                                                onChange={() => setPromoteAll(false)}
                                                className="w-4 h-4 text-indigo-600"
                                            />
                                            <span className="text-gray-700">Choose Specific Semester</span>
                                        </label>
                                    </div>

                                    {!promoteAll && (
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Select Semester
                                            </label>
                                            <select
                                                value={selectedSem || ''}
                                                onChange={(e) => setSelectedSem(Number(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="">Choose semester</option>
                                                {semesters.map((sem) => (
                                                    <option key={sem} value={sem}>
                                                        Semester {sem}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Select Branches
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {branches.map((branch) => (
                                                <label
                                                    key={branch}
                                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedBranch.includes(branch)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedBranch([...selectedBranch, branch]);
                                                            } else {
                                                                setSelectedBranch(
                                                                    selectedBranch.filter((id) => id !== branch)
                                                                );
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-indigo-600 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">{branch}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-8">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                                            onClick={() => handleCloseDialog()}
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                                            onClick={promote}
                                            disabled={!promoteAll && !selectedSem}
                                        >
                                            Promote
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {dateOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-2xl p-8 max-w-2xl w-full"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Set Date for Accouncement</h2>
                                    <button
                                        onClick={() => setDateOpen(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">

                                    <div className="flex space-x-4">
                                        {/* Start Date */}
                                        <div className="flex-1">
                                            <label className="block text-gray-700 font-medium mb-2">Start Date</label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => setStartDate(date)}
                                                className="w-full px-4 py-2 border rounded-lg"
                                                placeholderText="Select Start Date"
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </div>

                                        {/* End Date */}
                                        <div className="flex-1">
                                            <label className="block text-gray-700 font-medium mb-2">End Date</label>
                                            <DatePicker
                                                selected={endDate}
                                                onChange={(date) => setEndDate(date)}
                                                className="w-full px-4 py-2 border rounded-lg"
                                                placeholderText="Select End Date"
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Select Branches
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {branches.map((branch) => (
                                                <label
                                                    key={branch}
                                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedBranch.includes(branch)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedBranch([...selectedBranch, branch]);
                                                            } else {
                                                                setSelectedBranch(
                                                                    selectedBranch.filter((id) => id !== branch)
                                                                );
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-indigo-600 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">{branch}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-8">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                                            onClick={() => setDateOpen(false)}
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                                            onClick={dateSubmit}
                                            disabled={!startDate || !endDate}
                                        >
                                            Set Date
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

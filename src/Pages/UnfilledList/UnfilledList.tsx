import { useState, useContext, useLayoutEffect, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Axios from 'axios';
import { LoadingContext } from '../../components/Context/Loading';
import { AlertContext } from '../../components/Context/AlertDetails';
import Title from '../../components/Title';
import { useAuth } from '../../components/Auth/AuthProvider';
import { Users, Download } from 'lucide-react';
import { Student } from '../../Types/responseTypes';
import { Dialog, DialogTitle, DialogContent, FormControlLabel, DialogActions, Button, Radio, RadioGroup } from "@mui/material";

export default function ControlForm() {
    const { user } = useAuth()!;
    const loading = useContext(LoadingContext);
    const alert = useContext(AlertContext);

    const [students, setStudents] = useState<Student[]>([]);
    const [sems, setSems] = useState<number[]>([]);
    const [secs, setSecs] = useState<string[]>([]);
    const [selectedSem, setSelectedSem] = useState<number | null>(null);
    const [selectedSec, setSelectedSec] = useState<string>("");
    const [showRollNumbers, setShowRollNumbers] = useState<boolean>(false);
    const [selectedBranch, setSelectedBranch] = useState<string>("");
    const [branches, setBranches] = useState<string[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [rsec, setRsec] = useState<string>(selectedSec);
    const [rsem, setRsem] = useState<number | null>(selectedSem);

    useEffect(() => {
        async function fetchStudents() {
            try {
                loading?.showLoading(true, "Fetching Data...");
                const response = await Axios.get<{ unfilledstudents: Student[] }>(`api/unfilledstudents?fbranch=${selectedBranch}`);
                setStudents(response.data.unfilledstudents);
                const uniqueSems = [...new Set(response.data.unfilledstudents.map(student => student.sem))];
                const sortedSems = uniqueSems.sort((a, b) => a - b);
                setSems(sortedSems);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                loading?.showLoading(false);
            }
        }
        fetchStudents();
    }, []);

    if (user?.branch === 'FME' || user?.branch === '') {
        useLayoutEffect(() => {
            Axios.get(`/api/manage/branchdetails`)
                .then(({ data }) => {
                    setBranches(data.branchDetails);
                })
        }, [])
    }

    const handleBranchClick = async (branch: string) => {
        setSelectedBranch(branch);
        setSelectedSec("");
        setShowRollNumbers(false);
        setSelectedSem(null);

        try {
            loading?.showLoading(true, "Fetching Data...");
            const response = await Axios.get<{ unfilledstudents: Student[] }>(`api/unfilledstudents?fbranch=${branch}`);
            setStudents(response.data.unfilledstudents);
            const uniqueSems = [...new Set(response.data.unfilledstudents.map(student => student.sem))];
            const sortedSems = uniqueSems.sort((a, b) => a - b);
            setSems(sortedSems);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            loading?.showLoading(false);
        }
    }

    const handleSemClick = (sem: number) => {
        setSelectedSem(sem);
        const filteredStudents = students.filter(student => student.sem === sem);
        const uniqueSecs = [...new Set(filteredStudents.map(student => student.sec))];
        const sortedSecs = uniqueSecs.sort((a, b) => a.localeCompare(b));
        setSecs(sortedSecs);
        setSelectedSec("");
        setShowRollNumbers(false);
    };

    const handleSecClick = (sec: string) => {
        setSelectedSec(sec);
        setShowRollNumbers(true);
    };

    const handleDownload = async () => {
        loading?.showLoading(true, "Downloading file...");
        setDialogOpen(false);

        try {
            const response = await Axios.post(
                `/api/download/unfilledlist?sem=${rsem}&sec=${rsec}&fbranch=${selectedBranch}`,
                null,
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

    const filteredStudents = students
        .filter(student => selectedSem === null || student.sem === selectedSem)
        .filter(student => selectedSec === "" || student.sec === selectedSec);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const tableVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 py-4 px-4">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-7xl mx-auto space-y-4"
            >
                <div className="text-center">
                    <Title title="Unfilled Feedback List" />
                    <p className="text-violet-600">Track students who haven't submitted their feedback</p>
                </div>

                <div className="control-form space-y-6">
                    {user?.branch === 'FME' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="filter-container"
                        >
                            <div className="flex flex-wrap justify-center gap-4">
                                {branches.map((branch: string, index: number) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <button
                                            onClick={() => handleBranchClick(branch)}
                                            className={`filter-button ${selectedBranch === branch ? 'selected' : ''}`}
                                        >
                                            {branch}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key="semesters"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="filter-container"
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

                    {selectedSem !== null && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="filter-container"
                        >
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
                            </div>
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {showRollNumbers && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={tableVariants}
                                className="space-y-6"
                            >
                                <motion.div
                                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg flex items-center justify-between"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        <span className="font-medium text-gray-700">Total Students:</span>
                                        <span className="text-blue-600 font-bold">{filteredStudents.length}</span>
                                    </div>

                                    {/* Download button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setDialogOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download List
                                    </motion.button>
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
                                                onChange={(e) => { setRsec(e.target.value); setRsem(e.target.value === "" ? null : selectedSem) }}
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
                                                Download
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </motion.div>

                                <motion.div
                                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden"
                                    variants={tableVariants}
                                >
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                                <th className="px-6 py-3 text-left">S. No.</th>
                                                <th className="px-6 py-3 text-left">Roll No</th>
                                                <th className="px-6 py-3 text-left">Student Name</th>
                                                <th className="px-6 py-3 text-left">Pending</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStudents.map((student, index) => (
                                                <motion.tr
                                                    key={student.rollno}
                                                    variants={rowVariants}
                                                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">{index + 1}</td>
                                                    <td className="px-6 py-4">{student.rollno}</td>
                                                    <td className="px-6 py-4">{student.name}</td>
                                                    <td className="px-6 py-4">{student.status === 'facdone' ? "Central Facilities" : "Did not Submit"}</td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { LoadingContext } from '../../components/Context/Loading';
import { AlertContext } from '../../components/Context/AlertDetails';
import Title from '../../components/Title';
import { Autocomplete, TextField } from '@mui/material';
import "./Electives.css"
import { motion } from 'framer-motion';
import { useAuth } from '../../components/Auth/AuthProvider';

interface Details {
    sec: string;
    sem: number;
    rollno: string;
}

interface ElectiveSubject {
    subCode: string;
    subName: string;
}

interface Faculty {
    facID: string;
    facName: string;
}

export default function ControlForm() {
    const loading = useContext(LoadingContext);
    const alert = useContext(AlertContext);
    const { user } = useAuth()!;

    const [students, setStudents] = useState<Details[]>([]);
    const [sems, setSems] = useState<number[]>([]);
    const [secs, setSecs] = useState<string[]>([]);
    const [selectedSem, setSelectedSem] = useState<number | null>(null);
    const [selectedSec, setSelectedSec] = useState<string>("");
    const [rollNumbers, setRollNumbers] = useState<string[]>([]);
    const [electiveSubjects, setElectiveSubjects] = useState<ElectiveSubject[]>([]);
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [selectedFaculty, setselectedFaculty] = useState<string>("");
    const [showRollNumbers, setShowRollNumbers] = useState<boolean>(false);
    const [selectedSubCode, setSelectedSubCode] = useState<string>("");

    useEffect(() => {
        async function fetchStudents() {
            try {
                loading?.showLoading(true, "Gathering DATA...");
                const response = await Axios.get<{ details: Details[] }>('api/details');
                setStudents(response.data.details);
                const uniqueSems = [...new Set(response.data.details.map(student => student.sem))];
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

    useEffect(() => {
        async function fetchSubjects() {
            try {
                loading?.showLoading(true, "Gathering DATA...");
                const response = await Axios.get<{ subdetail: ElectiveSubject[] }>('api/electivesubjects');
                setElectiveSubjects(response.data.subdetail);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                loading?.showLoading(false);
            }
        }
        fetchSubjects();
    }, []);

    useEffect(() => {
        async function fetchFaculty() {
            try {
                loading?.showLoading(true, "Gathering DATA...");
                const response = await Axios.get<{ facdetail: Faculty[] }>('api/getfaculty');
                setFaculty(response.data.facdetail);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                loading?.showLoading(false);
            }
        }
        fetchFaculty();
    }, []);

    const handleSemClick = (sem: number) => {
        setSelectedSem(sem);
        const filteredStudents = students.filter(student => student.sem === sem);
        const uniqueSecs = [...new Set(filteredStudents.map(student => student.sec))];
        const sortedSecs = uniqueSecs.sort((a, b) => a.localeCompare(b));
        setSecs(sortedSecs);
        setSelectedSec("");
        setRollNumbers([]);
        setShowRollNumbers(false);
    };

    const handleSecClick = (sec: string) => {
        setSelectedSec(sec);
        setRollNumbers([]);
        setShowRollNumbers(true);
    };

    const handleRollNumber = (rollno: string) => {
        setRollNumbers(prevSelected =>
            prevSelected.includes(rollno)
                ? prevSelected.filter(rn => rn !== rollno)
                : [...prevSelected, rollno]
        );
    };

    const filteredStudents = students
        .filter(student => selectedSem === null || student.sem === selectedSem)
        .filter(student => selectedSec === "" || student.sec === selectedSec);


    const handleSubmit = async () => {
        try {
            loading?.showLoading(true, "Submitting details");
            const dataObject = {
                facID: selectedFaculty,
                subCode: selectedSubCode,
                rollNumbers: rollNumbers,
            };
            const { data } = await Axios.post(`api/electivedetails`, dataObject, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (data.done) {
                alert?.showAlert("DONE", "success");
                setSelectedSem(null);
                setSelectedSec("");
                setRollNumbers([]);
                setShowRollNumbers(false);
                setSelectedSubCode("");
                setselectedFaculty("");
                window.scrollTo(0, 0);
            } else {
                alert?.showAlert("Please Select ALL Required Fields", "error");
            }
        } catch (err) {
            alert?.showAlert("DATABASE ERROR", "error")
            console.error("Error posting Details:", err);
        } finally {
            loading?.showLoading(false);
        }

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
        <>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6"
            >
                <div className="max-w-7xl mx-auto space-y-4">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-8"
                        variants={itemVariants}
                    >
                        <Title title="Electives Control" />
                    </motion.div>
                    <div className="selection">
                        <Autocomplete
                            options={electiveSubjects}
                            getOptionLabel={(option) => `${option.subCode} - ${option.subName}`}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Subject"
                                    variant="outlined"
                                    placeholder="Type to search..."
                                />
                            )}
                            onChange={(_event, value) => {
                                setSelectedSubCode(value?.subCode ? value.subCode : '')
                                console.log(value);
                            }}
                        />
                    </div>
                    <div className="selection">
                        <Autocomplete
                            options={faculty}
                            getOptionLabel={(option) => `${option.facID} - ${option.facName}`}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Faculty"
                                    variant="outlined"
                                    placeholder="Type to search..."
                                />
                            )}
                            onChange={(_event, value) => {
                                setselectedFaculty(value?.facID ? value.facID : '')
                                console.log(value);
                            }}
                        />
                    </div>

                    {/* semesters */}
                    <motion.div
                        key="semesters"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="filter-container mt-4 mb-4"
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

                    {/* sections */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="filter-container mb-4"
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

                    <div className="control-form">
                        {showRollNumbers && (
                            <div className="rollno-container transition-transform transform duration-300 ease-in-out">
                                {filteredStudents.map((student, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleRollNumber(student.rollno)}
                                        className={`rollno-button ${rollNumbers.includes(student.rollno) ? 'selected' : ''} transition-transform transform hover:scale-110 duration-200 ease-in-out`}
                                    >
                                        {student.rollno}
                                    </button>
                                ))}
                            </div>
                        )}


                        {showRollNumbers && (
                            <div className='center mt-3'>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center text-lg gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </motion.button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
}

import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { LoadingContext } from '../../components/Context/Loading';
import { AlertContext } from '../../components/Context/AlertDetails';
import Title from '../../components/Title';
import { Autocomplete, TextField } from '@mui/material';
import "./Electives.css"

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
    const loading = useContext(LoadingContext);
    const alert = useContext(AlertContext);

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

    return (
        <>
            <Title title="Electives Control" />
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
            <div className="control-form">
                <div className="filter-container">
                    <div className="filter-buttons">
                        {sems.map((sem, index) => (
                            <button
                                key={index}
                                onClick={() => handleSemClick(sem)}
                                className={`filter-button ${selectedSem === sem ? 'selected' : ''}`}
                            >
                                Semester {sem}
                            </button>
                        ))}
                    </div>
                    {selectedSem !== null && (
                        <div className="filter-buttons">
                            {secs.map((sec, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSecClick(sec)}
                                    className={`filter-button ${selectedSec === sec ? 'selected' : ''}`}
                                >
                                    Section {sec}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {showRollNumbers && (
                    <div className="rollno-container">
                        {filteredStudents.map((student, index) => (
                            <button
                                key={index}
                                onClick={() => handleRollNumber(student.rollno)}
                                className={`rollno-button ${rollNumbers.includes(student.rollno) ? 'selected' : ''}`}
                            >
                                {student.rollno}
                            </button>
                        ))}
                    </div>
                )}

                {showRollNumbers && (
                    <div className="download-button-container no-print">
                        <button className="download-button" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

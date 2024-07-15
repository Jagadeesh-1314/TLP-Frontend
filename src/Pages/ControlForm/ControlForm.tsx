import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import './ControlForm.css';
import { LoadingContext } from '../../components/Context/Loading';
import { AlertContext } from '../../components/Context/AlertDetails';

interface Student {
    rollno: number;
    name: string;
    sec: string;
    sem: number;
}

export default function ControlForm() {
    const [students, setStudents] = useState<Student[]>([]);
    const [sems, setSems] = useState<number[]>([]);
    const [secs, setSecs] = useState<string[]>([]);
    const [selectedSem, setSelectedSem] = useState<number | null>(null);
    const [selectedSec, setSelectedSec] = useState<string>("");
    const [showRollNumbers, setShowRollNumbers] = useState<boolean>(false);
    const loading = useContext(LoadingContext);
    const alert = useContext(AlertContext);

    useEffect(() => {
        async function fetchStudents() {
            try {
                const response = await Axios.get<{ unfilledstudents: Student[] }>('api/unfilledstudents');
                setStudents(response.data.unfilledstudents);
                const uniqueSems = [...new Set(response.data.unfilledstudents.map(student => student.sem))];
                const sortedSems = uniqueSems.sort((a, b) => a - b);
                setSems(sortedSems);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchStudents();
    }, []);

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

        try {
            const response = await Axios.post(
                `/api/download/unfilledlist?sem=${selectedSem}&sec=${selectedSec}`,
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
                    if (fileNameMatch.length > 1) {
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

    return (
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
                <>
                    <div className="total-count">
                        Total Count: {filteredStudents.length}
                    </div>
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>S. No.</th>
                                <th>Roll No</th>
                                <th>Student Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => (
                                <tr key={student.rollno}>
                                    <td>{index + 1}</td>
                                    <td>{student.rollno}</td>
                                    <td>{student.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="download-button-container">
                        <button className="download-button" onClick={handleDownload}>
                            Download
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}        
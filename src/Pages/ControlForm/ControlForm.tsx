import { useContext, useLayoutEffect, useState } from "react";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel,
    Button
} from "@mui/material";
import "./ControlForm.css";
import Title from "../../components/Title";

export default function ControlForm() {
    const alert = useContext(AlertContext);
    const [fTerm, setFTerm] = useState<number | null>(null);
    const [selectedSem, setSelectedSem] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [semesters, setSemesters] = useState<number[]>([]);
    const [animationClass, setAnimationClass] = useState("");

    const fetchTerm = async () => {
        try {
            const { data } = await Axios.get<{ done: boolean, term: number }>(`api/fetchterm`);
            if (data.done) {
                setAnimationClass("fade-out");
                setFTerm(data.term);
                setTimeout(() => setAnimationClass("fade-in"), 50);
            }
        } catch (error) {
            console.error("Error fetching term:", error);
            alert?.showAlert("Error fetching term", "error");
        }
    };

    useLayoutEffect(() => {
        fetchTerm();
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
        if (selectedSem === null) {
            alert?.showAlert("Please select a semester", "warning");
            return;
        }
        try {
            const { data } = await Axios.post<{ done: boolean }>(`api/promote`, { sem: selectedSem });
            if (data.done) {
                setSelectedSem(null);
                alert?.showAlert(`Students in Semester ${selectedSem} Promoted`, "success");
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
    };

    return (
        <>
            <Title title="Control Term and Promote" />
            <div className="center-button">
                <button className="button" onClick={incrementcount}>
                    SET TERM - 2
                </button>
                <button className="button" onClick={decrementcount}>
                    SET TERM - 1
                </button>
                <button className="button" onClick={handleOpenDialog} disabled={fTerm === 1}>
                    Promote Students
                </button>
            </div>
            <div className={`fterm-container ${animationClass}`}>
                {fTerm !== null ? `Current Term: ${fTerm}` : "Loading current term..."}
            </div>

            {/* Dialog for selecting semester */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
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
                <DialogTitle id="dialog-title">Select YEAR to Promote</DialogTitle>
                <DialogContent id="dialog-description">
                    <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel id="semester-select-label">Semester</InputLabel>
                        <Select
                            labelId="semester-select-label"
                            value={selectedSem?.toString() ?? ""}
                            onChange={(e) => setSelectedSem(Number(e.target.value))}
                            label="Semester"
                        >
                            {semesters.map(sem => (
                                <MenuItem key={sem} value={sem}>
                                    {`Semester ${Math.ceil(sem / 2)} - ${sem % 2 === 0 ? 2 : 1}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="error">Cancel</Button>
                    <Button onClick={promote} color="primary" disabled={selectedSem === null}>
                        Promote
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

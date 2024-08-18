import { useNavigate } from 'react-router-dom';
import "./Sem.css";
import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { useAuth } from '../../components/Auth/AuthProvider';
import { LoadingContext } from '../../components/Context/Loading';
import { AlertContext } from '../../components/Context/AlertDetails';

interface Subjects {
    subCode: string;
    subname: string;
    qtype: string;
    facID: string;
    facName: string;
}

export default function Sem() {
    const navigate = useNavigate();
    const [done, setDone] = useState(false);
    const { user } = useAuth()!;
    const [sub, setSub] = useState<Subjects[]>([]);
    const alert = useContext(AlertContext);

    const semesters = [];
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 2; j++) {
            semesters.push(`${i}-${j}`);
        }
    }
    const loading = useContext(LoadingContext);

    useEffect(() => {
        if (user?.username) {
            loading?.showLoading(true, "Loading data...");
            Axios.get<{ sub: Subjects[], token: string }>(`api/subjects?username=${user.username}`)
                .then(({ data }) => {
                    setSub(data.sub);
                    if (data.sub.length === 0) {
                        alert?.showAlert("No subjects found", "info");
                    } else {
                        alert?.showAlert("Subjects loaded", 'success');
                    }
                })
                .catch((error) => {
                    console.error("Error fetching subjects:", error);
                    alert?.showAlert("Error fetching subjects", "error");
                })
                .finally(() => loading?.showLoading(false));

        }
    }, [user?.username]);

    useEffect(() => {
        if (user?.username) {
            loading?.showLoading(true)
            Axios.post(`api/token?rollno=${user?.username}`)
                .then(({ data }) => {
                    setDone(data.done);
                })
                .catch((e) => {
                    console.error("Error fetching token:", e);
                    alert?.showAlert("Error fetching token", "error");
                })
                .finally(() => {
                    loading?.showLoading(false);
                });
        }
    }, [user?.username]);

    const handleButtonClick = () => {
        loading?.showLoading(true, "Loading data...");
        if (done) {
            navigate("/completed");
            loading?.showLoading(false);
        } else if (sub.length > 0) {
            const storedPage = localStorage.getItem("currentPage");
            console.log(storedPage)
            if (storedPage === "CentralFacilities") {
                navigate("/centralfacilities");
            } else {
                navigate("/feedback");
            }

            loading?.showLoading(false);
        }
    };
    
    return (
        <>
            <div className="container" style={{
                margin: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: 'rgb(219, 238, 238)', borderRadius: '10px'
            }}>
                <form className="sem-container">
                    <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 'x-large', color: 'blue', textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white', padding: '10px', borderBottom: '1px solid black' }}>Academics Feedback</div>
                    <hr />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 2fr)', columnGap: '20px', height: 'max-content', marginTop: '15px' }}>
                        {semesters.map((semesterString, index) => (
                            <div style={{ backgroundColor: 'white', borderRadius: '15px', marginBottom: '20px', width: '30vw', position: 'relative', padding: '5px' }} key={index}>
                                <div style={{ width: '70%', margin: 'auto' }}>
                                    <button
                                        className="button"
                                        style={{ width: '100%' }}
                                        onClick={handleButtonClick}
                                        disabled={semesterString !== ((user && user.sem) 
                                            ? Math.floor((user.sem + 1) / 2).toString() + '-' + (user.sem % 2 !== 0 ? '1' : '2')
                                            : null)}
                                    >
                                        {semesterString}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </form>
            </div>
            <div className="container" style={{
                margin: 'auto', marginTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgb(219, 238, 238)'
            }}>
                <div>
                    <div style={{ textAlign: 'center', width: '100%', fontWeight: 700, fontSize: 'x-large', color: 'blue', textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white', padding: '10px', borderBottom: '1px solid black' }}>Guest Lecture Feedback</div>
                    <div style={{
                        display: 'grid',
                        placeItems: 'center', height: '250px'
                    }}>No Feedbacks</div>
                </div>
            </div>
        </>
    );
}

import { AlertContext } from "../../components/Context/AlertDetails";
import { useContext } from "react";

export default function ControlForm() {
    const alert = useContext(AlertContext);

    return (
        <>
            <button
                type="submit"
                className="blue-button-filled col-span-1 flex items-center gap-2"
                onClick={() => {
                    alert?.showAlert("U Rocked", "success");
                }}
            >
                Activate
            </button>
        </>
    );
}

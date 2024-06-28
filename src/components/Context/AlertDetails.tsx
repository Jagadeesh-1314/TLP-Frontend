import React, { createContext, useState } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface AlertContextProps {
  showAlert: (message: string, severity: AlertColor) => void;
}

interface AlertProps {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export const AlertContext = createContext<AlertContextProps | null>(null);

const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alert, setAlert] = useState<AlertProps>({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (message: string, severity: AlertColor) => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  const handleClose = () => {
    setAlert((prevVals) => ({ ...prevVals, open: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <Snackbar
        open={alert.open}
        onClose={handleClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.severity} variant="standard">
          {alert.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

export default AlertProvider;

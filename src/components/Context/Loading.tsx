import { Backdrop, CircularProgress } from "@mui/material";
import React, { createContext, useState } from "react";

interface LoadingContextProps {
  showLoading: (open: boolean, message?: string) => void;
}

interface LoadingProps {
  open: boolean;
  message?: string;
}

export const LoadingContext = createContext<LoadingContextProps | null>(null);

const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<LoadingProps>({
    message: "Loading Data...",
    open: false,
  });

  const showLoading = (open: boolean, message?: string) => {
    setLoading({ open, message });
  };

  return (
    <LoadingContext.Provider value={{ showLoading }}>
      {children}

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          backdropFilter: "blur(2px)",
        }}
        open={loading.open}
        className="no-print"
      >
        <span className="text-4xl">{loading.message ?? "Loading Data..."}</span>{" "}
        <CircularProgress color="inherit" />
      </Backdrop>
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;

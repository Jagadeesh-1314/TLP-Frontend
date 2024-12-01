import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Typography variant="h1" sx={{ fontSize: "4rem", fontWeight: "bold", color: "#343a40" }}>
        404
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: 2, color: "#6c757d" }}>
        Oops! The page you’re looking for doesn’t exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ marginTop: 2 }}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;

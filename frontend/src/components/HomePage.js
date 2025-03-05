import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, CircularProgress, Alert, Paper, Grid } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./HomePage.css";

const HomePage = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fileSelected, setFileSelected] = useState(false);
    const navigate = useNavigate(); // Hook for navigation

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setFileSelected(true);
        setError(""); // Reset error if new file selected
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a CSV file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:5000/predict_json", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            navigate("/results", { state: { predictions: response.data } }); // Redirect to results page
        } catch (error) {
            console.error("Error uploading file:", error);
            setError("Error uploading file. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="homepage">
            <Container maxWidth="md" className="container">
                <Paper elevation={8} className="upload-box" >
                    <Typography variant="h3" gutterBottom fontSize={40}>
                         Heart Failure Readmission Prediction
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Upload a CSV file to analyze patient data and predict readmission risk.
                    </Typography>

                    <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                        <Grid item>
                            <label className="custom-file-upload">
                                <input type="file" onChange={handleFileChange} />
                                Choose File
                            </label>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpload}
                                startIcon={<CloudUploadIcon />}
                                disabled={loading}
                                className="upload-button"
                            >
                                {loading ? <CircularProgress size={24} /> : "Upload & Predict"}
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Show file selected message */}
                    {fileSelected && (
                        <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="info" sx={{ mt: 2 }}>
                            File "{file.name}" selected successfully!
                        </Alert>
                    )}

                    {/* Error Message */}
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Paper>
            </Container>
        </div>
    );
};

export default HomePage;

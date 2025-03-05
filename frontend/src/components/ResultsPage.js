import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Paper, Button, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./ResultsPage.css";

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const predictions = location.state?.predictions || [];

    return (
        <div className="results-page">
            <Container maxWidth="md">
                <Paper elevation={6} className="results-box">
                    <Typography variant="h4" gutterBottom>
                        📊 Prediction Results
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Here are the predictions for your uploaded file.
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    {predictions.length > 0 ? (
                        predictions.map((item, index) => (
                            <Typography key={index} variant="body1" className="prediction-item">
                                <b>Patient {item.patient_id}:</b> {item.readmitted_prediction === 1 ? "⚠️ High Risk" : "✅ Low Risk"}
                            </Typography>
                        ))
                    ) : (
                        <Typography variant="body1" color="error">
                            No predictions found.
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/")}
                        sx={{ mt: 2 }}
                    >
                        Go Back
                    </Button>
                </Paper>
            </Container>
        </div>
    );
};

export default ResultsPage;

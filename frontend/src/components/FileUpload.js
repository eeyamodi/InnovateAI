import React, { useState } from "react";
import axios from "axios";
import "./FileUpload.css";  // Import the CSS file

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a CSV file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "http://127.0.0.1:5000/predict_json", // Flask API endpoint
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setPredictions(response.data);
        } catch (error) {
            console.error("Error uploading file:", error);
            setError("Error uploading file. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">

            <input className="btnFileUpload" type="file" accept=".csv" onChange={handleFileChange} />
            <button  onClick={handleUpload} disabled={loading}>
                {loading ? "Uploading..." : "Predict"}
            </button>
            {error && <p className="error">{error}</p>}

            {predictions.length > 0 && (
                <div>
                    <h3>Predictions:</h3>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Patient ID</th>
                                <th>Readmission Prediction</th>
                            </tr>
                        </thead>
                        <tbody>
                            {predictions.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.patient_id}</td>
                                    <td>{item.readmitted_prediction}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FileUpload;

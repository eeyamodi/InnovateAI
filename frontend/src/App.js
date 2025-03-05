import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import Contact from "./components/Contact";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import About from "./components/About";

function App() {
    const [showPrediction, setShowPrediction] = useState(false);

    return (
        <Router>  
            <Navbar />

            <Routes>
                <Route path="/" element={
                    <>
                        <div className="website-description">
                            <h2>Welcome to the Health Website</h2>
                            <p>
                            Our platform harnesses the power of cutting-edge AI technology to perform in-depth analysis of patient health data, offering highly accurate predictions on heart failure readmission risks. By leveraging advanced machine learning algorithms, we empower doctors, researchers, and healthcare professionals with actionable insights, enabling them to make data-driven decisions that enhance patient care and improve treatment outcomes.
                            </p>
                            <p>
                            Experience the future of AI-powered healthcare—explore predictive insights, enhance patient outcomes, and drive innovation in medical research with our state-of-the-art platform.
                            </p>
                        </div>

                        {!showPrediction && (
                            <div className="predict-section">
                                <button className="predict-btn" onClick={() => setShowPrediction(true)}>
                                    Predict
                                </button>
                            </div>
                        )}

                        {showPrediction && (
                            <div className="prediction-container">
                                <h2>Heart Failure Readmission Prediction</h2>
                                <FileUpload />
                            </div>
                        )}
                    </>
                } />

                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact/>} />
            </Routes>
        </Router>
    );
}

export default App;

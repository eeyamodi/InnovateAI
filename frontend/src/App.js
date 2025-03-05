import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ResultsPage from "./components/ResultsPage";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Contact from "./components/Contact";
const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage className="home"/>} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/results" element={<ResultsPage />} />
            </Routes>
        </Router>

    );
};

export default App;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import FileUpload from "./components/fileUpload";

// function App() {
//     const [message, setMessage] = useState("");

//     useEffect(() => {
//         axios.get("http://127.0.0.1:5000/")
//             .then(response => setMessage(response.data.message))
//             .catch(error => console.error("Error fetching data:", error));
//     }, []);

//     return (
//         <div>
//             <h1>Uploading the excel file!!!</h1>
//             <FileUpload/>
//         </div>
//     );
// }

// export default App;

import { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/predict_csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPredictions(response.data);
    } catch (err) {
      setError("Error uploading file. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Heart Failure Readmission Predictor</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <input type="file" accept=".csv" onChange={handleFileChange} className="mb-4" />
        <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? "Uploading..." : "Upload & Predict"}
        </button>
      </div>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {predictions.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Predictions</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {Object.keys(predictions[0]).map((key) => (
                  <th key={key} className="border border-gray-300 px-4 py-2">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {predictions.map((row, index) => (
                <tr key={index} className="border border-gray-300">
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="border border-gray-300 px-4 py-2">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
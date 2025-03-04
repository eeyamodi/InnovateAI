import React, { useEffect, useState } from "react";
import axios from "axios";
import FileUpload from "./components/fileUpload";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/")
            .then(response => setMessage(response.data.message))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div>
            <h1>Uploading the excel file!!!</h1>
            <FileUpload/>
        </div>
    );
}

export default App;
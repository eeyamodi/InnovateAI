import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/")
            .then(response => setMessage(response.data.message))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div>
            <h1>Flask + React Integration</h1>
            <p>Message from Flask: {message}</p>
        </div>
    );
}

export default App;
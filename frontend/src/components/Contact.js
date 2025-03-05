import React from "react";
import "./Contact.css";
import team1 from "../assets/DevanshImage.jpeg";
import team2 from "../assets/EeyaImage.jpeg";
import team3 from "../assets/VishakhaImage.jpeg";
import team4 from "../assets/AkshatImage.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

// Team Data
const teamMembers = [
    {
        name: "Devansh Pandey",
        email: "Devanshp1418@gmail.com",
        linkedin: "https://www.linkedin.com/in/devansh-pandey-34559922a/",
        regNo: "219310026",
        branch: "B.Tech[CSE(AIML)]",
        year: "2021 - 2025",
        img: team1,
    },
    {
        name: "Eeya Modi",
        email: "eeyamodi@gmail.com",
        linkedin: "https://www.linkedin.com/in/eeyamodi/",
        regNo: "219301090",
        branch: "B.Tech[CSE-Core]",
        year: "2021 - 2025",
        img: team2,
    },
    {
        name: "Vishakha Singhal",
        email: "vishkahsinghal30@gmail.com",
        linkedin: "https://www.linkedin.com/in/vishakha-singhal-4455b622a/",
        regNo: "219301108",
        branch: "B.Tech[CSE-Core]",
        year: "2021 - 2025",
        img: team3,
    },
    {
        name: "Akshat Jhalani",
        email: "akshat5jhalani@gmail.com",
        linkedin: "https://www.linkedin.com/in/akshat-jhalani05/",
        regNo: "219301256",
        branch: "B.Tech[CSE-Core]",
        year: "2021 - 2025",
        img: team4,
    }
];

const Contact = () => {
    return (
        <div className="contact-container">
            <h2>Meet Our Team</h2>
            <div className="team-grid">
                {teamMembers.map((member, index) => (
                    <div key={index} className="team-card">
                        <img src={member.img} alt={member.name} className="team-img" />
                        <h3>{member.name}</h3>
                        <p className="regNo">{member.regNo}</p> 
                        <p className="regNo">{member.branch}</p>
                        <p className="regNo">{member.year}</p>
                        
                        {/* Social Icons */}
                        <div className="social-icons">
                            <a href={`mailto:${member.email}`} target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faEnvelope} className="icon email-icon" />
                            </a>
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faLinkedin} className="icon linkedin-icon" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Contact;

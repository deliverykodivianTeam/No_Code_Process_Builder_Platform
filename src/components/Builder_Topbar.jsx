import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Builder_Topbar.css";

const Builder_TopBar = () => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        // Implement your profile navigation or logic here
        console.log("Profile clicked");
        navigate("/profile"); // Example: Navigate to /profile
    };

    return (
        <div className="topedbar">
            <div className="logo">
            <img src="/public/assets/logo.png" alt="Logo" className="logo-image" /></div> {/* Replace with your logo */}
            <div className="buttons">
                <button  className="profile-button" onClick={handleProfileClick}>
                <img src="/public/assets/profile.jpg" alt="Logo" className="profile-image" /> </button>

            </div>
        </div>
    );
};

export default Builder_TopBar;
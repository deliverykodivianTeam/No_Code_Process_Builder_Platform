import React from "react";

const NavBar = ({ onClear, onUndo, onRedo, onSave }) => { // Add onSave prop
    return (
        <div className="navbar">
            <img src="/public/assets/logo.png" alt="Logo" className="logo" />
            <button>AI Assistant </button>
            <button>Build</button>
            <button onClick={onClear}>Clear</button>
            <button onClick={onUndo}>Undo</button>
            <button onClick={onRedo}>Redo</button>
            <button>Align</button>
            <button onClick={onSave}>Save</button> {/* Call onSave */}
            <button>Export</button>
            <img
                src="/public/assets/login_logo.png"
                alt="Login_logo"
                className="login_logo"
            />
        </div>
    );
};

export default NavBar;
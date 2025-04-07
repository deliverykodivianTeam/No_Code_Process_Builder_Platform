import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdOutlineDashboardCustomize, MdDarkMode } from "react-icons/md";
import {
  FaBars,
  FaProjectDiagram,
  FaBell,
  FaCogs,
  FaSignOutAlt,
  FaQuestionCircle,
} from "react-icons/fa";

const Sidebar = ({ isExpanded, toggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : ""}`}>
      <div className="sidebar-top">
        <button className="menu-button" onClick={toggleSidebar}>
          <FaBars />
        </button>

        <Link to="/dashboard" className="sidebar-link">
          <button>
            <MdOutlineDashboardCustomize />
            {isExpanded && <span>Dashboard</span>}
          </button>
        </Link>

        <Link to="/project" className="sidebar-link">
          <button className="sidebar-link">
            <FaProjectDiagram />
            {isExpanded && <span>Project</span>}
          </button>
        </Link>
      </div>

      <div className="sidebar-bottom">
        <button className="sidebar-link" onClick={toggleDarkMode}>
          <MdDarkMode />
          {isExpanded && <span>Appearance</span>}
        </button>

        <Link to="/notifications" className="sidebar-link">
          <button className="sidebar-link">
            <FaBell />
            {isExpanded && <span>Notifications</span>}
          </button>
        </Link>

        <Link to="/settings" className="sidebar-link">
          <button className="sidebar-link">
            <FaCogs />
            {isExpanded && <span>Settings</span>}
          </button>
        </Link>

        <Link to="/studio_page" className="sidebar-link">
          <button className="sidebar-link">
            <FaSignOutAlt />
            {isExpanded && <span>Logout</span>}
          </button>
        </Link>

        <Link to="/help" className="sidebar-link">
          <button className="sidebar-link">
            <FaQuestionCircle />
            {isExpanded && <span>Help</span>}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

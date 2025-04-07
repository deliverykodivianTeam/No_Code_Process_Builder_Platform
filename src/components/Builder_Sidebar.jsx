import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTachometerAlt,
  FaFileAlt,
  FaCog,
  FaQuestionCircle,
  FaPlus,
} from "react-icons/fa";
import "../styles/Builder_Sidebar.css";

const Builder_Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sidebox-container">
      <button className="menu-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <nav className={`sidebox ${isOpen ? "open" : "closed"}`}>
        <ul>
          <li  className="dashboard-side">
            <Link to="/builder_dashboard">
              <FaTachometerAlt className="icon" />
              {isOpen && <span>Dashboard</span>}
            </Link>
          </li>
          <li className="form-side">
            <Link to="/builder/new" >
              {" "}
              {/* Link to create new form */}
              <FaPlus className="icon" />
              {isOpen && <span>Create New Form</span>}
            </Link>
          </li>
          <li className="template-side">
            <Link to="/builder_templates" >
              <FaFileAlt className="icon" />
              {isOpen && <span>Templates</span>}
            </Link>
          </li>

          <li className="setting-side">
            <Link to="/builder_settings">
              <FaCog className="icon" />
              {isOpen && <span>Settings</span>}
            </Link>
          </li> 
          <li className="help-side">
            <Link to="/builder_help">
              <FaQuestionCircle className="icon" />
              {isOpen && <span>Help</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Builder_Sidebar;

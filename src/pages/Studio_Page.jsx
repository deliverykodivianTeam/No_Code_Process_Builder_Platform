import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Studio_Page.css"; // Create a CSS file for styling

const Studio_Page = () => {
  return (
    <div className="dashboard-container">
      <h1>Process Builder Studio</h1>
      <div className="options-grid">
        <div className="option">
          <img src="/public/assets/user-groups-icon.png" alt="User and Groups" /> 
          <p>User and Groups</p>
        </div>
        <Link to="/builder" className="option"> 
          <img src="/public/assets/form-builder-icon.png" alt="Form Builder" />
          <p>Form Builder</p>
        </Link>
        <Link to="/project" className="option"> 
          <img src="/public/assets/workflow-icon.png" alt="Workflow" />
          <p>Workflow</p>
        </Link>
        <div className="option">
          <img src="/public/assets/dashboard-reports-icon.png" alt="Dashboard & Reports" />
          <p>Dashboard & Reports</p>
        </div>
        <div className="option">
          <img src="/public/assets/dms-icon.png" alt="DMS" />
          <p>DMS</p>
        </div>
      </div>
    </div>
  );
};

export default Studio_Page;
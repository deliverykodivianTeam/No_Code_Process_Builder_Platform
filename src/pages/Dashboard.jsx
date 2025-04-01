import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedDiagram, setSavedDiagram] = useState(null);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const savedData = localStorage.getItem("savedDiagram");
    if (savedData) {
      setSavedDiagram(JSON.parse(savedData));
    }
  }, []);

  return (
    <div style={{ display: "flex" }}> {/* Use flexbox for layout */}
      <Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
      <div style={{ flex: 1, padding: "20px" }}> {/* Content area with flex grow */}
        {/* Saved Diagram Section */}
        <div>
          <h2>Saved Diagram</h2>
          {savedDiagram ? (
            <div>
              <p>Components: {JSON.stringify(savedDiagram.components)}</p>
              <p>Connections: {JSON.stringify(savedDiagram.connections)}</p>
              {/* You'll replace this with actual diagram rendering later */}
            </div>
          ) : (
            <p>No diagram saved yet.</p>
          )}
        </div>

        {/* Add more dashboard content here if needed */}
      </div>
    </div>
  );
};

export default Dashboard;
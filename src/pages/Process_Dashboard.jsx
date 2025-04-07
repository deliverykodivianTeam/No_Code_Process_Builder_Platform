// Dashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Process_Sidebar";
import { useNavigate } from "react-router-dom";
import "../styles/Process_Dashboard.css";

const Dashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedDiagrams, setSavedDiagrams] = useState([]);
  const navigate = useNavigate();
  const [editingIndex, setEditingIndex] = useState(null); // Track which diagram is being edited
  const [renameInput, setRenameInput] = useState({});

  useEffect(() => {
    const data = localStorage.getItem("savedDiagrams");
    if (data) {
      setSavedDiagrams(JSON.parse(data));
    }
  }, []);

  const handleDelete = (index) => {
    const updatedDiagrams = [...savedDiagrams];
    updatedDiagrams.splice(index, 1);
    localStorage.setItem("savedDiagrams", JSON.stringify(updatedDiagrams));
    setSavedDiagrams(updatedDiagrams);
  };

  const handleEdit = (diagram) => {
    navigate("/project", { state: { diagramData: diagram } });
  };

  const handleCreateNew = () => {
    navigate("/project");
  };

  const handleRename = (index, newName) => {
    const updatedDiagrams = [...savedDiagrams];
    updatedDiagrams[index].name = newName;
    localStorage.setItem("savedDiagrams", JSON.stringify(updatedDiagrams));
    setSavedDiagrams(updatedDiagrams);
    setEditingIndex(null); // Stop editing after renaming
  };

  const handleEditClick = (index) => {
    setEditingIndex(index); // Start editing the clicked diagram
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        isExpanded={isExpanded}
        toggleSidebar={() => setIsExpanded(!isExpanded)}
      />
      <div style={{ flex: 1, padding: "20px" }}>
        <div className="diagram-container">
          <h2>WorkFlow Dashboard</h2>
          {savedDiagrams.length > 0 ? (
            savedDiagrams.map((diagram, index) => (
              <div key={index} className="saved-diagram-item">
                <div style={{ display: "flex", alignItems: "center" }}>
                  {editingIndex === index ? (
                    <>
                      <input
                        type="text"
                        defaultValue={diagram.name || `WorkFlow ${index + 1}`}
                        onChange={(e) =>
                          setRenameInput({
                            ...renameInput,
                            [index]: e.target.value,
                          })
                        }
                        style={{ marginRight: "10px" }}
                      />
                      <button
                        onClick={() => handleRename(index, renameInput[index])}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <p>{diagram.name || `WorkFlow ${index + 1}`}</p>
                      <button onClick={() => handleEditClick(index)}>+</button>
                    </>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <button
                    className="delete"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                  <button className="edit" onClick={() => handleEdit(diagram)}>
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No diagrams saved yet.</p>
          )}
        </div>
        <button className="create-new" onClick={handleCreateNew}>
          + Create New Diagram
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

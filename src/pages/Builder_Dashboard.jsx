import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Builder_TopBar from "../components/Builder_Topbar";
import "../styles/Builder_Dashboard.css";
import Builder_Sidebar from "../components/Builder_Sidebar";

const Builder_Dashboard = () => {
  const [savedForms, setSavedForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const forms = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("savedForm-")) {
        const formData = localStorage.getItem(key);
        if (formData) {
          const parsedData = JSON.parse(formData);
          forms.push({ id: key.replace("savedForm-", ""), ...parsedData });
        }
      }
    }
    setSavedForms(forms);
  }, []);

  const handleDeleteForm = (id) => {
    localStorage.removeItem(`savedForm-${id}`);
    setSavedForms(savedForms.filter((form) => form.id !== id));
  };

  const handleEditForm = (id) => {
    const formToEdit = savedForms.find((form) => form.id === id);
    if (formToEdit) {
      navigate(`/builder/${id}`, { state: { formData: formToEdit } });
    }
  };

  const renderFormCard = (form) => {
    return (
      <div
        key={form.id}
        className="form-card"
        onClick={() => handleEditForm(form.id)}
        style={{ cursor: "pointer" }}
      >
        <h3>{form.formName}</h3>
        <div className="form-actions">
          <button onClick={() => handleDeleteForm(form.id)}>Delete</button>
          <button onClick={() => handleEditForm(form.id)}>Edit</button>
        </div>
      </div>
    );
  };

  return (
    <div className="content-area">
      <Builder_TopBar />
      <Builder_Sidebar />
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="form-grid">
        {savedForms.length > 0 ? (
          savedForms.map(renderFormCard)
        ) : (
          <p>No forms have been created yet.</p>
        )}
      </div>
    </div>
  );
};

export default Builder_Dashboard;

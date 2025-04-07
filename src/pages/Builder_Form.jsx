import React from "react";
import { useLocation, useParams } from "react-router-dom";
import DragDropBuilder from "../components/DragDropBuilder";
import "../styles/Builder.css";
import Builder_Sidebar from "../components/Builder_Sidebar";


const Builder_Form = () => {
    const location = useLocation();
    const { id } = useParams();
    const formData = location.state?.formData;
    const initialFormData = id === "new" ? null : formData;

    return (
        <div className="content-area">
        
            <Builder_Sidebar></Builder_Sidebar>
            <DragDropBuilder initialFormData={initialFormData} />
        </div>
    );
};

export default Builder_Form;

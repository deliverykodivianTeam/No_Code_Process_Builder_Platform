import React from "react";
import Builder_Sidebar from "../components/Builder_Sidebar";
import Builder_Topbar from "../components/Builder_Topbar";


const Builder_Settings = () => {
  return (
    <div className="content-area">
      <Builder_Topbar></Builder_Topbar>
      <Builder_Sidebar />
      <h1>Setting Page</h1>
      <p>This is the Setting page.</p>
    </div>
  );
};

export default Builder_Settings;

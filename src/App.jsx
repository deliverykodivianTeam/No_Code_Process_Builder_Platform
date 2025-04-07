import React from "react";
import { BrowserRouter as Router, Routes, Route, Form } from "react-router-dom";
import Login from "./components/Login";
import Process_WhiteSpace from "./components/Process_WhiteSpace";
import Process_Dashboard from "./pages/Process_Dashboard";
import Process_Logout from "./pages/Process_Logout";
import Process_Help from "./pages/Process_Help";
import Process_Settings from "./pages/Process_Settings";
import Process_Notifications from "./pages/Process_Notifications";

import "./styles/App.css";
import "./styles/Process_NavBar.css";
import "./styles/Process_Sidebar.css";
import "./styles/Process_Toolbar.css";
import "./styles/Process_Whitespace.css";
import Builder_Dashboard from "./pages/Builder_Dashboard";
import Builder_Templates from "./pages/Builder_Templates";
import Builder_Settings from "./pages/Builder_Settings";
import Builder_Help from "./pages/Builder_Help";
import Studio_Page from "./pages/Studio_Page";
import Builder_Form from "./pages/Builder_Form";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/builder" element={<Builder_Form />} />
        <Route path="/builder/:id" element={<Builder_Form />} />
        <Route path="/builder/new" element={<Builder_Form />} />
        <Route path="/builder_templates" element={<Builder_Templates />} />
        <Route path="/builder_settings" element={<Builder_Settings />} />
        <Route path="/builder_help" element={<Builder_Help />} />
        <Route path="/builder_dashboard" element={<Builder_Dashboard />} />
        <Route path="/studio_page" element={<Studio_Page />} />
        <Route path="/project" element={<Process_WhiteSpace />} />
        <Route path="/dashboard" element={<Process_Dashboard />} />
        <Route path="/logout" element={<Process_Logout />} />
        <Route path="/help" element={<Process_Help />} />
        <Route path="/notifications" element={<Process_Notifications />} />
        <Route path="/settings" element={<Process_Settings />} />
      </Routes>
    </Router>
  );
}

export default App;

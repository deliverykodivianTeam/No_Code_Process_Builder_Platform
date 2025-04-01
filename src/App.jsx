// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import WhiteSpace from "./components/WhiteSpace";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";

import "./styles/App.css";
import "./styles/NavBar.css";
import "./styles/Sidebar.css";
import "./styles/Toolbar.css";
import "./styles/WhiteSpace.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/project" element={<WhiteSpace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logout" element={<Logout/>}/>
        <Route path="/help" element={<Help/>}/>
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState } from "react";
import Sidebar from "../components/Process_Sidebar";

const Notifications = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
      {/* Add your dashboard content here */}
    </div>
  );
};

export default Notifications;

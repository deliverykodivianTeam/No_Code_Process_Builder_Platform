// Toolbar.jsx

import React from "react";

const Toolbar = ({
  toolboxPosition,
  isDragging,
  dragOffset,
  activeDrag,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleDragStart,
  handleConnectClick,
}) => {
  return (
    <div
      className="toolbox"
      style={{
        top: `${toolboxPosition.top}px`,
        left: `${toolboxPosition.left}px`,
        position: "absolute",
        cursor: isDragging ? "grabbing" : "grab",
        display: "flex", // Enable flexbox
        flexDirection: "column", // Arrange children in a column
        alignItems: "center",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="toolbox-header">Drag Me</div>
      <div
        className="draggable start"
        draggable
        onDragStart={(e) => handleDragStart(e, "start")}
      >
        🔵 Start
      </div>
      <div
        className="draggable activity"
        draggable
        onDragStart={(e) => handleDragStart(e, "activity")}
      >
        🟡 Activity
      </div>
      <div
        className="draggable end"
        draggable
        onDragStart={(e) => handleDragStart(e, "end")}
      >
        🔴 End
      </div>
      <div
        className="draggable exclusive"
        draggable
        onDragStart={(e) => handleDragStart(e, "exclusive")}
      >
        🔷 Exclusive
      </div>
      <div
        className="draggable parallel"
        draggable
        onDragStart={(e) => handleDragStart(e, "parallel")}
      >
        🟣 Parallel
      </div>
      <div
        className="draggable inclusive"
        draggable
        onDragStart={(e) => handleDragStart(e, "inclusive")}
      >
        🟠 Inclusive
      </div>
      <div
        className="draggable event-based"
        draggable
        onDragStart={(e) => handleDragStart(e, "event-based")}
      >
        🔘 Event-Based
      </div>
      <div>
        <button onClick={handleConnectClick} className="draggable">
          Connect
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
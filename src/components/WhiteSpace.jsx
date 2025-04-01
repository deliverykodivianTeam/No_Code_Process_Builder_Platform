import React, { useState, useRef } from "react";
import { throttle } from "lodash";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import NavBar from "./NavBar";
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";

const WhiteSpace = () => {
  const [components, setComponents] = useState([]);
  const [connections, setConnections] = useState([]);
  const canvasRef = useRef(null);
  const componentRefs = useRef(new Map());

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);

  const [history, setHistory] = useState([{ components: [], connections: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [toolboxPosition, setToolboxPosition] = useState({ top: 80, left: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [activeDrag, setActiveDrag] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
    setToolboxPosition((prevPosition) => ({
      ...prevPosition,
      left: isExpanded ? prevPosition.left - 120 : prevPosition.left + 120,
    }));
  };

  const handleDragStart = (event, type) => {
    event.dataTransfer.setData("componentType", type);
    setActiveDrag(type);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("componentType");
    const canvasRect = canvasRef.current.getBoundingClientRect();

    const newComponent = {
      id: Date.now(),
      type,
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top,
      text: type === "activity" ? "New Activity" : "",
    };

    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    updateHistory(newComponents, connections);
  };

  const handleDragOver = (event) => event.preventDefault();

  const handleDrag = (event, id) => {
    event.preventDefault();
    const canvasRect = canvasRef.current.getBoundingClientRect();

    const newComponents = components.map((comp) =>
      comp.id === id
        ? {
            ...comp,
            x: event.clientX - canvasRect.left,
            y: event.clientY - canvasRect.top,
          }
        : comp
    );
    setComponents(newComponents);
    updateHistory(newComponents, connections);
  };

  const handleComponentClick = (id) => {
    if (isConnecting) {
      if (connectionStart) {
        setConnections([...connections, { start: connectionStart, end: id }]);
        setConnectionStart(null);
        setIsConnecting(false);
      } else {
        setConnectionStart(id);
      }
    }
  };

  const handleConnectorClick = (event, componentId, isStartConnector) => {
    event.stopPropagation();
    if (isConnecting) {
      if (connectionStart) {
        setConnections([
          ...connections,
          { start: connectionStart, end: componentId },
        ]);
        setConnectionStart(null);
        setIsConnecting(false);
      } else {
        setConnectionStart(componentId);
      }
    }
  };

  const updateHistory = (newComponents, newConnections) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ components: newComponents, connections: newConnections });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleClear = () => {
    setComponents([]);
    setConnections([]);
    updateHistory([], []);
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setComponents(history[historyIndex + 1].components);
      setConnections(history[historyIndex + 1].connections);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setComponents(history[historyIndex - 1].components);
      setConnections(history[historyIndex - 1].connections);
    }
  };

  const handleConnectClick = () => setIsConnecting(true);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    dragOffset.current = {
      x: event.clientX - toolboxPosition.left,
      y: event.clientY - toolboxPosition.top,
    };
  };

  const handleMouseMove = throttle((event) => {
    if (!isDragging || activeDrag) return;
    setToolboxPosition({
      left: event.clientX - dragOffset.current.x,
      top: event.clientY - dragOffset.current.y,
    });
  }, 16);

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveDrag(null);
  };

  // New Save Function
  const handleSave = () => {
    const diagramData = {
      components: components,
      connections: connections,
    };
    localStorage.setItem("savedDiagram", JSON.stringify(diagramData)); // Simple save
    navigate("/dashboard"); // Go to dashboard
  };

  return (
    <div
      className="app-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <NavBar
        onClear={handleClear}
        onRedo={handleRedo}
        onUndo={handleUndo}
        onSave={handleSave} // Pass handleSave
      />
      <Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
      <div
        className="canvas"
        ref={canvasRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {components.map((comp) => (
          <div
            key={comp.id}
            ref={(el) => componentRefs.current.set(comp.id, el)}
            className={`dropped-component ${comp.type}`}
            style={{
              top: `${comp.y}px`,
              left: `${comp.x}px`,
              position: "absolute",
              background:
                comp.type === "start"
                  ? "#4caf50"
                  : comp.type === "activity"
                  ? "#ffeb3b"
                  : comp.type === "end"
                  ? "#f44336"
                  : comp.type === "exclusive"
                  ? "#2196f3"
                  : comp.type === "parallel"
                  ? "#9c27b0"
                  : comp.type === "inclusive"
                  ? "#ff9800"
                  : "#607d8b",
              padding: "10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            draggable
            onDrag={(e) => handleDrag(e, comp.id)}
            onClick={() => handleComponentClick(comp.id)}
          >
            {comp.type === "activity" ? (
              <input type="text" defaultValue={comp.text} />
            ) : (
              comp.type
            )}
            <div
              className="start-connector"
              onClick={(e) => handleConnectorClick(e, comp.id, true)}
              style={{
                position: "absolute",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "black",
                left: "-5px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            ></div>
            <div
              className="end-connector"
              onClick={(e) => handleConnectorClick(e, comp.id, false)}
              style={{
                position: "absolute",
                width: "5px",
                height: "20px",
                background: "black",
                right: "-2.5px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            ></div>
          </div>
        ))}

        {connections.map((connection, index) => {
          const startElement = componentRefs.current.get(connection.start);
          const endElement = componentRefs.current.get(connection.end);

          if (!startElement || !endElement) return null;

          const startConnector = startElement.querySelector(".end-connector");
          const endConnector = endElement.querySelector(".start-connector");

          if (!startConnector || !endConnector) return null;

          const startRect = startConnector.getBoundingClientRect();
          const endRect = endConnector.getBoundingClientRect();
          const canvasRect = canvasRef.current.getBoundingClientRect();

          const startX = startRect.left + startRect.width / 2 - canvasRect.left;
          const startY = startRect.top + startRect.height / 2 - canvasRect.top;
          const endX = endRect.left + endRect.width / 2 - canvasRect.left;
          const endY = endRect.top + endRect.height / 2 - canvasRect.top;

          return (
            <svg
              key={index}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="black"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            </svg>
          );
        })}
      </div>

      <Toolbar
        toolboxPosition={toolboxPosition}
        isDragging={isDragging}
        dragOffset={dragOffset}
        activeDrag={activeDrag}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        handleDragStart={handleDragStart}
        handleConnectClick={handleConnectClick}
      />
    </div>
  );
};

export default WhiteSpace;

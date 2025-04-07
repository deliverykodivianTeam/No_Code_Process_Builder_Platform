import React, { useState, useRef, useEffect } from "react";
import { throttle } from "lodash";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "./Process_NavBar";
import Toolbar from "./Process_Toolbar";
import Sidebar from "./Process_Sidebar";
import "../styles/Process_Whitespace.css";

const WhiteSpace = () => {
  const [components, setComponents] = useState([]);
  const [connections, setConnections] = useState([]);
  const canvasRef = useRef(null);
  const componentRefs = useRef(new Map());

  const [connectionStart, setConnectionStart] = useState(null);
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [hoveredComponentId, setHoveredComponentId] = useState(null);

  const [history, setHistory] = useState([{ components: [], connections: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [toolboxPosition, setToolboxPosition] = useState({ top: 80, left: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [activeDrag, setActiveDrag] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.diagramData) {
      const { diagramData } = location.state;
      setComponents(diagramData.components);
      setConnections(diagramData.connections);
    }
  }, [location.state]);

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
    try {
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
    } catch (error) {
      console.error("Error during drop:", error);
    }
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
    if (connectionStart) {
      if (connectionStart !== id) {
        setConnections([...connections, { start: connectionStart, end: id }]);
        setConnectionStart(null);
      }
    } else {
      setConnectionStart(id);
    }
    setSelectedComponentId(selectedComponentId === id ? null : id);
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

  const handleSave = () => {
    const diagramData = {
      components: components,
      connections: connections,
    };

    let savedDiagrams = JSON.parse(localStorage.getItem("savedDiagrams")) || [];

    if (location.state && location.state.diagramData) {
      const index = savedDiagrams.findIndex(
        (diagram) =>
          JSON.stringify(diagram) === JSON.stringify(location.state.diagramData)
      );
      if (index !== -1) {
        savedDiagrams[index] = diagramData;
      } else {
        savedDiagrams.push(diagramData);
      }
    } else {
      savedDiagrams.push(diagramData);
    }

    localStorage.setItem("savedDiagrams", JSON.stringify(savedDiagrams));
    navigate("/dashboard");
  };

  const handleMouseEnter = (id) => {
    setHoveredComponentId(id);
  };

  const handleMouseLeave = () => {
    setHoveredComponentId(null);
  };

  const checkIntersection = (lineStart, lineEnd, rect) => {
    const { left, top, width, height } = rect;
    const { x: x1, y: y1 } = lineStart;
    const { x: x2, y: y2 } = lineEnd;

    // Check if line intersects with rectangle's edges
    return (
      (y1 <= top &&
        y2 >= top &&
        x1 + ((top - y1) / (y2 - y1)) * (x2 - x1) >= left &&
        x1 + ((top - y1) / (y2 - y1)) * (x2 - x1) <= left + width) ||
      (y1 >= top + height &&
        y2 <= top + height &&
        x1 + ((top + height - y1) / (y2 - y1)) * (x2 - x1) >= left &&
        x1 + ((top + height - y1) / (y2 - y1)) * (x2 - x1) <= left + width) ||
      (x1 <= left &&
        x2 >= left &&
        y1 + ((left - x1) / (x2 - x1)) * (y2 - y1) >= top &&
        y1 + ((left - x1) / (x2 - x1)) * (y2 - y1) <= top + height) ||
      (x1 >= left + width &&
        x2 <= left + width &&
        y1 + ((left + width - x1) / (x2 - x1)) * (y2 - y1) >= top &&
        y1 + ((left + width - x1) / (x2 - x1)) * (y2 - y1) <= top + height)
    );
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
        onSave={handleSave}
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
            }}
            draggable
            onDrag={(e) => handleDrag(e, comp.id)}
            onClick={() => handleComponentClick(comp.id)}
            onMouseEnter={() => handleMouseEnter(comp.id)}
            onMouseLeave={handleMouseLeave}
          >
            {comp.type === "activity" && (
              <input
                type="text"
                value={comp.text}
                onChange={(e) => {
                  const updatedComponents = components.map((c) =>
                    c.id === comp.id ? { ...c, text: e.target.value } : c
                  );
                  setComponents(updatedComponents);
                  updateHistory(updatedComponents, connections);
                }}
                style={{
                  background: "transparent",
                  border: "2px dashed black",
                  height: "50px",
                  margin: "-5px",
                }}
              />
            )}
            {comp.type === "exclusive" && (
              <div className="exclusive-rhombus">
                <input type="text" defaultValue={comp.text} />
              </div>
            )}
            {(selectedComponentId === comp.id ||
              hoveredComponentId === comp.id) && (
              <>
                <div className="connector-point top" />
                <div className="connector-point bottom" />
                <div className="connector-point left" />
                <div className="connector-point right" />
              </>
            )}
          </div>
        ))}
        {connections.map((connection, index) => {
          const startElement = componentRefs.current.get(connection.start);
          const endElement = componentRefs.current.get(connection.end);

          if (!startElement || !endElement) return null;

          const startRect = startElement.getBoundingClientRect();
          const endRect = endElement.getBoundingClientRect();
          const canvasRect = canvasRef.current.getBoundingClientRect();

          let startX, startY, endX, endY;

          // Calculate closest edges for connections
          if (startRect.left + startRect.width < endRect.left) {
            startX = startRect.right - canvasRect.left;
            startY = startRect.top + startRect.height / 2 - canvasRect.top;
            endX = endRect.left - canvasRect.left;
            endY = endRect.top + endRect.height / 2 - canvasRect.top;
          } else if (startRect.left > endRect.left + endRect.width) {
            startX = startRect.left - canvasRect.left;
            startY = startRect.top + startRect.height / 2 - canvasRect.top;
            endX = endRect.right - canvasRect.left;
            endY = endRect.top + endRect.height / 2 - canvasRect.top;
          } else if (startRect.top + startRect.height < endRect.top) {
            startX = startRect.left + startRect.width / 2 - canvasRect.left;
            startY = startRect.bottom - canvasRect.top;
            endX = endRect.left + endRect.width / 2 - canvasRect.left;
            endY = endRect.top - canvasRect.top;
          } else {
            startX = startRect.left + startRect.width / 2 - canvasRect.left;
            startY = startRect.top - canvasRect.top;
            endX = endRect.left + endRect.width / 2 - canvasRect.left;
            endY = endRect.bottom - canvasRect.top;
          }

          // Check for obstacles
          let obstacleFound = false;
          let obstacleRect = null;
          for (const comp of components) {
            if (comp.id !== connection.start && comp.id !== connection.end) {
              const compRect = componentRefs.current
                .get(comp.id)
                .getBoundingClientRect();
              const canvasCompRect = {
                left: compRect.left - canvasRect.left,
                top: compRect.top - canvasRect.top,
                width: compRect.width,
                height: compRect.height,
              };

              if (
                checkIntersection(
                  { x: startX, y: startY },
                  { x: endX, y: endY },
                  canvasCompRect
                )
              ) {
                obstacleFound = true;
                obstacleRect = canvasCompRect;
                break;
              }
            }
          }

          // Render connection with obstacle avoidance
          if (obstacleFound) {
            let midY = obstacleRect.top - 20; // Go above obstacle
            if (startY > obstacleRect.top) {
              midY = obstacleRect.top + obstacleRect.height + 20; // Go below obstacle
            }

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
                <defs>
                  <marker
                    id="circle"
                    markerWidth="6"
                    markerHeight="6"
                    refX="3"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <circle cx="3" cy="3" r="3" fill="black" />
                  </marker>
                </defs>
                <path
                  d={`M ${startX} ${startY} V ${midY} H ${endX} V ${endY}`}
                  stroke="black"
                  strokeWidth="2"
                  markerStart="url(#circle)"
                  markerEnd="url(#circle)"
                  fill="none"
                />
              </svg>
            );
          } else {
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
                <defs>
                  <marker
                    id="circle"
                    markerWidth="6"
                    markerHeight="6"
                    refX="3"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <circle cx="3" cy="3" r="3" fill="black" />
                  </marker>
                </defs>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="black"
                  strokeWidth="2"
                  markerStart="url(#circle)"
                  markerEnd="url(#circle)"
                />
              </svg>
            );
          }
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
      />
    </div>
  );
};

export default WhiteSpace;

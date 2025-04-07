import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from 'react-router-dom';
import "../styles/DragDropBuilder.css";

const DragDropBuilder = ({ initialFormData }) => {
    const [formElements, setFormElements] = useState([]);
    const [settings, setSettings] = useState({});
    const [activeSettingIndex, setActiveSettingIndex] = useState(null);
    const [formName, setFormName] = useState(initialFormData?.formName || '');
    const [fileOptionsVisible, setFileOptionsVisible] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const navigate = useNavigate();
    const [saveFileName, setSaveFileName] = useState("");
    const [saveFileNameInputVisible, setSaveFileNameInputVisible] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [isUndoRedo, setIsUndoRedo] = useState(false);

    useEffect(() => {
        if (initialFormData) {
            setFormElements(initialFormData.formElements);
            setSettings(initialFormData.settings);
            setFormName(initialFormData.formName);
        }
        setHistory([]);
        setHistoryIndex(-1);
    }, [initialFormData]);

    useEffect(() => {
        if (!isUndoRedo) {
            const newState = { formElements, settings, formName };
            setHistory(prevHistory => [...prevHistory.slice(0, historyIndex + 1), newState]);
            setHistoryIndex(prevHistory => prevHistory.length - 1);
        }
        setIsUndoRedo(false); // Reset undo/redo flag
    }, [formElements, settings, formName, historyIndex]);

    const elements = [
        { id: "header", label: "Header", type: "header" },
        { id: "text", label: "Text Input", type: "text" },
        { id: "textarea", label: "Textarea", type: "textarea" },
        { id: "number", label: "Number", type: "number" },
        { id: "date", label: "Date", type: "date" },
        { id: "select", label: "Dropdown", type: "select" },
        { id: "checkbox", label: "Checkbox", type: "checkbox" },
        { id: "radio", label: "Radio Button", type: "radio" },
        { id: "file", label: "File Upload", type: "file" },
        { id: "button", label: "Button", type: "button" },
        { id: "table", label: "Table", type: "table" },
    ];

    const addOption = (id) => {
        setSettings((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                options: [...(prev[id]?.options || []), ""],
            },
        }));
    };

    const addColumn = (id) => {
        setSettings(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                columns: [...(prev[id]?.columns || []), { id: uuidv4(), label: '', type: 'text', options: [] }],
            },
        }));
    };

    const removeColumn = (id, colId) => {
        setSettings(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                columns: prev[id]?.columns.filter(col => col.id !== colId),
            },
        }));
    };

    const removeOption = (id, index) => {
        setSettings((prev) => {
            const newOptions = [...(prev[id]?.options || [])];
            newOptions.splice(index, 1);
            return { ...prev, [id]: { ...prev[id], options: newOptions } };
        });
    };

    const handleOptionChange = (id, index, value) => {
        setSettings((prev) => {
            const newOptions = [...(prev[id]?.options || [])];
            newOptions[index] = value;
            return { ...prev, [id]: { ...prev[id], options: newOptions } };
        });
    };

    const saveSettings = (id) => {
        setSettings((prev) => {
            const newSettings = { ...prev };
            newSettings[id] = { ...prev[id] };
            return newSettings;
        });
        setActiveSettingIndex(null);
    };

    const handleColumnChange = (id, colId, field, value) => {
        setSettings(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                columns: prev[id]?.columns.map(col => col.id === colId ? { ...col, [field]: value } : col),
            },
        }));
    };

    const handleAddRow = (tableId) => {
        setSettings(prev => ({
            ...prev,
            [tableId]: {
                ...prev[tableId],
                rows: [...(prev[tableId]?.rows || []), {}],
            },
        }));
    };

    const handleRowChange = (tableId, rowIndex, colId, value) => {
        setSettings(prev => ({
            ...prev,
            [tableId]: {
                ...prev[tableId],
                rows: prev[tableId]?.rows.map((row, index) =>
                    index === rowIndex ? { ...row, [colId]: value } : row
                ),
            },
        }));
    };

    const handleRemoveRow = (tableId, rowIndex) => {
        setSettings(prev => ({
            ...prev,
            [tableId]: {
                ...prev[tableId],
                rows: prev[tableId]?.rows.filter((_, index) => index !== rowIndex),
            },
        }));
    };

    const handleDragStart = (e, element) => {
        e.dataTransfer.setData("element", JSON.stringify(element));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("element");
        if (!data) return;
        const element = JSON.parse(data);
        const newId = `field-${Date.now()}`;
        setFormElements([...formElements, { ...element, id: newId }]);
        setSettings({
            ...settings,
            [newId]: { label: element.label, placeholder: "", required: false, options: [] },
        });
    };

    const handleDragStartDropped = (e, index) => {
        e.dataTransfer.setData("draggedIndex", index);
    };

    const handleDropReorder = (e, targetIndex) => {
        e.preventDefault();
        const draggedIndex = e.dataTransfer.getData("draggedIndex");
        if (draggedIndex === "") return;

        const newElements = [...formElements];
        const [movedElement] = newElements.splice(draggedIndex, 1);
        newElements.splice(targetIndex, 0, movedElement);

        setFormElements(newElements);
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleDelete = (id) => {
        setFormElements(formElements.filter((el) => el.id !== id));
        setSettings((prevSettings) => {
            const newSettings = { ...prevSettings };
            delete newSettings[id];
            return newSettings;
        });
    };

    const handleSettingsChange = (id, field, value) => {
        setSettings({ ...settings, [id]: { ...settings[id], [field]: value } });
    };

    const toggleSettings = (id) => {
        setActiveSettingIndex(activeSettingIndex === id ? null : id);
    };

    const handleSave = () => {
        if (!formName) {
            setSaveError("Please enter a form name.");
            return;
        }

        if (formElements.length === 0) {
            setSaveError("Please add form elements.");
            return;
        }

        const formId = initialFormData ? initialFormData.id : uuidv4();
        const formData = { formName, formElements, settings };

        try {
            localStorage.setItem(`savedForm-${formId}`, JSON.stringify(formData));
            setSaveError("");
            navigate(0);
        } catch (error) {
            console.error("Error saving to localStorage:", error);
            setSaveError("Error saving form. Please check console.");
        }
    };

    const handleExport = () => {
        let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Generated Form</title>
        <style>
            label { display: block; margin-bottom: 5px; }
            input, textarea, select, table, th, td, button { margin-bottom: 10px; padding: 5px; border: 1px solid #ccc; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; }
            
        </style>
    </head>
    <body>
        <h1>Generated Form</h1>
        <form id="generatedForm">
    `;
        formElements.forEach(element => {
            const elementSettings = settings?.[element.id];
            if (!elementSettings) return;
            html += `<label>${elementSettings.label}:</label>`;
            if (element.type === "table") {
                html += `
                    <table>
                        <thead>
                            <tr>
                `;
                elementSettings.columns?.forEach(col => {
                    html += `<th>${col.label}</th>`;
                });
                html += `
                                
                            </tr>
                        </thead>
                        <tbody>
                `;
                elementSettings.rows?.forEach((row, rowIndex) => {
                    html += `<tr>`;
                    elementSettings.columns?.forEach(col => {
                        html += `<td><input type="${col.type}" name="${element.id}-${col.id}-${rowIndex}" value="${row[col.id] || ''}" onchange="updateRow('${element.id}', ${rowIndex}, '${col.id}', this.value)" /></td>`;
                    });
                    html += `<td><button type="button" onclick="removeRow('${element.id}', ${rowIndex})">Remove</button></td>`;
                    html += `</tr>`;
                });
                html += `
                        </tbody>
                        
                    </table>
                    <button type="button" onclick="addRow('${element.id}')">Add Row</button>
                `;

                html += `<script>
                function addRow(tableId) {
                    const table = document.querySelector('table');
                    const newRow = table.insertRow();
                    const columnCount = table.rows[0].cells.length -1;
                    for(let i=0; i < columnCount; i++){
                        const newCell = newRow.insertCell();
                        newCell.innerHTML = '<input type="text" />';
                    }
                    const removeCell = newRow.insertCell();
                    removeCell.innerHTML = '<button type="button" onclick="removeRow(\''+tableId+'\', '+ (table.rows.length-2) +')">Remove</button>';
                }

                function updateRow(tableId, rowIndex, colId, value) {
                    const table = document.querySelector('table');
                    const input = table.rows[rowIndex + 1].cells.find(cell => cell.querySelector('input') && cell.querySelector('input').name.includes(colId)).querySelector('input');
                    if(input){
                        input.value = value;
                    }
                }

                function removeRow(tableId, rowIndex) {
                    const table = document.querySelector('table');
                    table.deleteRow(rowIndex + 1);
                }
            </script>`;
            } else {
                switch (element.type) {
                    case "text":
                    case "number":
                        html += `<input type="${element.type}" name="${element.id}" placeholder="${settings[element.id]?.placeholder || ''}" ${settings[element.id]?.required ? 'required' : ''}><br>`;
                        break;
                    case "textarea":
                        html += `<textarea name="${element.id}" placeholder="${settings[element.id]?.placeholder || ''}" ${settings[element.id]?.required ? 'required' : ''}></textarea><br>`;
                        break;
                    case "select":
                        html += `<select name="${element.id}" ${settings[element.id]?.required ? 'required' : ''}>`;
                        settings[element.id]?.options?.forEach(option => {
                            html += `<option value="${option}">${option}</option>`;
                        });
                        html += `</select><br>`;
                        break;
                    case "checkbox":
                        settings[element.id]?.options?.forEach(option => {
                            html += `<label><input type="checkbox" name="${element.id}" value="${option}" ${settings[element.id]?.required ? 'required' : ''}>${option}</label><br>`;
                        });
                        break;
                    case "radio":
                        settings[element.id]?.options?.forEach(option => {
                            html += `<label><input type="radio" name="${element.id}" value="${option}" ${settings[element.id]?.required ? 'required' : ''}>${option}</label><br>`;
                        });
                        break;
                    default:
                        break;
                }
            }
        });
        html += `
<button type="button" onclick="saveFormData()">Save</button>
</form>
<script>
function saveFormData() {
    const form = document.getElementById('generatedForm');
    const formData = {};
    for (const element of form.elements) {
        if (element.name) {
            if (element.type === 'checkbox') {
                if (formData[element.name]) {
                    if (element.checked) {
                        formData[element.name].push(element.value);
                    }
                } else {
                    if (element.checked) {
                        formData[element.name] = [element.value];
                    } else {
                        formData[element.name] = [];
                    }
                }
            } else if (element.type === 'radio') {
                if (element.checked) {
                    formData[element.name] = element.value;
                }
            } else {
                formData[element.name] = element.value;
            }
        }
    }
    console.log('Form Data:', formData);
    form.reset();
}
</script>
</body>
</html>
    `;

        const newWindow = window.open("", "_blank");
        if (newWindow) {
            newWindow.document.open();
            newWindow.document.write(html);
            newWindow.document.close();
        } else {
            alert("Please allow pop-ups for this site to export data.");
        }
    };

    const handleSaveFile = () => {
        setSaveFileNameInputVisible(true);
        setFileOptionsVisible(false);
    };

    const handleSavedFile = () => {
        navigate('/Builder_dashboard');
        setFileOptionsVisible(false);
    };

    const handleClear = () => {
        setFormElements([]);
        setSettings({});
        setFormName('');
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setIsUndoRedo(true);
            setHistoryIndex(historyIndex - 1);
            setFormElements(history[historyIndex - 1].formElements);
            setSettings(history[historyIndex - 1].settings);
            setFormName(history[historyIndex - 1].formName);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setIsUndoRedo(true);
            setHistoryIndex(historyIndex + 1);
            setFormElements(history[historyIndex + 1].formElements);
            setSettings(history[historyIndex + 1].settings);
            setFormName(history[historyIndex + 1].formName);
        }
    };

    const handleSaveFileConfirm = () => {
        if (!saveFileName) {
            setSaveError("Please enter a file name.");
            return;
        }

        const isDuplicate = Object.keys(localStorage).some(key => {
            const storedForm = localStorage.getItem(key);
            if (storedForm) {
                const storedFormObject = JSON.parse(storedForm);
                return storedFormObject.formName === saveFileName;
            }
            return false;
        });

        if (isDuplicate) {
            setSaveError("File name already exists. Please choose a unique name.");
            return;
        }
        setFormName(saveFileName);
        handleSave();
        setSaveFileNameInputVisible(false);
        setSaveFileName("");
    };

    return (
        <div className="drag-drop-container">
            <div className="top-bar-drag">
                {saveError && <p className="error-message">{saveError}</p>}
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Form Name" />
                <button onClick={handleSave}>Save</button>
                <button onClick={handleExport}>Export</button>
                <div className="file-dropdown">
                    <button onClick={() => setFileOptionsVisible(!fileOptionsVisible)}>File</button>
                    {fileOptionsVisible && (
                        <div className="file-options">
                            <button onClick={handleSaveFile}>Save File</button>
                            {saveFileNameInputVisible && (
                                <div>
                                    <input
                                        type="text"
                                        value={saveFileName}
                                        onChange={(e) => setSaveFileName(e.target.value)}
                                        placeholder="File Name"
                                    />
                                    <button onClick={handleSaveFileConfirm}>Confirm</button>
                                </div>
                            )}
                            <button onClick={handleSavedFile}>Saved File</button>
                        </div>
                    )}
                </div>
                <button onClick={handleClear}>Clear</button>
                <button onClick={handleUndo} disabled={historyIndex <= 0}>Undo</button>
                <button onClick={handleRedo} disabled={historyIndex >= history.length - 1}>Redo</button>
            </div>
            <div className="panelright-panel">
                <h3>Drag Elements</h3>
                {elements.map((el) => (
                    <div key={el.id} draggable onDragStart={(e) => handleDragStart(e, el)} className="draggable-item">
                        {el.label}
                    </div>
                ))}
            </div>
            <div className="panelleft-panel" onDrop={handleDrop} onDragOver={handleDragOver}>
                <h3>Drop Here</h3>
                {formElements.map((el, index) => (
                    <div key={el.id} className="form-element" draggable onDragStart={(e) => handleDragStartDropped(e, index)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDropReorder(e, index)}>
                        {el.label}
                        <div className="button-group">
                            <button className="settings-button" onClick={() => toggleSettings(el.id)}>⚙️</button>
                            <button className="delete-button" onClick={() => handleDelete(el.id)}>❌</button>
                        </div>
                        {activeSettingIndex === el.id && (
                            <div className="settings-panel">
                                <label>ID: <strong>{el.id}</strong></label>
                                <input type="text" placeholder="Label" value={settings[el.id]?.label || ""} onChange={(e) => handleSettingsChange(el.id, "label", e.target.value)} />
                                {el.type === 'table' && (
                                    <input type="text" placeholder="Table Name" value={settings[el.id]?.tableName || ""} onChange={(e) => handleSettingsChange(el.id, "tableName", e.target.value)} />
                                )}
                                {el.type === 'table' && settings[el.id]?.columns?.map(col => (
                                    <div key={col.id}>
                                        <input type="text" placeholder="Column Label" value={col.label} onChange={(e) => handleColumnChange(el.id, col.id, 'label', e.target.value)} />
                                    </div>
                                ))}
                                {["text", "textarea", "number"].includes(el.type) && (
                                    <input type="text" placeholder="Placeholder" value={settings[el.id]?.placeholder || ""} onChange={(e) => handleSettingsChange(el.id, "placeholder", e.target.value)} />
                                )}
                                <label><input type="checkbox" checked={settings[el.id]?.required || false} onChange={(e) => handleSettingsChange(el.id, "required", e.target.checked)} /> Required</label>
                                {["select", "checkbox", "radio"].includes(el.type) && (
                                    <div>
                                        <h4>Options</h4>
                                        {settings[el.id]?.options?.map((opt, idx) => (
                                            <div key={idx} className="option-item">
                                                <input type="text" value={opt} onChange={(e) => handleOptionChange(el.id, idx, e.target.value)} />
                                                <button onClick={() => removeOption(el.id, idx)}>❌</button>
                                            </div>
                                        ))}
                                        <button className="add-settings" onClick={() => addOption(el.id)}>➕</button>
                                    </div>
                                )}
                                {el.type === 'table' && (
                                    <div>
                                        <h4>Columns</h4>
                                        {settings[el.id]?.columns?.map(col => (
                                            <div key={col.id} className="option-item">
                                                <input type="text" value={col.label} onChange={(e) => handleColumnChange(el.id, col.id, 'label', e.target.value)} placeholder="Column Label" />
                                                <select value={col.type} onChange={(e) => handleColumnChange(el.id, col.id, 'type', e.target.value)}>
                                                    <option value="text">Text</option>
                                                    <option value="number">Number</option>
                                                    <option value="select">Select</option>
                                                    <option value="checkbox">Checkbox</option>
                                                    <option value="radio">Radio</option>
                                                </select>
                                                {col.type === 'select' && (
                                                    <div>
                                                        {col.options?.map((opt, idx) => (
                                                            <div key={idx} className="option-item">
                                                                <input type="text" value={opt} onChange={(e) => handleColumnChange(el.id, col.id, `options[${idx}]`, e.target.value)} />
                                                                <button onClick={() => removeOption(col.id, idx)}>❌</button>
                                                            </div>
                                                        ))}
                                                        <button onClick={() => addOption(col.id)}>➕</button>
                                                    </div>
                                                )}
                                                <button onClick={() => removeColumn(el.id, col.id)}>❌</button>
                                            </div>
                                        ))}
                                        <button onClick={() => addColumn(el.id)}>Add Column</button>
                                    </div>
                                )}
                                <button className="save-settings" onClick={() => saveSettings(el.id)}>Save</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DragDropBuilder;
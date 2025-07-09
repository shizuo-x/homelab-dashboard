import React, { useEffect, useRef, useState } from 'react';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { FaTrash, FaCog } from 'react-icons/fa';
import WidgetConfigModal from './WidgetConfigModal';
import SystemInfoWidget from './widgets/SystemInfoWidget';
import ServiceStatusWidget from './widgets/ServiceStatusWidget';
import TerminalWidget from './widgets/TerminalWidget';
import SshLauncherWidget from './widgets/SshLauncherWidget';

const widgetTypeMap = { SystemInfoWidget, ServiceStatusWidget, TerminalWidget, SshLauncherWidget };

const WidgetRenderer = ({ widget, ...props }) => {const t=widgetTypeMap[widget.type];if(!t)return React.createElement("div",{className:"p-4"},"Error: Unknown widget type '",widget.type,"'");return React.createElement("div",{className:"relative h-full w-full"},props.isEditing&&React.createElement("div",{className:"absolute top-2 right-2 z-10 flex flex-col gap-2"},React.createElement("button",{onClick:()=>props.onRemove(widget.id),className:"p-2 bg-red-800 rounded-full text-white hover:bg-red-600"},React.createElement(FaTrash,null)),React.createElement("button",{onClick:()=>props.onConfigure(widget),className:"p-2 bg-blue-800 rounded-full text-white hover:bg-blue-600"},React.createElement(FaCog,null))),React.createElement(t,{widget:widget}))};

const findNextAvailablePosition = (widgets, widgetW, widgetH, gridColumns) => {const t=[],e=100;for(let o=0;o<e;o++)t.push(new Array(gridColumns).fill(0));widgets.forEach(e=>{for(let o=e.y;o<e.y+e.h;o++)for(let r=e.x;r<e.x+e.w;r++)t[o]&&1!==(t[o][r]=1)});for(let o=0;o<e;o++)for(let r=0;r<=gridColumns-widgetW;r++){let e=!0;for(let i=o;i<o+widgetH;i++){for(let o=r;o<r+widgetW;o++)if(t[i]&&1===t[i][o]){e=!1;break}if(!e)break}if(e)return{x:r,y:o}}return{x:0,y:e} };

const DashboardGrid = ({ isEditing, newWidgetType, onWidgetAdded }) => {
  const [widgets, setWidgets] = useState([]);
  const [configuringWidget, setConfiguringWidget] = useState(null);
  const gridApiRef = useRef(null);

  // This logic is now simpler, as it doesn't need to create a default.
  const fetchLayout = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/dashboard/layout');
      setWidgets(response.data);
    } catch (error) {
      console.error('Failed to fetch layout', error);
      setWidgets([]); // Set to empty on error
    }
  };
  useEffect(() => { fetchLayout(); }, []);

  const handleSaveConfig = (updatedWidgetFromServer) => { setConfiguringWidget(null); setWidgets(current => current.map(w => w.id === updatedWidgetFromServer.id ? updatedWidgetFromServer : w)); };
  const handleRemoveWidget = async (widgetId) => { try { await axios.delete(`http://localhost:3000/api/dashboard/widget/${widgetId}`); setWidgets(current => current.filter(w => w.id !== widgetId)); } catch (error) { console.error('Failed to delete widget', error); } };

  useEffect(() => {
    if (newWidgetType) {
      const { x, y } = findNextAvailablePosition(widgets, 4, 4, 12);
      const newWidget = { id: `${newWidgetType.toLowerCase()}-${uuidv4()}`, type: newWidgetType, x, y, w: 4, h: 4, config: {} };
      if (newWidget.type === 'TerminalWidget') newWidget.h = 6; // Make terminal taller by default
      const newLayout = [...widgets, newWidget];
      setWidgets(newLayout);
      const saveNewWidget = async () => { try { await axios.post('http://localhost:3000/api/dashboard/layout', newLayout); } catch (error) { console.error("Failed to save new widget", error); } };
      saveNewWidget();
      onWidgetAdded();
    }
  }, [newWidgetType, onWidgetAdded]);

  useEffect(() => {
    if (gridApiRef.current) gridApiRef.current.destroy(false);
    gridApiRef.current = GridStack.init({ cellHeight: '70px', margin: 10, float: true, staticGrid: !isEditing });
    gridApiRef.current.on('change', async (event, items) => { /* ... (Unchanged) ... */ if(!items||0===items.length)return;const t=gridApiRef.current.save(!1),e=t.map(t=>{const e=widgets.find(e=>e.id===t.id);return{...e,...t}});if(e.some(t=>!t.type))return;try{await axios.post("http://localhost:3000/api/dashboard/layout",e)}catch(t){console.error("Failed to save layout on change",t)} });
    return () => { if (gridApiRef.current) gridApiRef.current.destroy(false); };
  }, [widgets, isEditing]);

  return (
    <>
      <WidgetConfigModal widget={configuringWidget} onClose={() => setConfiguringWidget(null)} onSave={handleSaveConfig} />
      <div className="grid-stack">
        {widgets.map((widget) => (
          <div key={`${widget.id}-${JSON.stringify(widget.config)}`} className="grid-stack-item" gs-id={widget.id} gs-x={widget.x} gs-y={widget.y} gs-w={widget.w} gs-h={widget.h}>
            <div className="grid-stack-item-content bg-[#0f172a] border border-[#1e293b] rounded-lg overflow-hidden">
              <WidgetRenderer widget={widget} isEditing={isEditing} onRemove={handleRemoveWidget} onConfigure={setConfiguringWidget} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardGrid;
import React, { useEffect, useRef, useState } from 'react';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { FaTrash, FaCog } from 'react-icons/fa';
import WidgetConfigModal from './WidgetConfigModal';
import eventBus from '../EventBus';

import SystemInfoWidget from './widgets/SystemInfoWidget';
import ServiceStatusWidget from './widgets/ServiceStatusWidget';
import TerminalWidget from './widgets/TerminalWidget';
import SshLauncherWidget from './widgets/SshLauncherWidget';
import TimeWidget from './widgets/TimeWidget';
import LinkLauncher from './widgets/LinkLauncher';
import LinkHolder from './widgets/LinkHolder';

const widgetTypeMap = { SystemInfoWidget, ServiceStatusWidget, TerminalWidget, SshLauncherWidget, TimeWidget, LinkLauncher, LinkHolder };

const WidgetRenderer = ({ widget, ...props }) => {
    const WidgetComponent = widgetTypeMap[widget.type];
    if (!WidgetComponent) return <div className="p-4">Error: Unknown widget type '{widget.type}'</div>;
    return (
        <div className="relative h-full w-full">
            {props.isEditing && (
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                    <button onClick={() => props.onRemove(widget.id)} className="p-2 bg-red-800 rounded-full text-white hover:bg-red-600"><FaTrash /></button>
                    <button onClick={() => props.onConfigure(widget)} className="p-2 bg-blue-800 rounded-full text-white hover:bg-blue-600"><FaCog /></button>
                </div>
            )}
            <WidgetComponent widget={widget} allWidgets={props.allWidgets} onConfigure={props.onConfigure} onRemove={props.onRemove} onUpdate={props.onUpdate} />
        </div>
    );
};

const findNextAvailablePosition = (widgets, widgetW, widgetH, gridColumns) => { const t=[],e=100;for(let o=0;o<e;o++)t.push(new Array(gridColumns).fill(0));widgets.forEach(e=>{for(let o=e.y;o<e.y+e.h;o++)for(let r=e.x;r<e.x+e.w;r++)t[o]&&1!==(t[o][r]=1)});for(let o=0;o<e;o++)for(let r=0;r<=gridColumns-widgetW;r++){let e=!0;for(let i=o;i<o+widgetH;i++){for(let o=r;o<r+widgetW;o++)if(t[i]&&1===t[i][o]){e=!1;break}if(!e)break}if(e)return{x:r,y:o}}return{x:0,y:e} };

const DashboardGrid = ({ isEditing, newWidgetType, onWidgetAdded }) => {
    const [widgets, setWidgets] = useState([]);
    const [configuringWidget, setConfiguringWidget] = useState(null);
    const gridApiRef = useRef(null);

    const fetchLayout = async () => { try{const t=await axios.get("http://localhost:3000/api/dashboard/layout");setWidgets(t.data)}catch(t){console.error("Failed to fetch layout",t),setWidgets([])} };
    useEffect(() => { fetchLayout(); }, []);
    
    const handleConfigureWidget = (widget) => setConfiguringWidget(widget);

    // --- Definitive fix for the save bug ---
    const handleSaveConfig = async (updatedWidgetFromServer) => {
        // The config is already saved by the modal. Now, just refresh the whole layout.
        await fetchLayout();
        setConfiguringWidget(null); // Close the modal
    };

    const handleRemoveWidget = async (widgetIdToRemove) => {
        const holderToRemove = widgets.find(w => w.id === widgetIdToRemove && w.type === 'LinkHolder');
        if (holderToRemove) {
            const childrenToUpdate = widgets.filter(w => w.config?.holderId === widgetIdToRemove)
                .map(w => {
                    const newConfig = { ...w.config }; delete newConfig.holderId;
                    const { x, y } = findNextAvailablePosition(widgets.filter(i => i.id !== widgetIdToRemove), 4, 2, 12);
                    return { ...w, config: newConfig, x, y };
                });
            if (childrenToUpdate.length > 0) {
                await axios.post("http://localhost:3000/api/dashboard/layout", childrenToUpdate);
            }
        }
        await axios.delete(`http://localhost:3000/api/dashboard/widget/${widgetIdToRemove}`);
        await fetchLayout(); // Re-fetch to get the clean state from the server.
    };

    useEffect(() => {
        if (newWidgetType) { const t={w:4,h:4};"TerminalWidget"===newWidgetType&&(t.h=6),"TimeWidget"===newWidgetType&&(t.h=4),"LinkLauncher"===newWidgetType&&(t.w=4,t.h=2),"LinkHolder"===newWidgetType&&(t.w=12,t.h=4);const{x:e,y:o}=findNextAvailablePosition(widgets,t.w,t.h,12),r={id:`${newWidgetType.toLowerCase()}-${uuidv4()}`,type:newWidgetType,x:e,y:o,...t,config:{}};const i=[...widgets,r];setWidgets(i);(async()=>{try{await axios.post("http://localhost:3000/api/dashboard/layout",i)}catch(t){console.error("Failed to save new widget",t)}})(),onWidgetAdded()}
    }, [newWidgetType, onWidgetAdded]);

    useEffect(() => {
        if (gridApiRef.current) gridApiRef.current.destroy(false);
        const grid = GridStack.init({ cellHeight: '70px', margin: 10, float: true, staticGrid: !isEditing, minW: 4, minH: 2 });
        gridApiRef.current = grid;
        const handleTerminalReady = (widgetId) => { eventBus.dispatch('initialize-terminal', widgetId); };
        eventBus.on('terminal-widget-ready', handleTerminalReady);
        grid.on('change', async (event, items) => { if(!items||0===items.length)return;const t=gridApiRef.current.save(!1),e=t.map(t=>{const e=widgets.find(e=>e.id===t.id);return{...e,...t}});if(e.some(t=>!t.type))return;try{await axios.post("http://localhost:3000/api/dashboard/layout",e)}catch(t){console.error("Failed to save layout on change",t)} });
        return () => { if (grid) grid.destroy(false); eventBus.remove('terminal-widget-ready', handleTerminalReady); };
    }, [widgets, isEditing]);

    const widgetsToRender = widgets.filter(w => w.type !== 'LinkLauncher' || !w.config?.holderId);

    return (
        <>
            <WidgetConfigModal widget={configuringWidget} onClose={() => setConfiguringWidget(null)} onSave={handleSaveConfig} allWidgets={widgets} />
            <div className="grid-stack">
                {widgetsToRender.map((widget) => (
                    <div key={widget.id} className="grid-stack-item" gs-id={widget.id} gs-x={widget.x} gs-y={widget.y} gs-w={widget.w} gs-h={widget.h}>
                        <div className="grid-stack-item-content bg-[#0f172a] border border-[#1e293b] rounded-lg overflow-hidden">
                            <WidgetRenderer widget={widget} isEditing={isEditing} onRemove={handleRemoveWidget} onConfigure={handleConfigureWidget} onUpdate={handleSaveConfig} allWidgets={widgets} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default DashboardGrid;
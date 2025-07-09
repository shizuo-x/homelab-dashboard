import React from 'react';
import { FaServer, FaSatelliteDish, FaTerminal, FaRocket } from 'react-icons/fa'; // <-- Import new icon

const availableWidgets = [
  { type: 'SystemInfoWidget', name: 'System Info', description: 'Monitor a node via its IP address.', icon: <FaServer /> },
  { type: 'ServiceStatusWidget', name: 'Service Status', description: 'Ping services to check their status.', icon: <FaSatelliteDish /> },
  { type: 'TerminalWidget', name: 'Live Terminal', description: 'A live shell on the main server.', icon: <FaTerminal /> },
  { type: 'SshLauncherWidget', name: 'SSH Launcher', description: 'Quick-connect to SSH hosts.', icon: <FaRocket /> }, // <-- ADD THIS
];

const AddWidgetModal = ({ isOpen, onClose, onAddWidget }) => { /* ... (rest of file is unchanged) ... */ if(!isOpen)return null;const e=t=>{onAddWidget(t),onClose()};return React.createElement("div",{className:"fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"},React.createElement("div",{className:"bg-slate-800 p-6 rounded-lg border border-slate-700 w-full max-w-lg"},React.createElement("div",{className:"flex justify-between items-center mb-4"},React.createElement("h2",{className:"text-xl font-bold text-green-400"},"Add a New Widget"),React.createElement("button",{onClick:onClose,className:"text-gray-400 hover:text-white"},"×")),React.createElement("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4"},availableWidgets.map(t=>React.createElement("button",{key:t.type,onClick:()=>e(t.type),className:"bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-green-500 hover:bg-slate-800 transition-colors text-left"},React.createElement("div",{className:"flex items-center text-green-400 text-2xl mb-2"},t.icon,React.createElement("h3",{className:"ml-3 text-lg font-bold text-gray-200"},t.name)),React.createElement("p",{className:"text-sm text-gray-400"},t.description)))))) };

export default AddWidgetModal;
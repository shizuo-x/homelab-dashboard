import React from 'react';
import { FaServer, FaSatelliteDish, FaTerminal, FaRocket, FaClock, FaExternalLinkAlt, FaThLarge } from 'react-icons/fa';

const availableWidgets = [
  { type: 'SystemInfoWidget', name: 'System Info', description: 'Monitor a node via its IP address.', icon: <FaServer /> },
  { type: 'ServiceStatusWidget', name: 'Service Status', description: 'Ping services to check their status.', icon: <FaSatelliteDish /> },
  { type: 'TerminalWidget', name: 'Live Terminal', description: 'A live shell on the main server.', icon: <FaTerminal /> },
  { type: 'SshLauncherWidget', name: 'SSH Launcher', description: 'Quick-connect to SSH hosts.', icon: <FaRocket /> },
  { type: 'TimeWidget', name: 'Clock', description: 'Displays the time for a configured timezone.', icon: <FaClock /> },
  // --- These are the new widgets ---
  { type: 'LinkLauncher', name: 'Link Launcher', description: 'A single, monitored link with a status indicator.', icon: <FaExternalLinkAlt /> },
  { type: 'LinkHolder', name: 'Link Holder', description: 'A container to group multiple link launchers.', icon: <FaThLarge /> },
];

const AddWidgetModal = ({ isOpen, onClose, onAddWidget }) => {
    if (!isOpen) return null;
    
    const handleAdd = (type) => {
        onAddWidget(type);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-green-400">Add a New Widget</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableWidgets.map(widget => (
                        <button key={widget.type} onClick={() => handleAdd(widget.type)} className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-green-500 hover:bg-slate-800 transition-colors text-left">
                            <div className="flex items-center text-green-400 text-2xl mb-2">
                                {widget.icon}
                                <h3 className="ml-3 text-lg font-bold text-gray-200">{widget.name}</h3>
                            </div>
                            <p className="text-sm text-gray-400">{widget.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddWidgetModal;
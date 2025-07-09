import React from 'react';
import { FaRocket, FaChevronRight } from 'react-icons/fa';

// For now, this is a display-only component. The connection logic will come next.
const SshLauncherWidget = ({ widget }) => {
  const hosts = widget.config?.hosts || [];

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-green-400 flex items-center">
          <FaRocket className="mr-2" /> SSH LAUNCHER
        </h2>
      </div>
      <div className="flex-grow overflow-y-auto pr-2 custom-scroll space-y-2">
        {hosts.length > 0 ? (
          hosts.map(host => (
            <button 
              key={host.name} 
              className="w-full bg-gray-800 hover:bg-green-900 text-green-400 text-left text-sm py-2 px-3 rounded flex items-center justify-between transition-colors"
            >
              <span>
                <i className="fas fa-server mr-2"></i> {host.name.toUpperCase()}
              </span>
              <FaChevronRight />
            </button>
          ))
        ) : (
          <div className="text-center text-gray-500 pt-10">Use the <span className="text-blue-400">Cog</span> icon in edit mode to add SSH hosts.</div>
        )}
      </div>
    </div>
  );
};

export default SshLauncherWidget;
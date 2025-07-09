import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaSatelliteDish } from 'react-icons/fa';

const StatusBadge = ({ status }) => {
  const color = status === 'Online' ? 'text-green-400' : 'text-red-400';
  const text = status || 'Checking...';
  return <span className={color}>● {text.toUpperCase()}</span>;
};

const ServiceStatusWidget = ({ widget }) => {
  const services = widget.config?.services || [];
  const [liveStatuses, setLiveStatuses] = useState({});

  const updateStatuses = useCallback(async () => {
    if (services.length === 0) return;
    const statusPromises = services.map(service => 
      axios.get(`http://localhost:3000/api/check-status?url=${encodeURIComponent(service.url)}`)
        .then(res => ({ name: service.name, status: res.data.status }))
        .catch(() => ({ name: service.name, status: 'Offline' }))
    );
    const results = await Promise.all(statusPromises);
    setLiveStatuses(prev => {
        const newStatuses = { ...prev };
        results.forEach(res => { newStatuses[res.name] = res.status; });
        return newStatuses;
    });
  }, [services]);

  useEffect(() => {
    updateStatuses();
    const interval = setInterval(updateStatuses, 30000);
    return () => clearInterval(interval);
  }, [updateStatuses]);

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-green-400 flex items-center"><FaSatelliteDish className="mr-2" /> SERVICE STATUS</h2>
        {/* The + button is removed, configuration is handled by the parent grid's cog icon */}
      </div>
      <div className="flex-grow overflow-y-auto pr-2 custom-scroll">
        {services.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead><tr className="border-b border-gray-700"><th className="pb-2">SERVICE</th><th className="pb-2 text-center">STATUS</th></tr></thead>
            <tbody>
              {services.map(service => (
                <tr key={service.name} className="border-b border-gray-800">
                  <td className="py-2">{service.name}</td>
                  <td className="py-2 text-center"><StatusBadge status={liveStatuses[service.name]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : ( <div className="text-center text-gray-500 pt-10">Use the <span className="text-blue-400">Cog</span> icon in edit mode to add services.</div> )}
      </div>
    </div>
  );
};

export default ServiceStatusWidget;
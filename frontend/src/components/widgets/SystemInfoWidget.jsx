import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaServer, FaBrain } from 'react-icons/fa';

const Stat = ({ label, value, colorClass = 'text-green-400' }) => ( <div className="bg-gray-800 rounded p-2"><div className="text-gray-500 text-xs">{label}</div><div className={`font-bold ${colorClass}`}>{value}</div></div> );

const SystemInfoWidget = ({ widget }) => {
  const [stats, setStats] = useState(null);

  // --- THIS IS THE DEFINITIVE FIX ---
  // We create a complete, safe config object by merging defaults
  // with any config that might exist in the props.
  // This guarantees that 'config.ip' and 'config.name' will always exist.
  const config = {
    name: 'Controller Node',
    ip: '127.0.0.1',
    ...widget.config,
  };

  useEffect(() => {
    setStats(null); // Reset stats to show "Fetching..." when the IP changes.
    const fetchData = async (ip) => {
      try {
        const response = await axios.get(`http://localhost:3000/api/remote-system-info?ip=${encodeURIComponent(ip)}`);
        setStats(response.data);
      } catch (err) {
        setStats({ status: 'Offline', uptime: '0d 0h', cpu: 0, ram: 0 });
      }
    };

    fetchData(config.ip);
    const interval = setInterval(() => fetchData(config.ip), 5000);
    return () => clearInterval(interval);
  }, [widget.id, config.ip]); // Re-run if the widget ID or its IP changes.

  const isOffline = !stats || stats.status === 'Offline';
  const borderColor = isOffline ? 'border-red-500' : 'border-green-500';
  const textColor = isOffline ? 'text-red-400' : 'text-green-400';

  return (
    <div className={`p-4 flex flex-col h-full transition-colors ${isOffline ? 'bg-red-900/20' : ''}`}>
      <h3 className={`font-bold text-green-500 mb-3 flex items-center`}><FaBrain className="mr-2" /> {config.name.toUpperCase()}</h3>
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border ${borderColor} mr-3`}><FaServer className={textColor} /></div>
        <div><h3 className={`font-bold ${textColor}`}>{config.name}</h3><p className="text-xs text-gray-500">{config.ip}</p></div>
      </div>
      {stats ? (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Stat label="STATUS" value={stats.status} colorClass={textColor} />
          <Stat label="UPTIME" value={stats.uptime} />
          <Stat label="CPU" value={`${stats.cpu}%`} />
          <Stat label="RAM" value={`${stats.ram}%`} />
        </div>
      ) : ( <div className="text-gray-400 animate-pulse p-4">Fetching data...</div> )}
    </div>
  );
};

export default SystemInfoWidget;
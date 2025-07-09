import React, { useState } from 'react';
import { FaWifi } from 'react-icons/fa';

const BSSIDStatus = () => {
  const [targetBSSID, setTargetBSSID] = useState('00:1A:2B:3C:4D:5E'); // Default
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState(targetBSSID);

  // --- IMPORTANT NOTE ---
  // Browsers CANNOT access WiFi BSSID for security reasons.
  // This is a SIMULATION. We pretend the "targetBSSID" is the correct one.
  const isConnectedToTarget = true; // Change to false to test the "unauthorized" state

  const handleSave = () => {
    setTargetBSSID(inputValue);
    setIsModalOpen(false);
  };

  const statusColor = isConnectedToTarget ? 'text-green-400' : 'text-red-500';
  const statusText = isConnectedToTarget ? 'SECURE' : 'UNAUTHORIZED';

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center ${statusColor}`}
      >
        <FaWifi className="mr-2" />
        <span>NETWORK: {statusText}</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-full max-w-md">
            <h2 className="text-xl font-bold text-green-400 mb-4">Set Target WiFi Network</h2>
            <p className="text-sm text-gray-400 mb-2">Enter the BSSID of your secure network. The dashboard will show a warning if accessed from any other network.</p>
            <div className="mb-4">
              <label htmlFor="bssidInput" className="block text-sm mb-1 text-gray-500">Target BSSID</label>
              <input 
                type="text" 
                id="bssidInput"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-slate-900 rounded p-2 border border-slate-700 font-mono" 
              />
            </div>
            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>
              <button type="button" onClick={handleSave} className="px-4 py-2 bg-green-600 rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BSSIDStatus;
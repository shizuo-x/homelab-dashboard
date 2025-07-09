import React from 'react';
import { FaPlus, FaEdit, FaCheck, FaWifi, FaLock, FaCalendarAlt, FaPowerOff } from 'react-icons/fa';

const Header = ({ onOpenModal, isEditing, setIsEditing, setIsTerminated }) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  React.useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer); }, []);
  const isSecure = window.location.protocol === 'https:';

  return (
    <header className="px-4 py-4 md:py-6 border-b border-green-600 pb-4 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-3 md:w-4 h-10 md:h-12 bg-green-500 mr-3"></div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text">
              HOMELAB COMMAND
            </h1>
            <p className="hidden md:block text-xs text-gray-500">CENTRALIZED MANAGEMENT DASHBOARD</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4 text-xs">
          <button onClick={onOpenModal} className="bg-gray-800 text-green-400 hover:bg-green-900 px-3 py-2 rounded-md flex items-center">
            <FaPlus /><span className="hidden md:inline ml-2">ADD WIDGET</span>
          </button>
          <button onClick={() => setIsEditing(!isEditing)} className={`px-3 py-2 rounded-md flex items-center transition-colors ${isEditing ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-yellow-400 hover:bg-yellow-900'}`}>
            {isEditing ? <FaCheck /> : <FaEdit />}<span className="hidden md:inline ml-2">{isEditing ? 'DONE' : 'EDIT'}</span>
          </button>
          <div className="hidden lg:flex items-center space-x-4">
            <span className="text-gray-500">|</span>
            <div className="flex items-center text-green-400"><FaWifi className="mr-2" /><span>SSID: MyHomelabWiFi (Simulated)</span></div>
            <span className="text-gray-500">|</span>
            <div className="flex items-center text-green-400"><FaCalendarAlt className="mr-2" /><span>{currentTime.toLocaleTimeString()}</span></div>
            <span className="text-gray-500">|</span>
            <div className={`flex items-center ${isSecure ? 'text-green-400' : 'text-yellow-400'}`}><FaLock className="mr-2" /><span>SESSION: {isSecure ? 'SECURE' : 'INSECURE'}</span></div>
          </div>
          <button onClick={() => setIsTerminated(true)} className="bg-red-900 hover:bg-red-800 text-red-300 px-3 py-2 rounded-md flex items-center transition-colors"><FaPowerOff /></button>
        </div>
      </div>
    </header>
  );
};

export default Header;
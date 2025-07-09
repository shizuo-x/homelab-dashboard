import React from 'react';

const SystemTerminatedScreen = () => {
  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-red-500 text-4xl mb-4 font-bold">SYSTEM TERMINATED</h1>
        <p className="text-gray-500">All connections terminated. Secure wipe complete.</p>
        <button 
          onClick={handleRestart}
          className="mt-8 text-gray-400 border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-800 hover:text-green-400 transition-colors"
        >
          Restart Session
        </button>
      </div>
    </div>
  );
};

export default SystemTerminatedScreen;
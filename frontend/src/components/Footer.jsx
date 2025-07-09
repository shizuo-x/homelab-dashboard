import React from 'react';
import BSSIDStatus from './BSSIDStatus';

const Footer = () => {
  // We will make this dynamic later
  const lastSync = '12s ago';

  return (
    <footer className="fixed bottom-0 left-0 right-0 px-4 py-3 border-t border-gray-800 text-xs text-gray-600 bg-[#0a0a0a]">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <span>HOMELAB COMMAND v0.2.0-alpha</span>
          <span className="mx-2">|</span>
          <span>LAST SYNC: <span className="text-green-400">{lastSync}</span></span>
        </div>
        <div className="flex items-center space-x-4">
          <BSSIDStatus />
          <span className="text-yellow-400 animate-pulse">AWAITING COMMANDS...</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
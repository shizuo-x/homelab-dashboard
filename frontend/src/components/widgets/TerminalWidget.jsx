import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import eventBus from '../../EventBus';
import { FaTrash } from 'react-icons/fa';

const TerminalWidget = ({ widget }) => {
  const terminalRef = useRef(null);
  const termInstanceRef = useRef(null);

  useEffect(() => {
    let term;
    let ws;

    if (terminalRef.current && !termInstanceRef.current) {
      term = new Terminal({
        cursorBlink: true,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
        // The theme for the terminal content itself
        theme: {
          background: '#000000', // Black background for content
          foreground: '#00ff00', // Neon green text
          cursor: '#00ff00',
          selectionBackground: '#00aa00',
        }
      });
      termInstanceRef.current = term;
      
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      const wsUrl = `ws://localhost:3000`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => term.writeln('\x1B[1;3;32mWelcome to Homelab Command Shell!\x1B[0m');
      ws.onmessage = (event) => term.write(event.data);
      term.onData((data) => { if (ws.readyState === WebSocket.OPEN) ws.send(data); });
      ws.onclose = () => term.writeln('\x1B[1;3;31m\r\n--- CONNECTION CLOSED --- \x1B[0m');

      const handleCommand = (command) => { if (ws.readyState === WebSocket.OPEN) ws.send(command + '\r'); };
      eventBus.on('run-command', handleCommand);
    }

    return () => {
      if (ws) ws.close();
      if (term) term.dispose();
      termInstanceRef.current = null;
      eventBus.remove('run-command', () => {}); 
    };
  }, []);

  const handleClear = () => {
    if (termInstanceRef.current) {
      termInstanceRef.current.clear();
    }
  };

  return (
    // This is the new layout structure for the widget
    <div className="flex flex-col h-full bg-[#0f172a]">
      {/* Themed Title Bar */}
      <div className="flex justify-between items-center p-3 bg-gray-950 border-b border-gray-800">
        <h2 className="font-bold text-green-400 flex items-center text-sm">
          <span className="font-mono mr-2">_</span> MONITOR TERMINAL
        </h2>
        <button 
          onClick={handleClear}
          className="text-xs bg-gray-800 hover:bg-green-900 text-green-400 px-2 py-1 rounded flex items-center"
        >
          <FaTrash className="mr-1" /> CLEAR
        </button>
      </div>

      {/* Terminal Content Area */}
      <div className="flex-grow p-2 bg-black" style={{ minHeight: 0 }}>
        <div 
          ref={terminalRef} 
          className="w-full h-full custom-scroll"
        />
      </div>
    </div>
  );
};

export default TerminalWidget;
import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import eventBus from '../../EventBus'; // <-- IMPORT THE EVENT BUS

const TerminalWidget = ({ widget }) => {
  const terminalRef = useRef(null);
  const wsRef = useRef(null);
  const termInstanceRef = useRef(null);

  useEffect(() => {
    let term;
    let ws;

    if (terminalRef.current && !termInstanceRef.current) {
      term = new Terminal({
        cursorBlink: true, fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
        theme: { background: '#0f172a', foreground: '#e2e8f0', cursor: '#00ff00' }
      });
      termInstanceRef.current = term;
      
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      const wsUrl = `ws://localhost:3000`;
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => term.writeln('\x1B[1;3;32mWelcome to Homelab Command Shell!\x1B[0m');
      ws.onmessage = (event) => term.write(event.data);
      term.onData((data) => { if (ws.readyState === WebSocket.OPEN) ws.send(data); });
      ws.onclose = () => term.writeln('\x1B[1;3;31m\r\n--- CONNECTION CLOSED --- \x1B[0m');
      ws.onerror = () => term.writeln(`\x1B[1;3;31m\r\n--- WEBSOCKET ERROR --- \x1B[0m`);

      // --- THIS IS THE FIX ---
      // Subscribe to the 'run-command' event
      const handleCommand = (command) => {
        if (ws.readyState === WebSocket.OPEN) {
          // Write the command to the pty on the backend, followed by a carriage return (Enter key)
          ws.send(command + '\r'); 
        }
      };
      eventBus.on('run-command', handleCommand);
    }

    // Cleanup function
    return () => {
      if (ws) ws.close();
      if (term) term.dispose();
      termInstanceRef.current = null;
      // Unsubscribe from the event when the widget is destroyed
      eventBus.remove('run-command', () => {}); 
    };
  }, []);

  return (
    <div ref={terminalRef} style={{ width: '100%', height: '100%', padding: '10px', boxSizing: 'border-box' }} />
  );
};

export default TerminalWidget;
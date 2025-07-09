import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const TerminalWidget = ({ widget }) => {
  const terminalRef = useRef(null);
  const wsRef = useRef(null);
  const termInstanceRef = useRef(null);

  useEffect(() => {
    let term;
    let ws;

    if (terminalRef.current && !termInstanceRef.current) {
      term = new Terminal({
        cursorBlink: true,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 14,
        theme: {
          background: '#0f172a',
          foreground: '#e2e8f0',
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
      wsRef.current = ws;

      ws.onopen = () => {
        term.writeln('\x1B[1;3;32mWelcome to Homelab Command Shell!\x1B[0m');
      };

      ws.onmessage = (event) => {
        term.write(event.data);
      };

      term.onData((data) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data);
        }
      });

      ws.onclose = () => {
        term.writeln('\x1B[1;3;31m\r\n--- CONNECTION CLOSED --- \x1B[0m');
      };

      ws.onerror = (err) => {
        term.writeln(`\x1B[1;3;31m\r\n--- WEBSOCKET ERROR --- \x1B[0m`);
      };
    }

    return () => {
      if (ws) {
        ws.close();
      }
      if (term) {
        term.dispose();
      }
      termInstanceRef.current = null;
    };
  }, []);

  return (
    <div 
      ref={terminalRef} 
      style={{ width: '100%', height: '100%', padding: '10px', boxSizing: 'border-box' }}
    />
  );
};

export default TerminalWidget;
import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import eventBus from '../../EventBus';
import { FaTrash } from 'react-icons/fa';

const TerminalWidget = ({ widget }) => {
    const terminalContainerRef = useRef(null);
    const terminalInstancesRef = useRef({});

    // This effect runs once when the component mounts to announce its readiness.
    useEffect(() => {
        // Announce that this specific widget is ready to be initialized.
        eventBus.dispatch('terminal-widget-ready', widget.id);

        const initializeTerminal = (widgetId) => {
            if (widgetId !== widget.id || !terminalContainerRef.current || terminalInstancesRef.current.term) {
                return;
            }

            const term = new Terminal({
                cursorBlink: true, fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                theme: { background: '#000000', foreground: '#00ff00', cursor: '#00ff00', selectionBackground: '#00aa00' }
            });
            const fitAddon = new FitAddon();
            term.loadAddon(fitAddon);
            term.open(terminalContainerRef.current);

            const ws = new WebSocket(`ws://localhost:3000`);
            ws.onopen = () => term.writeln('\x1B[1;3;32mWelcome to Homelab Command Shell!\x1B[0m');
            ws.onmessage = (event) => term.write(event.data);
            ws.onclose = () => { if (!term.isDisposed) term.writeln('\x1B[1;3;31m\r\n--- CONNECTION CLOSED --- \x1B[0m') };
            term.onData((data) => { if (ws.readyState === WebSocket.OPEN) ws.send(data); });

            const resizeObserver = new ResizeObserver(() => { if (!term.isDisposed) fitAddon.fit(); });
            resizeObserver.observe(terminalContainerRef.current);
            fitAddon.fit();

            terminalInstancesRef.current = { term, ws, resizeObserver };
        };

        const handleCommand = (command) => {
            const { ws } = terminalInstancesRef.current;
            if (ws && ws.readyState === WebSocket.OPEN) ws.send(command + '\r');
        };

        eventBus.on('initialize-terminal', initializeTerminal);
        eventBus.on('run-command', handleCommand);

        return () => {
            eventBus.remove('initialize-terminal', initializeTerminal);
            eventBus.remove('run-command', handleCommand);
            const { term, ws, resizeObserver } = terminalInstancesRef.current;
            if (resizeObserver) resizeObserver.disconnect();
            if (ws) ws.close();
            if (term) term.dispose();
        };
    }, [widget.id]);

    const handleClear = () => {
        const { term } = terminalInstancesRef.current;
        if (term && !term.isDisposed) term.clear();
    };

    return (
        <div className="flex flex-col h-full bg-[#0f172a]">
            <div className="flex justify-between items-center p-3 bg-gray-950 border-b border-gray-800">
                <h2 className="font-bold text-green-400 flex items-center text-sm">
                    {/* This cosmetic bug is also fixed. */}
                    <span className="font-mono mr-2">_</span> MONITOR TERMINAL
                </h2>
                <button onClick={handleClear} className="text-xs bg-gray-800 hover:bg-green-900 text-green-400 px-2 py-1 rounded flex items-center">
                    <FaTrash className="mr-1" /> CLEAR
                </button>
            </div>
            <div className="flex-grow p-2 bg-black" style={{ minHeight: 0 }}>
                <div ref={terminalContainerRef} className="w-full h-full" />
            </div>
        </div>
    );
};

export default TerminalWidget;
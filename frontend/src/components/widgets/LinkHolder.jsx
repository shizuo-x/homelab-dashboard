import React, { useState, useEffect, useRef } from 'react';
import * as FaIcons from 'react-icons/fa';
import { FaThLarge, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const formatTimeAgo = (dateString) => { if (!dateString) return 'Never'; const date = new Date(dateString); const now = new Date(); const seconds = Math.floor((now - date) / 1000); if (seconds < 60) return "Just now"; let interval = seconds / 3600; if (interval > 1) return Math.floor(interval) + "h ago"; interval = seconds / 60; if (interval > 1) return Math.floor(interval) + "m ago"; return Math.floor(seconds) + "s ago"; };

const LinkItem = ({ widget, onConfigure, onRemove, onUpdate, viewMode }) => {
    const { name = 'Untitled', description = 'N/A', url, icon = 'FaLink', color = 'red', lastAccessed } = widget.config || {};
    const [status, setStatus] = useState('Checking...');
    useEffect(() => { const checkStatus = async () => { if (!url) return setStatus('Invalid'); try { const res = await axios.get(`http://localhost:3000/api/check-status?url=${encodeURIComponent(url)}`); setStatus(res.data.status); } catch { setStatus('Offline'); } }; checkStatus(); const interval = setInterval(checkStatus, 60000); return () => clearInterval(interval); }, [url]);
    const handleOpenLink = async () => { if (!url) return; window.open(url, '_blank', 'noopener,noreferrer'); try { const response = await axios.post(`http://localhost:3000/api/dashboard/widget/${widget.id}/accessed`); onUpdate(response.data); } catch (error) { console.error('Failed to update accessed time', error); } };
    const colors = { red: { base: 'text-red-400', bg: 'bg-red-900', border: 'border-red-800' }, yellow: { base: 'text-yellow-400', bg: 'bg-yellow-900', border: 'border-yellow-800' }, purple: { base: 'text-purple-400', bg: 'bg-purple-900', border: 'border-purple-800' }, blue: { base: 'text-blue-400', bg: 'bg-blue-900', border: 'border-blue-800' }, green: { base: 'text-green-400', bg: 'bg-green-900', border: 'border-green-800' }, };
    const theme = colors[color] || colors.red;
    const IconComponent = FaIcons[icon] || FaIcons.FaQuestionCircle;

    // --- This is the new responsive rendering logic ---
    if (viewMode === 'list') {
        return ( // Simplified list view for narrow containers
            <div onClick={handleOpenLink} className={`px-4 py-2 flex items-center hover:bg-gray-950 cursor-pointer transition-colors relative group border-b ${theme.border}`}>
                <div className={`w-8 h-8 ${theme.bg} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}> <IconComponent className={theme.base} size={16} /> </div>
                <div className="flex-grow overflow-hidden"> <h3 className="font-bold text-white truncate">{name.toUpperCase()}</h3> </div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 mx-4 ${status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="absolute top-0 bottom-0 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"> <button onClick={(e) => { e.stopPropagation(); onConfigure(widget); }} className="p-1.5 bg-blue-800/80 rounded-full text-white hover:bg-blue-700"><FaEdit size={12} /></button> <button onClick={(e) => { e.stopPropagation(); onRemove(widget.id); }} className="p-1.5 bg-red-800/80 rounded-full text-white hover:bg-red-700"><FaTrash size={12} /></button> </div>
            </div>
        );
    }

    return ( // The richer grid view for wider containers
        <div onClick={handleOpenLink} className={`p-4 flex flex-col justify-between hover:bg-gray-950 cursor-pointer transition-colors relative group border-r ${theme.border} last-of-type:border-r-transparent`}>
            <div className="flex items-center mb-3"> <div className={`w-10 h-10 ${theme.bg} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}> <IconComponent className={theme.base} size={20} /> </div> <div className="overflow-hidden"> <h3 className="font-bold text-white truncate">{name.toUpperCase()}</h3> <p className="text-xs text-gray-500">{formatTimeAgo(lastAccessed)}</p> </div> </div>
            <p className="text-sm text-gray-400 truncate mb-3">{description}</p>
            <div className="flex justify-between items-center text-xs font-bold"> <span className={`truncate ${theme.base}`}>{url.replace(/^(https?:\/\/)/, '')}</span> <span className={status === 'Online' ? 'text-green-400' : 'text-red-400'}>{status.toUpperCase()}</span> </div>
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"> <button onClick={(e) => { e.stopPropagation(); onConfigure(widget); }} className="p-1.5 bg-blue-800/80 rounded-full text-white hover:bg-blue-700"><FaEdit size={12} /></button> <button onClick={(e) => { e.stopPropagation(); onRemove(widget.id); }} className="p-1.5 bg-red-800/80 rounded-full text-white hover:bg-red-700"><FaTrash size={12} /></button> </div>
        </div>
    );
};

const LinkHolder = ({ widget, allWidgets = [], onConfigure, onRemove, onUpdate }) => {
    const { groupName = 'LINK MATRIX', groupColor = 'green' } = widget.config || {};
    const [viewMode, setViewMode] = useState('grid');
    const [columnClass, setColumnClass] = useState('grid-cols-1');
    const containerRef = useRef(null);
    
    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            if (entries[0]) {
                const width = entries[0].contentRect.width;
                if (width < 380) { setViewMode('list'); } 
                else { setViewMode('grid');
                    if (width < 640) setColumnClass('grid-cols-1');
                    else if (width < 960) setColumnClass('grid-cols-2');
                    else if (width < 1280) setColumnClass('grid-cols-3');
                    else setColumnClass('grid-cols-4');
                }
            }
        });
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const assignedLinks = allWidgets.filter(w => w.type === 'LinkLauncher' && w.config?.holderId === widget.id);
    const colorMap = { green: 'text-green-400', blue: 'text-blue-400', yellow: 'text-yellow-400', red: 'text-red-400', purple: 'text-purple-400' };

    return (
        <div className="h-full flex flex-col bg-gray-900/40" ref={containerRef}>
            <div className="border-b border-gray-800 p-3 bg-gray-950 flex justify-between items-center flex-shrink-0">
                <h2 className="font-bold text-green-400 flex items-center overflow-hidden">
                    <FaThLarge className="mr-2 flex-shrink-0" />
                    <span className="truncate">LINK HOLDER</span>
                    <span className="text-gray-600 mx-2">|</span>
                    <span className={`truncate ${colorMap[groupColor] || 'text-green-400'}`}>{groupName.toUpperCase()}</span>
                </h2>
                <div className="hidden sm:flex text-xs items-center ml-4 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                    <span className="text-green-400">REALTIME MONITORING</span>
                </div>
            </div>
            
            <div className="flex-grow overflow-y-auto custom-scroll">
                {assignedLinks.length > 0 ? (
                    <div className={viewMode === 'grid' ? `grid ${columnClass}` : 'flex flex-col'}>
                        {assignedLinks.map(linkWidget => (
                            <LinkItem key={linkWidget.id} widget={linkWidget} onConfigure={onConfigure} onRemove={onRemove} onUpdate={onUpdate} viewMode={viewMode} />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-600 text-center p-4"> <p>No links assigned. <br/> Use the Link Launcher's config to assign it to this group.</p> </div>
                )}
            </div>
        </div>
    );
};

export default LinkHolder;
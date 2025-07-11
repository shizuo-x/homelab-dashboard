import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { FaTrash } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

// Unchanged Forms
const SystemInfoForm = ({ initialConfig, onSave, onCancel }) => { const [name, setName] = useState(initialConfig?.name || 'Controller Node'); const [ip, setIp] = useState(initialConfig?.ip || '127.0.0.1'); const handleSubmit = (e) => { e.preventDefault(); onSave({ name, ip }); }; return ( <form onSubmit={handleSubmit}> <div className="mb-4"><label className="block text-sm mb-1 text-gray-400">Display Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900 rounded p-2 border border-slate-700" required /></div> <div className="mb-4"><label className="block text-sm mb-1 text-gray-400">IP Address</label><input type="text" value={ip} onChange={e => setIp(e.target.value)} className="w-full bg-slate-900 rounded p-2 border border-slate-700" required /></div> <div className="flex justify-end gap-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 rounded">Cancel</button><button type="submit" className="px-4 py-2 bg-green-600 rounded">Save</button></div> </form> ); };
const ServiceStatusForm = ({ initialConfig, onSave, onCancel }) => { const [services, setServices] = useState(initialConfig?.services || []); const [newName, setNewName] = useState(''); const [newUrl, setNewUrl] = useState(''); const [error, setError] = useState(''); const handleAddService = () => { if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) { setError('Invalid URL. Must start with http:// or https://'); return; } setError(''); if (newName && newUrl) { setServices(current => [...current, { id: uuidv4(), name: newName, url: newUrl }]); setNewName(''); setNewUrl(''); } }; const handleRemoveService = (idToRemove) => { setServices(current => current.filter(s => s.id !== idToRemove)); }; const handleSave = () => { onSave({ services }); }; return ( <div> <div className="mb-4 max-h-48 overflow-y-auto custom-scroll pr-2 border-b border-slate-700 pb-2"> {services.map(service => ( <div key={service.id} className="flex items-center justify-between bg-slate-900 p-2 rounded mb-2"> <div><p className="font-bold">{service.name}</p><p className="text-xs text-gray-500">{service.url}</p></div> <button onClick={() => handleRemoveService(service.id)} className="p-2 text-red-500 hover:bg-red-900 rounded-full"><FaTrash /></button> </div> ))} </div> <div className="grid grid-cols-2 gap-4 mb-2"> <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="New Service Name" className="w-full bg-slate-900 rounded p-2 border border-slate-700" /> <input type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://service.url" className="w-full bg-slate-900 rounded p-2 border border-slate-700" /> </div> {error && <p className="text-red-500 text-xs mb-2">{error}</p>} <button type="button" onClick={handleAddService} className="w-full mb-4 py-2 bg-blue-800 hover:bg-blue-700 rounded">Add Service to List</button> <div className="flex justify-end gap-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 rounded">Cancel</button><button type="button" onClick={handleSave} className="px-4 py-2 bg-green-600 rounded">Save Changes</button></div> </div> ); };
const SshLauncherForm = ({ initialConfig, onSave, onCancel }) => { const [hosts, setHosts] = useState(initialConfig?.hosts || []); const [name, setName] = useState(''); const [user, setUser] = useState(''); const [host, setHost] = useState(''); const handleAddHost = () => { if (name && user && host) { setHosts(current => [...current, { name, user, host }]); setName(''); setUser(''); setHost(''); } }; const handleRemoveHost = (hostNameToRemove) => { setHosts(current => current.filter(h => h.name !== hostNameToRemove)); }; const handleSave = () => { onSave({ hosts }); }; return ( <div> <div className="mb-4 max-h-48 overflow-y-auto custom-scroll pr-2 border-b border-slate-700 pb-2"> {hosts.map(h => ( <div key={h.name} className="flex items-center justify-between bg-slate-900 p-2 rounded mb-2"> <div><p className="font-bold">{h.name}</p><p className="text-xs text-gray-500">{h.user}@{h.host}</p></div> <button onClick={() => handleRemoveHost(h.name)} className="p-2 text-red-500 hover:bg-red-900 rounded-full"><FaTrash /></button> </div> ))} </div> <div className="grid grid-cols-3 gap-4 mb-4"> <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Display Name" className="w-full bg-slate-900 rounded p-2 border border-slate-700" /> <input type="text" value={user} onChange={e => setUser(e.target.value)} placeholder="user" className="w-full bg-slate-900 rounded p-2 border border-slate-700" /> <input type="text" value={host} onChange={e => setHost(e.target.value)} placeholder="hostname or IP" className="w-full bg-slate-900 rounded p-2 border border-slate-700" /> </div> <button type="button" onClick={handleAddHost} className="w-full mb-4 py-2 bg-blue-800 hover:bg-blue-700 rounded">Add Host to List</button> <div className="flex justify-end gap-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 rounded">Cancel</button><button type="button" onClick={handleSave} className="px-4 py-2 bg-green-600 rounded">Save Changes</button></div> </div> ); };
const TimeWidgetForm = ({ initialConfig, onSave, onCancel }) => { const [timezone, setTimezone] = useState(initialConfig?.timezone || ''); const handleSubmit = (e) => { e.preventDefault(); onSave({ timezone: timezone.trim() }); }; return ( <form onSubmit={handleSubmit}> <div className="mb-4"> <label className="block text-sm mb-1 text-gray-400">Timezone</label> <input type="text" value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full bg-slate-900 rounded p-2 border border-slate-700" placeholder="e.g., America/New_York, Asia/Kolkata" /> <p className="text-xs text-gray-500 mt-2"> Leave blank for local time. Use standard IANA format. </p> </div> <div className="flex justify-end gap-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 rounded">Cancel</button><button type="submit" className="px-4 py-2 bg-green-600 rounded">Save</button></div> </form> ); };

// --- Updated Form for LinkLauncher ---
const LinkLauncherForm = ({ initialConfig, onSave, onCancel, allWidgets }) => {
    const [config, setConfig] = useState({
        name: initialConfig?.name || '',
        url: initialConfig?.url || '',
        description: initialConfig?.description || '',
        icon: initialConfig?.icon || 'FaLink',
        color: initialConfig?.color || 'red',
        holderId: initialConfig?.holderId || ''
    });

    const handleChange = (e) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(config);
    };
    
    // Find all available holder widgets to populate the dropdown
    const availableHolders = allWidgets.filter(w => w.type === 'LinkHolder');
    const iconOptions = ['FaLink', 'FaPlex', 'FaServer', 'FaDatabase', 'FaCloud', 'FaHome', 'FaRaspberryPi', 'FaDocker', 'FaCode', 'FaGitAlt', 'FaBook'];
    const colorOptions = ['red', 'yellow', 'purple', 'blue', 'green'];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm mb-1 text-gray-400">Display Name</label><input type="text" name="name" value={config.name} onChange={handleChange} className="w-full bg-slate-900 rounded p-2 border border-slate-700" required /></div>
            <div><label className="block text-sm mb-1 text-gray-400">URL</label><input type="url" name="url" value={config.url} onChange={handleChange} className="w-full bg-slate-900 rounded p-2 border border-slate-700" placeholder="https://example.com" required /></div>
            <div><label className="block text-sm mb-1 text-gray-400">Description</label><input type="text" name="description" value={config.description} onChange={handleChange} className="w-full bg-slate-900 rounded p-2 border border-slate-700" /></div>
            <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm mb-1 text-gray-400">Icon</label><select name="icon" value={config.icon} onChange={handleChange} className="w-full bg-slate-900 rounded p-2 border border-slate-700">{iconOptions.map(i => <option key={i} value={i}>{i.substring(2)}</option>)}</select></div>
                <div><label className="block text-sm mb-1 text-gray-400">Color</label><select name="color" value={config.color} onChange={handleChange} className="w-full bg-slate-900 rounded p-2 border border-slate-700 capitalize">{colorOptions.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            <div>
                <label className="block text-sm mb-1 text-gray-400">Assign to Holder</label>
                <select name="holderId" value={config.holderId} onChange={handleChange} className="w-full bg-slate-900 rounded p-2 border border-slate-700">
                    <option value="">None (Show on main grid)</option>
                    {availableHolders.map(h => (
                        <option key={h.id} value={h.id}>{h.config?.groupName || h.id}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end gap-4 pt-2"><button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 rounded">Cancel</button><button type="submit" className="px-4 py-2 bg-green-600 rounded">Save</button></div>
        </form>
    );
};

// --- Updated Form for LinkHolder ---
const LinkHolderForm = ({ initialConfig, onSave, onCancel }) => {
    const [groupName, setGroupName] = useState(initialConfig?.groupName || 'Link Matrix');
    const [groupColor, setGroupColor] = useState(initialConfig?.groupColor || 'green');
    const colorOptions = { green: 'text-green-400', blue: 'text-blue-400', yellow: 'text-yellow-400', red: 'text-red-400', purple: 'text-purple-400' };

    const handleSubmit = (e) => { e.preventDefault(); onSave({ groupName, groupColor }); };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm mb-1 text-gray-400">Group Name</label><input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} className="w-full bg-slate-900 rounded p-2 border border-slate-700" required /></div>
            <div><label className="block text-sm mb-1 text-gray-400">Group Name Color</label><select value={groupColor} onChange={e => setGroupColor(e.target.value)} className="w-full bg-slate-900 rounded p-2 border border-slate-700 capitalize">{Object.keys(colorOptions).map(c => <option key={c} value={c} className={`${colorOptions[c]}`}>{c}</option>)}</select></div>
            <div className="flex justify-end gap-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 rounded">Cancel</button><button type="submit" className="px-4 py-2 bg-green-600 rounded">Save</button></div>
        </form>
    );
};

// --- Main Modal Component ---
const WidgetConfigModal = ({ widget, onClose, onSave, allWidgets }) => {
    if (!widget) return null;

    const handleSave = async (config) => {
        try {
            const response = await axios.post(`http://localhost:3000/api/dashboard/widget/${widget.id}/config`, config);
            onSave(response.data);
        } catch (error) { console.error("Failed to save config", error); }
    };

    const renderForm = () => {
        switch (widget.type) {
            case "SystemInfoWidget": return <SystemInfoForm initialConfig={widget.config} onSave={handleSave} onCancel={onClose} />;
            case "ServiceStatusWidget": return <ServiceStatusForm initialConfig={widget.config} onSave={handleSave} onCancel={onClose} />;
            case "SshLauncherWidget": return <SshLauncherForm initialConfig={widget.config} onSave={handleSave} onCancel={onClose} />;
            case "TimeWidget": return <TimeWidgetForm initialConfig={widget.config} onSave={handleSave} onCancel={onClose} />;
            case "LinkLauncher": return <LinkLauncherForm initialConfig={widget.config} onSave={handleSave} onCancel={onClose} allWidgets={allWidgets} />;
            case "LinkHolder": return <LinkHolderForm initialConfig={widget.config} onSave={handleSave} onCancel={onClose} />;
            default: return <div className="text-gray-400">This widget is not configurable.</div>;
        }
    };

    return ( <Modal isOpen={!!widget} onClose={onClose} title={`Configure: ${widget.config?.name || widget.config?.groupName || widget.type}`}> {renderForm()} </Modal> );
};

export default WidgetConfigModal;
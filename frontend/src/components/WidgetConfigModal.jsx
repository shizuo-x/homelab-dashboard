import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { FaTrash } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid'; // Import uuid to create unique IDs

const SystemInfoForm = ({ initialConfig, onSave, onCancel }) => { /* ... (Unchanged) ... */ const [name, setName] = useState(initialConfig?.name || 'Controller Node'); const [ip, setIp] = useState(initialConfig?.ip || '127.0.0.1'); const handleSubmit = (e) => { e.preventDefault(); onSave({ name, ip }); }; return ( <form onSubmit={handleSubmit}> <div className="mb-4"><label className="block text-sm mb-1 text-gray-400">Display Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900 rounded p-2 border border-slate-700" required /></div> <div className="mb-4"><label className="block text-sm mb-1 text-gray-400">IP Address</label><input type="text" value={ip} onChange={e => setIp(e.target.value)} className="w-full bg-slate-900 rounded p-2 border border-slate-700" required /></div> <div className="flex justify-end gap-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 rounded">Cancel</button><button type="submit" className="px-4 py-2 bg-green-600 rounded">Save</button></div> </form> ); };

const ServiceStatusForm = ({ initialConfig, onSave, onCancel }) => {
  const [services, setServices] = useState(initialConfig?.services || []);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');

  const handleAddService = () => {
    // --- FIX #1: Frontend URL Validation ---
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      setError('Invalid URL. Must start with http:// or https://');
      return;
    }
    setError(''); // Clear error if valid

    if (newName && newUrl) {
      // --- FIX #2: Assign a unique ID on creation ---
      setServices(current => [...current, { id: uuidv4(), name: newName, url: newUrl }]);
      setNewName('');
      setNewUrl('');
    }
  };

  const handleRemoveService = (idToRemove) => {
    // --- FIX #3: Delete by the unique ID ---
    setServices(current => current.filter(s => s.id !== idToRemove));
  };
  
  const handleSave = () => { onSave({ services }); };

  return (
    <div>
      <div className="mb-4 max-h-48 overflow-y-auto custom-scroll pr-2 border-b border-slate-700 pb-2">
        {services.map(service => (
          <div key={service.id} className="flex items-center justify-between bg-slate-900 p-2 rounded mb-2">
            <div><p className="font-bold">{service.name}</p><p className="text-xs text-gray-500">{service.url}</p></div>
            <button onClick={() => handleRemoveService(service.id)} className="p-2 text-red-500 hover:bg-red-900 rounded-full"><FaTrash /></button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 mb-2">
        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="New Service Name" className="w-full bg-slate-900 rounded p-2 border border-slate-700" />
        <input type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://service.url" className="w-full bg-slate-900 rounded p-2 border border-slate-700" />
      </div>
      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
      <button type="button" onClick={handleAddService} className="w-full mb-4 py-2 bg-blue-800 hover:bg-blue-700 rounded">Add Service to List</button>
      <div className="flex justify-end gap-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 rounded">Cancel</button><button type="button" onClick={handleSave} className="px-4 py-2 bg-green-600 rounded">Save Changes</button></div>
    </div>
  );
};

const SshLauncherForm = ({ initialConfig, onSave, onCancel }) => { /* ... (Unchanged) ... */ const [hosts, setHosts] = useState(initialConfig?.hosts || []); const [name, setName] = useState(''); const [user, setUser] = useState(''); const [host, setHost] = useState(''); const handleAddHost = () => { if (name && user && host) { setHosts(current => [...current, { name, user, host }]); setName(''); setUser(''); setHost(''); } }; const handleRemoveHost = (hostNameToRemove) => { setHosts(current => current.filter(h => h.name !== hostNameToRemove)); }; const handleSave = () => { onSave({ hosts }); }; return ( <div> <div className="mb-4 max-h-48 overflow-y-auto custom-scroll pr-2 border-b border-slate-700 pb-2"> {hosts.map(h => ( <div key={h.name} className="flex items-center justify-between bg-slate-900 p-2 rounded mb-2"> <div><p className="font-bold">{h.name}</p><p className="text-xs text-gray-500">{h.user}@{h.host}</p></div> <button onClick={() => handleRemoveHost(h.name)} className="p-2 text-red-500 hover:bg-red-900 rounded-full"><FaTrash /></button> </div> ))} </div> <div className="grid grid-cols-3 gap-4 mb-4"> <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Display Name" className="w-full bg-slate-900 rounded p-2 border border-slate-700" /> <input type="text" value={user} onChange={e => setUser(e.target.value)} placeholder="user" className="w-full bg-slate-900 rounded p-2 border border-slate-700" /> <input type="text" value={host} onChange={e => setHost(e.target.value)} placeholder="hostname or IP" className="w-full bg-slate-900 rounded p-2 border border-slate-700" /> </div> <button type="button" onClick={handleAddHost} className="w-full mb-4 py-2 bg-blue-800 hover:bg-blue-700 rounded">Add Host to List</button> <div className="flex justify-end gap-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 rounded">Cancel</button><button type="button" onClick={handleSave} className="px-4 py-2 bg-green-600 rounded">Save Changes</button></div> </div> ); };

const WidgetConfigModal = ({ widget, onClose, onSave }) => { /* ... (Unchanged) ... */ if(!widget)return null;const e=async t=>{try{const e=await axios.post(`http://localhost:3000/api/dashboard/widget/${widget.id}/config`,t);onSave(e.data)}catch(t){console.error("Failed to save config",t)}};const o=()=>{switch(widget.type){case"SystemInfoWidget":return React.createElement(SystemInfoForm,{initialConfig:widget.config,onSave:e,onCancel:onClose});case"ServiceStatusWidget":return React.createElement(ServiceStatusForm,{initialConfig:widget.config,onSave:e,onCancel:onClose});case"SshLauncherWidget":return React.createElement(SshLauncherForm,{initialConfig:widget.config,onSave:e,onCancel:onClose});default:return React.createElement("div",{className:"text-gray-400"},"This widget is not configurable.")}};return React.createElement(Modal,{isOpen:!!widget,onClose:onClose,title:`Configure: ${widget.config?.name||widget.type}`},o()) };

export default WidgetConfigModal;
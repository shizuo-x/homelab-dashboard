import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-400">{title}</h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-white">×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
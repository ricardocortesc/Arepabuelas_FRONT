import React from 'react';
import { X } from 'lucide-react';

const Notification = ({ message, type, onClose }) => {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warn: 'bg-yellow-500',
  };
  return (
    <div className={`fixed bottom-5 right-5 z-50 p-4 rounded-lg shadow-lg text-white ${colors[type] || 'bg-blue-500'}`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Notification;
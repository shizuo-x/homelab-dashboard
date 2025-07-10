import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as FaIcons from 'react-icons/fa';

// A helper function to format the time since a date into a readable string
const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};


const LinkLauncher = ({ widget }) => {
    // State for the live status of the URL
    const [status, setStatus] = useState('Checking...');
    // Local state for last accessed time to provide instant feedback on click
    const [lastAccessed, setLastAccessed] = useState(widget.config?.lastAccessed);

    const {
        name = 'Untitled Link',
        url = '#',
        description = 'No description',
        icon = 'FaLink',
        color = 'red'
    } = widget.config || {};

    // Map color names from config to Tailwind CSS classes
    const colorClasses = {
        red: 'bg-red-900 text-red-400',
        yellow: 'bg-yellow-900 text-yellow-400',
        purple: 'bg-purple-900 text-purple-400',
        blue: 'bg-blue-900 text-blue-400',
        green: 'bg-green-900 text-green-400',
    };

    // Dynamically select the icon component from the react-icons/fa library
    const IconComponent = FaIcons[icon] || FaIcons.FaQuestionCircle;

    // This effect runs periodically to check the link's online status
    useEffect(() => {
        const checkStatus = async () => {
            if (!url || url === '#') {
                setStatus('Invalid');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:3000/api/check-status?url=${encodeURIComponent(url)}`);
                setStatus(response.data.status);
            } catch (err) {
                setStatus('Offline');
            }
        };

        checkStatus(); // Check immediately on load
        const interval = setInterval(checkStatus, 60000); // And then every 60 seconds
        return () => clearInterval(interval);
    }, [url]);

    // This handles the click event for the entire widget
    const handleClick = async () => {
        if (!url || url === '#') return;
        window.open(url, '_blank', 'noopener,noreferrer');
        const newAccessedDate = new Date().toISOString();
        setLastAccessed(newAccessedDate); // Update UI instantly
        try {
            // Tell the backend to save the new accessed time
            await axios.post(`http://localhost:3000/api/dashboard/widget/${widget.id}/accessed`);
        } catch (error) {
            console.error('Failed to update accessed time', error);
        }
    };

    return (
        <div onClick={handleClick} className="p-4 h-full flex flex-col justify-between cursor-pointer hover:bg-gray-900/50 transition-colors">
            {/* Top section with icon and name */}
            <div className="flex items-center mb-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 text-xl ${colorClasses[color] || colorClasses.red}`}>
                    <IconComponent />
                </div>
                <div>
                    <h3 className="font-bold text-white leading-tight">{name.toUpperCase()}</h3>
                    <p className="text-xs text-gray-500">Last Opened: {formatTimeAgo(lastAccessed)}</p>
                </div>
            </div>

            {/* Bottom section with description and status */}
            <div>
                <p className="text-sm text-gray-400 mb-2">{description}</p>
                <div className="flex justify-end items-center text-xs text-gray-500">
                    <div className={`w-2 h-2 rounded-full mr-2 ${status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>{status.toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
};

export default LinkLauncher;
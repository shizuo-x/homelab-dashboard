import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as FaIcons from 'react-icons/fa';

// Helper function to format the time since a date into a readable string
const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";
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
    const [status, setStatus] = useState('Checking...');
    const [lastAccessed, setLastAccessed] = useState(widget.config?.lastAccessed);
    
    // State to hold the current size category of the widget for responsive rendering
    const [sizeCategory, setSizeCategory] = useState('medium');
    const containerRef = useRef(null);

    const {
        name = 'Untitled Link',
        url = '#',
        description = 'No description provided.',
        icon = 'FaLink',
        color = 'red'
    } = widget.config || {};

    // This effect uses a ResizeObserver to set the size category based on the container's width.
    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            if (entries[0]) {
                const width = entries[0].contentRect.width;
                if (width < 220) setSizeCategory('small');
                else if (width < 350) setSizeCategory('medium');
                else setSizeCategory('large');
            }
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // This effect runs periodically to check the link's online status.
    useEffect(() => {
        const checkStatus = async () => {
            if (!url || url === '#') return setStatus('Invalid');
            try {
                const response = await axios.get(`http://localhost:3000/api/check-status?url=${encodeURIComponent(url)}`);
                setStatus(response.data.status);
            } catch (err) {
                setStatus('Offline');
            }
        };
        checkStatus();
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, [url]);

    const handleClick = async () => {
        if (!url || url === '#') return;
        window.open(url, '_blank', 'noopener,noreferrer');
        const newAccessedDate = new Date().toISOString();
        setLastAccessed(newAccessedDate);
        try {
            await axios.post(`http://localhost:3000/api/dashboard/widget/${widget.id}/accessed`);
        } catch (error) {
            console.error('Failed to update accessed time', error);
        }
    };

    const colorClasses = {
        red: 'bg-red-900 text-red-400',
        yellow: 'bg-yellow-900 text-yellow-400',
        purple: 'bg-purple-900 text-purple-400',
        blue: 'bg-blue-900 text-blue-400',
        green: 'bg-green-900 text-green-400',
    };

    const IconComponent = FaIcons[icon] || FaIcons.FaQuestionCircle;

    const renderContent = () => {
        const statusDot = <div className={`w-2 h-2 rounded-full ${status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></div>;

        switch (sizeCategory) {
            case 'small':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${colorClasses[color]}`}>
                            <IconComponent />
                        </div>
                        <h3 className="font-bold text-white leading-tight mt-2 truncate w-full">{name.toUpperCase()}</h3>
                        <div className="absolute bottom-2 right-2">{statusDot}</div>
                    </div>
                );
            
            case 'medium':
            case 'large':
            default:
                return (
                    <div className="flex flex-col justify-between h-full">
                        <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 text-xl ${colorClasses[color]}`}>
                                <IconComponent />
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-white leading-tight truncate">{name.toUpperCase()}</h3>
                                <p className="text-xs text-gray-500">Last Opened: {formatTimeAgo(lastAccessed)}</p>
                            </div>
                        </div>
                        <div>
                            <p className={`text-sm text-gray-400 ${sizeCategory === 'medium' ? 'truncate' : ''}`}>
                                {description}
                            </p>
                            <div className="flex justify-end items-center text-xs text-gray-500 mt-1">
                                {statusDot}
                                {sizeCategory === 'large' && <span className="ml-2">{status.toUpperCase()}</span>}
                            </div>
                        </div>
                    </div>
                );
        }
    }

    return (
        <div ref={containerRef} onClick={handleClick} className="p-4 h-full cursor-pointer hover:bg-gray-900/50 transition-colors">
            {renderContent()}
        </div>
    );
};

export default LinkLauncher;
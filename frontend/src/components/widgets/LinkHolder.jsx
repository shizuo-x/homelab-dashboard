import React from 'react';
import { FaThLarge } from 'react-icons/fa'; // A suitable icon for a "holder"

const LinkHolder = ({ widget }) => {
    // The component's configuration can be extended in the future, e.g., for the title
    const { title = 'Link Matrix' } = widget.config || {};

    return (
        <div className="h-full flex flex-col">
            {/* Header styled like the "Active Threats" panel */}
            <div className="border-b border-gray-800 p-3 bg-gray-950 flex justify-between items-center">
                <h2 className="font-bold text-green-400 flex items-center">
                    <FaThLarge className="mr-2" />
                    <span>{title.toUpperCase()}</span>
                </h2>
                <div className="text-xs flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                    <span className="text-green-400">DRAG & DROP AREA</span>
                </div>
            </div>

            {/* The main body is a styled drop zone */}
            <div
                className="flex-grow p-2"
                style={{
                    // Creates a subtle background grid to indicate a drop zone
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                }}
            >
                {/* This area is intentionally empty. The GridStack library handles placing other widgets on top of this one. */}
            </div>
        </div>
    );
};

export default LinkHolder;
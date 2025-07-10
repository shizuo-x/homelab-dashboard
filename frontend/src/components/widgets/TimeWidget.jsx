import React, { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';

const TimeWidget = ({ widget }) => {
  const [time, setTime] = useState(new Date());
  // State to control the blinking colon visibility for a more dynamic "digital" feel
  const [showColon, setShowColon] = useState(true);

  const timezone = widget.config?.timezone;

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    // This interval creates the blinking effect
    const colonTimerId = setInterval(() => setShowColon(prev => !prev), 500);

    return () => {
      clearInterval(timerId);
      clearInterval(colonTimerId);
    };
  }, []);

  // Format time into distinct parts for individual styling
  const timeParts = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timezone,
  }).formatToParts(time).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  // Format date parts to be displayed in a "system readout" style
  const dayString = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: timezone,
  }).format(time).toUpperCase();

  const dateStringNumeric = new Intl.DateTimeFormat('en-CA', { // 'en-CA' locale reliably gives YYYY-MM-DD
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone,
  }).format(time);

  return (
    // This is the main container that fills the widget space
    <div className="p-4 flex flex-col h-full">
      {/* A header section inspired by the target UI's components */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-4">
        <h2 className="font-bold text-green-400 flex items-center">
          <FaClock className="mr-2" />
          <span>SYSTEM CLOCK</span>
        </h2>
        <div className="text-xs bg-gray-800 text-green-400 px-2 py-1 rounded">
          {timezone || 'LOCAL'}
        </div>
      </div>

      {/* The main content area that grows to fill the remaining space */}
      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Themed time display with a subtle text shadow and blinking colons */}
        <div className="text-6xl font-bold text-white flex items-center" style={{ textShadow: '0 0 5px rgba(255,255,255,0.3)' }}>
          <span>{timeParts.hour}</span>
          <span className={`px-1 transition-opacity duration-300 ${showColon ? 'opacity-100' : 'opacity-25'}`}>:</span>
          <span>{timeParts.minute}</span>
          <span className={`px-1 transition-opacity duration-300 ${showColon ? 'opacity-100' : 'opacity-25'}`}>:</span>
          <span>{timeParts.second}</span>
        </div>

        {/* Themed date display, structured like the stats in the target UI's "User Profile" widget */}
        <div className="mt-4 w-full grid grid-cols-2 gap-3 text-center text-sm">
            <div className="bg-gray-900 rounded p-2 border border-gray-700">
                <div className="text-gray-500 text-xs">DAY</div>
                <div className="text-green-400 font-bold">{dayString}</div>
            </div>
            <div className="bg-gray-900 rounded p-2 border border-gray-700">
                <div className="text-gray-500 text-xs">DATE</div>
                <div className="text-green-400 font-bold">{dateStringNumeric}</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TimeWidget;
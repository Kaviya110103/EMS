import React, { useState, useEffect } from 'react';
import '../style/DateTimeCard.css'; // Import the CSS file

const DateTimeCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update time every second
    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  // Format time to include hours, minutes, and seconds
  const timeString = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit'  // Add seconds
  });

  const dateString = currentTime.toLocaleDateString([], { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const dayString = currentTime.toLocaleDateString([], { weekday: 'long' });

  return (
    <div className="date-time-card">
      {/* Left side: Current time with seconds */}
      <div className="time-string">
        {timeString}
      </div>
      
      {/* Right side: Date and Day */}
      <div className="date-day-container">
        <div className="date-string">
          {dateString}
        </div>
        <div className="day-string">
          {dayString}
        </div>
      </div>
    </div>
  );
};

export default DateTimeCard;

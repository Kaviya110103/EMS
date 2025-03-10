import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Calendar.css';

const Attendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Fetch attendance data from API
  const fetchAttendanceData = (month, year) => {
    axios
      .get(`http://localhost:8080/api/attendance/employee/2`)
      .then((response) => {
        setAttendanceList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching attendance data:', error);
      });
  };

  useEffect(() => {
    fetchAttendanceData(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  // Format time string (remove milliseconds)
  const formatTime = (timeString) => {
    if (!timeString) return 'Not Available';
    return timeString.split('.')[0]; // Remove milliseconds
  };

  // Open modal with attendance details
  const openModal = (attendance) => {
    setSelectedAttendance(attendance);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAttendance(null);
  };

  // Go to the previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Go to the next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate all dates for a specific month
  const getDatesInMonth = (month, year) => {
    const dates = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
  };

  const dates = getDatesInMonth(currentMonth, currentYear);

  return (
    <div className="calendar-container">
      <h2>Employee Attendance</h2>

      {/* Navigation Buttons */}
      <div className="calendar-nav">
        <button onClick={goToPreviousMonth}>Previous Month</button>
        <span>{`${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`}</span>
        <button onClick={goToNextMonth}>Next Month</button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        <div className="calendar-header">
          <div className="day">Sun</div>
          <div className="day">Mon</div>
          <div className="day">Tue</div>
          <div className="day">Wed</div>
          <div className="day">Thu</div>
          <div className="day">Fri</div>
          <div className="day">Sat</div>
        </div>

        <div className="calendar-days">
          {dates.map((date, index) => {
            const attendance = attendanceList.find((item) => item.dateIn === date);
            return (
              <div
                key={index}
                className={`calendar-day ${date ? '' : 'empty'}`}
                style={{
                  backgroundColor: attendance ? '#f1f1f1' : '#e0e0e0',
                }}
                onClick={() => date && openModal(attendance)}
              >
                {date ? (
                  <>
                    <p>{new Date(date).getDate()}</p>
                    <p>{attendance ? attendance.attendanceStatus : 'No Data'}</p>
                  </>
                ) : (
                  <p>&nbsp;</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for displaying full attendance details */}
      {isModalOpen && selectedAttendance && (
  <div className="modal" style={{ display: 'block', position: 'fixed', zIndex: '1', left: '0', top: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', paddingTop: '60px' }}>
    <div className="modal-content" style={{ backgroundColor: 'white', margin: '5% auto', padding: '20px', border: '1px solid #888', width: '80%' }}>
      <span className="close" style={{ color: '#aaa', float: 'right', fontSize: '28px', fontWeight: 'bold', cursor: 'pointer' }} onClick={closeModal}>
        &times;
      </span>
      <h3>Attendance Details</h3>
      <p><strong>Attendance ID:</strong> {selectedAttendance.id}</p>
      <p><strong>Date:</strong> {selectedAttendance.dateIn}</p>
      <p><strong>Time In:</strong> {formatTime(selectedAttendance.timeIn)}</p>
      <p><strong>Time Out:</strong> {formatTime(selectedAttendance.timeOut)}</p>
      <p><strong>Status:</strong> {selectedAttendance.attendanceStatus}</p>

      {/* Display Images */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <img src={`http://localhost:8080/api/images/displayImage1ByAttendanceId/${selectedAttendance.id}`} alt="Image 1" style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
        <img src={`http://localhost:8080/api/images/displayImage2ByAttendanceId/${selectedAttendance.id}`} alt="Image 2" style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Attendance;
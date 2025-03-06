import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Calendar.css';

const Attendance = () => {
  // State to store the list of attendance records
  const [attendanceList, setAttendanceList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  // State to store the current month and year
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Start with current month (0-11)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Start with current year

  // Generate all dates for a specific month
  const getDatesInMonth = (month, year) => {
    const dates = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get total number of days in the month
    const firstDay = new Date(year, month, 1).getDay(); // Get the day of the week for the first day of the month

    // Add empty days for the beginning of the month
    for (let i = 0; i < firstDay; i++) {
      dates.push(null); // Add nulls to align the days correctly
    }

    // Add actual dates
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day); // Generate date
      dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }

    return { dates, firstDay };
  };

  // Fetch attendance data from API
  const fetchAttendanceData = (month, year) => {
    axios
      .get(`http://localhost:8080/api/attendance/employee/1`) // Update with correct employee ID
      .then((response) => {
        const attendanceData = response.data; // Assuming the response contains an array of attendance data
        setAttendanceList(attendanceData);
      })
      .catch((error) => {
        console.error('Error fetching attendance data:', error);
      });
  };

  // Fetch attendance data when month or year changes
  useEffect(() => {
    fetchAttendanceData(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

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
      setCurrentMonth(11); // December
      setCurrentYear(currentYear - 1); // Previous year
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Go to the next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0); // January
      setCurrentYear(currentYear + 1); // Next year
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Create an array of dates for the selected month
  const { dates, firstDay } = getDatesInMonth(currentMonth, currentYear);

  return (
    <div className="calendar-container">
      <h2>Employee Attendance</h2>

      {/* Navigation Buttons */}
      <div className="calendar-nav">
        <button onClick={goToPreviousMonth}>Previous Month</button>
        <span>{`${currentYear}-${currentMonth + 1}`}</span>
        <button onClick={goToNextMonth}>Next Month</button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Calendar Header (Day Names) */}
        <div className="calendar-header">
          <div className="day">Sun</div>
          <div className="day">Mon</div>
          <div className="day">Tue</div>
          <div className="day">Wed</div>
          <div className="day">Thu</div>
          <div className="day">Fri</div>
          <div className="day">Sat</div>
        </div>

        {/* Calendar Days */}
        <div className="calendar-days">
          {dates.map((date, index) => (
            <div
              key={index}
              className={`calendar-day ${date ? '' : 'empty'}`}
              style={{
                backgroundColor: date && attendanceList.some(
                  (item) => item.dateIn === date
                )
                  ? '#f1f1f1'
                  : '#e0e0e0', // Grey if no attendance
              }}
              onClick={() => date && openModal(attendanceList.find(
                (item) => item.dateIn === date
              ))}
            >
              {date ? (
                <>
                  <p>{date.split('-')[2]}</p> {/* Day of the month */}
                  <p>
                    {attendanceList.some((item) => item.dateIn === date)
                      ? 'Present'
                      : 'No Data'}
                  </p>
                </>
              ) : (
                <p>&nbsp;</p> // Empty cell for non-existing days
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for displaying full attendance details */}
      {isModalOpen && selectedAttendance && (
        <div
          id="attendanceModal"
          className="modal"
          style={{
            display: 'block',
            position: 'fixed',
            zIndex: '1',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            paddingTop: '60px',
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: 'white',
              margin: '5% auto',
              padding: '20px',
              border: '1px solid #888',
              width: '80%',
            }}
          >
            <span
              className="close"
              style={{
                color: '#aaa',
                float: 'right',
                fontSize: '28px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              onClick={closeModal}
            >
              &times;
            </span>
            <h3>Attendance Details</h3>
            <p>
              <strong>Time In:</strong> {selectedAttendance.timeIn}
            </p>
            <p>
              <strong>Time Out:</strong> {selectedAttendance.timeOut}
            </p>
            <p>
              <strong>Status:</strong> {selectedAttendance.attendanceStatus}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Calendar.css';

const Attendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [attendanceImages, setAttendanceImages] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Fetch attendance data from API
  const fetchAttendanceData = (month, year) => {
    axios
      .get(`http://localhost:8080/api/attendance/employee/1`)
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

  // Fetch attendance images by attendance ID
  const fetchAttendanceImages = (attendanceId) => {
    axios
      .get(`http://localhost:8080/api/images/displayImagesByAttendanceId/${attendanceId}`)
      .then((response) => {
        setAttendanceImages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching attendance images:', error);
        setAttendanceImages(null);
      });
  };

  // Format time string (remove milliseconds)
  const formatTime = (timeString) => {
    if (!timeString) return 'Not Available';
    return timeString.split('.')[0];
  };

  // Open modal with attendance details and fetch images
  const openModal = (attendance) => {
    if (!attendance) return;
    setSelectedAttendance(attendance);
    fetchAttendanceImages(attendance.id);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAttendance(null);
    setAttendanceImages(null);
  };

  return (
    <div className="calendar-container">
      <h2>Employee Attendance</h2>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {attendanceList.map((attendance) => (
          <div
            key={attendance.id}
            className="calendar-day"
            onClick={() => openModal(attendance)}
            style={{ backgroundColor: attendance.attendanceStatus === 'Present' ? '#d4edda' : '#f8d7da' }}
          >
            <p>{attendance.dateIn}</p>
            <p>{attendance.attendanceStatus}</p>
          </div>
        ))}
      </div>

      {/* Modal for displaying full attendance details */}
      {isModalOpen && selectedAttendance && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>Attendance Details</h3>
            <p><strong>Attendance ID:</strong> {selectedAttendance.id}</p>
            <p><strong>Date:</strong> {selectedAttendance.dateIn}</p>
            <p><strong>Time In:</strong> {formatTime(selectedAttendance.timeIn)}</p>
            <p><strong>Time Out:</strong> {formatTime(selectedAttendance.timeOut)}</p>
            <p><strong>Status:</strong> {selectedAttendance.attendanceStatus}</p>

            {attendanceImages && (
              <div className="attendance-images">
                <h4>Captured Images</h4>
                <img src={attendanceImages.imageUrl1} alt="Attendance Image 1" width="200" height="200" />
                <img src={attendanceImages.imageUrl2} alt="Attendance Image 2" width="200" height="200" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;

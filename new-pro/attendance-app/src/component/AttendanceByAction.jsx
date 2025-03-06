import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Spinner, Alert, Button, Form } from 'react-bootstrap';
import '../style/markattendance.css'; // Import CSS for styling

const MarkAttendance = () => {
  const location = useLocation();
  const { employeeId } = location.state || {}; // Get employeeId from the passed state
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState('--:--:--');
  const [currentDate, setCurrentDate] = useState('--/--/----');
  const [currentDay, setCurrentDay] = useState('');
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  const [attendanceId, setAttendanceId] = useState(null);
  const [buttonColor, setButtonColor] = useState('primary'); // For changing button color
  const [action, setAction] = useState(''); // Empty string initially
  const [isAttendanceVisible, setIsAttendanceVisible] = useState(false); // Toggle visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [actionBy, setActionBy] = useState('');

  // Set default action based on employeeId when component mounts
  useEffect(() => {
    if (employeeId) {
      setAction(employeeId.toString()); // Set action to employeeId as a string
    }
  }, [employeeId]);

  // Update current time, date, and day every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString());
      setCurrentDay(now.toLocaleDateString(undefined, { weekday: 'long' }));
    }, 1000);
    return () => clearInterval(interval); // Clear interval when component unmounts
  }, []);

  // Check localStorage for attendanceId and Time In/Out state when the component mounts
  useEffect(() => {
    const storedTimeIn = localStorage.getItem(`timeIn_${employeeId}`);
    const storedTimeOut = localStorage.getItem(`timeOut_${employeeId}`);
    const storedAttendanceId = localStorage.getItem(`attendanceId_${employeeId}`);
    if (storedTimeIn && storedAttendanceId) {
      setTimeIn(storedTimeIn);
      setAttendanceId(storedAttendanceId);
      setButtonColor('success'); // Time In has been clicked before reload
    }
    if (storedTimeOut) {
      setTimeOut(storedTimeOut); // Restore the time out from localStorage
      setButtonColor('danger'); // Change button color to red when Time Out exists
    }
  }, [employeeId]);

  // Fetch attendance by action
  const fetchAttendanceByAction = async (action) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/attendance/action?action=${action}`);
      setAttendance(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance on action change
  useEffect(() => {
    if (employeeId && actionBy) {
      fetchAttendanceByAction(actionBy); // Fetch attendance for the specific employeeId
    }
  }, [employeeId, actionBy]); // When either employeeId or actionBy changes

  // Handle 'Time In' action
  const handleTimeIn = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/attendance/time-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }) // Send only the action (employeeId)
      });
      const data = await response.json();
      setTimeIn(data.timeIn);
      setAttendanceId(data.id);
      setButtonColor('success');
      // Save Time In and Attendance ID in localStorage
      localStorage.setItem(`timeIn_${employeeId}`, data.timeIn);
      localStorage.setItem(`attendanceId_${employeeId}`, data.id);
      localStorage.setItem(`employeeId_${employeeId}`, employeeId.toString());
    } catch (error) {
      console.error('Error during Time In:', error);
    }
  };

  // Handle 'Time Out' action
  const handleTimeOut = async () => {
    try {
      await fetch(`http://localhost:8080/api/attendance/time-out/${attendanceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      setTimeOut(currentTime);
      setButtonColor('primary'); // Reset button color back to Time In
      // Save Time Out to localStorage
      localStorage.setItem(`timeOut_${employeeId}`, currentTime);
      // Clear Time In data as attendance is complete
      localStorage.removeItem(`timeIn_${employeeId}`);
      localStorage.removeItem(`attendanceId_${employeeId}`);
      localStorage.removeItem(`employeeId_${employeeId}`);
    } catch (error) {
      console.error('Error during Time Out:', error);
    }
  };

  // Toggle visibility of attendance data
  const toggleAttendanceVisibility = () => {
    setIsAttendanceVisible(!isAttendanceVisible); // Toggle state
  };

  return (
    <div className="container">
      {/* Mark Attendance Section */}
      <h2>Mark Attendance</h2>
      <h3>Employee Attendance for Employee ID: {employeeId}</h3> {/* Display employeeId */}
      <button className="btn btn-info" onClick={() => navigate('/Attendancelist')}>
        Go to Attendance List
      </button>

      <div className="time-display">
        Current Date: <span>{currentDate}</span> <br />
        Day: <span>{currentDay}</span> <br />
        Current Time: <span>{currentTime}</span>
      </div>

      <div className="buttons">
        {/* Time In and Time Out buttons */}
        {!timeIn && !timeOut && (
          <button className={`btn btn-${buttonColor}`} onClick={handleTimeIn}>
            Time In
          </button>
        )}
        {timeIn && !timeOut && (
          <button className={`btn btn-${buttonColor}`} onClick={handleTimeOut}>
            Time Out
          </button>
        )}
      </div>

      <div className="record col-lg-12">
        <p><strong>Time In:</strong> {timeIn}</p>
        <p><strong>Time Out:</strong> {timeOut}</p>
      </div>

      {/* Attendance Action Dropdown */}
      <div className="attendance-action">
        <p>Action (Employee ID): {action}</p>
      </div>

      {/* Attendance By Action Section */}
      <h2 className="mt-5">Attendance by Action</h2>

      {/* Button to toggle attendance visibility */}
      <Form.Group controlId="actionSelect" className="mb-4">
        <Form.Label>Select Action</Form.Label>
        <div>
          {/* Button to toggle attendance display */}
          <Button
            variant="primary"
            onClick={() => {
              setActionBy('2'); // Sets actionBy value to '2' when clicked
              toggleAttendanceVisibility(); // Toggle attendance visibility
            }}
          >
            {isAttendanceVisible ? 'Hide Attendance' : 'Show Attendance'}
          </Button>
        </div>
      </Form.Group>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">Error: {error}</Alert>
      ) : (
        <>
          {/* Conditionally render the attendance table */}
          {isAttendanceVisible && attendance.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date In</th>
                  <th>Time In</th>
                  <th>Time Out</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((att, index) => (
                  <tr key={index}>
                    <td>{att.id}</td>
                    <td>{att.date}</td>
                    <td>{att.timeIn}</td>
                    <td>{att.timeOut}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div>No attendance data available</div>
          )}
        </>
      )}
    </div>
  );
};

export default MarkAttendance;

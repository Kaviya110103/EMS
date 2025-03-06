import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AttendanceList = () => {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [employeeIdFilter, setEmployeeIdFilter] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  // Fetch attendance data on component mount
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/attendance');
        setAttendance(response.data);
        setFilteredAttendance(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);
 

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };
  
  // Format the time for display
  const formatTime = (time) => {
    if (!time) return 'Not yet recorded';
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], options);
  };

  // Filter attendance based on selected date and employee ID
  const handleFilter = () => {
    let filtered = [...attendance];

    if (selectedDate) {
      filtered = filtered.filter((record) => record.dateIn === selectedDate);
    }

    if (employeeIdFilter) {
      filtered = filtered.filter((record) => record.action === employeeIdFilter);
    }

    setFilteredAttendance(filtered);
  };

// Calculate present count for today
const getPresentCount = () => {
  const todayDate = getTodayDate();
  return attendance.filter(
    (record) => record.dateIn === todayDate && record.timeIn && record.timeOut
  ).length;
};

// Calculate absent count for today
const getAbsentCount = () => {
  const todayDate = getTodayDate();
  return attendance.filter(
    (record) => record.dateIn === todayDate && (!record.timeIn || !record.timeOut)
  ).length;
};


  // Filter records by presence status
  const filterByPresence = (status) => {
    setFilterStatus(status);
    if (status === 'present') {
      setFilteredAttendance(attendance.filter(record => record.timeIn && record.timeOut));
    } else if (status === 'absent') {
      setFilteredAttendance(attendance.filter(record => !record.timeIn || !record.timeOut));
    } else {
      setFilteredAttendance(attendance);
    }
  };

  // If still loading
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  // If there was an error
  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  const presentCount = getPresentCount();
  const absentCount = getAbsentCount();

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Attendance Records</h2>

      {/* Display Total Present and Absent Count */}
      <div className="alert alert-info d-flex justify-content-between">
        <div>
          <strong>Total Present Today:</strong> {presentCount}
        </div>
        <div>
          <strong>Total Absent Today:</strong> {absentCount}
        </div>
      </div>

      {/* Display Total Present and Absent Count for Today */}
<div className="alert alert-info d-flex justify-content-between">
  <div>
    <strong>Present Today:</strong> {presentCount}
  </div>
  <div>
    <strong>Absent Today:</strong> {absentCount}
  </div>
</div>


      {/* Buttons to filter records */}
      <div className="mb-4 d-flex gap-3">
        <Button variant="success" onClick={() => filterByPresence('present')}>
          Show Present ({presentCount})
        </Button>
        <Button variant="warning" onClick={() => filterByPresence('absent')}>
          Show Absent ({absentCount})
        </Button>
        <Button variant="info" onClick={() => filterByPresence('all')}>
          Show All
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <Form.Group controlId="filterDate">
          <Form.Label>Filter by Date</Form.Label>
          <Form.Control
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="filterEmployeeId" className="mt-3">
          <Form.Label>Filter by Employee ID</Form.Label>
          <Form.Control
            type="text"
            value={employeeIdFilter}
            onChange={(e) => setEmployeeIdFilter(e.target.value)}
            placeholder="Enter Employee ID"
          />
        </Form.Group>

        <Button className="mt-3" onClick={handleFilter}>
          Get
        </Button>
      </div>

      {/* Display Filtered Attendance */}
      {filteredAttendance.map((record) => (
        <Table striped bordered hover key={record.id}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date In</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Action</th>
              <th>Present/Absent</th>
              <th>View Profile</th>
              <th>Employee Attendance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{record.id}</td>
              <td>{record.dateIn}</td>
              <td>{formatTime(record.timeIn)}</td>
              <td>{formatTime(record.timeOut)}</td>
              <td>{record.action}</td>
              <td>{record.timeIn && record.timeOut ? 'Present' : 'Absent'}</td>
              <td>
                <Button variant="info" onClick={() => navigate(`/employee-profile/${record.action}`)}>
                  View Profile
                </Button>
              </td>
              <td>
                <Button variant="primary" onClick={() => navigate('/employee-attendance', { state: { employeeId: record.action } })}>
                  Employee Attendance
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      ))}
    </div>
  );
};

export default AttendanceList;

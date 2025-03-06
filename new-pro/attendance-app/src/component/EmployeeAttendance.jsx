import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Table, Spinner, Alert } from 'react-bootstrap';

const EmployeeAttendance = () => {
  const { state } = useLocation();  // Get the employeeId from the passed state
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the attendance for a specific employee
  useEffect(() => {
    if (state && state.employeeId) {
      const fetchAttendance = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/attendance/${state.employeeId}`);
          setAttendance(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchAttendance();
    }
  }, [state]);

  // Format the time for display
  const formatTime = (time) => {
    if (!time) return "Not yet recorded";
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], options);
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

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Employee Attendance</h2>
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
          {attendance.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.dateIn}</td>
              <td>{formatTime(record.timeIn)}</td>
              <td>{formatTime(record.timeOut)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default EmployeeAttendance;

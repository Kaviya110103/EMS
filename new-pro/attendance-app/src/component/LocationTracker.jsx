import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Spinner, Alert, Table, Modal, Container, Row, Col, Form } from 'react-bootstrap';
import '../style/markattendance.css';

const MarkAttendances = () => {
  const location = useLocation();
  const { employeeId } = location.state || {};
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState('--:--:--');
  const [currentDate, setCurrentDate] = useState('--/--/----');
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  const [attendanceId, setAttendanceId] = useState(null);
  const [buttonColor, setButtonColor] = useState('primary');
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [isAttendanceVisible, setIsAttendanceVisible] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (attendanceStatus) {
      localStorage.setItem(`attendanceStatus_${employeeId}`, attendanceStatus);
    }
  }, [attendanceStatus, employeeId]);

  const handleTimePresent = async () => {
    if (!attendanceStatus || attendanceStatus !== 'Present') {
      alert("Please select 'Present' to record attendance.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/attendance/time-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: employeeId,
          attendanceStatus: 'Present',
          timeIn: currentTime,
          timeOut: ''
        }),
      });
      const data = await response.json();
      setTimeIn(data.timeIn || currentTime);
      setAttendanceId(data.id);
      setButtonColor('success');

      localStorage.setItem(`timeIn_${employeeId}`, data.timeIn || currentTime);
      localStorage.setItem(`attendanceId_${employeeId}`, data.id);
      localStorage.setItem(`attendanceStatus_${employeeId}`, 'Present');
    } catch (error) {
      console.error('Error during Time Present:', error);
    }
  };

  const handleTimeAbsent = async () => {
    if (!attendanceStatus || attendanceStatus !== 'Absent') {
      alert("You must select 'Absent' to submit attendance.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/attendance/time-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: employeeId,
          attendanceStatus: 'Absent',
          timeIn: '00:00:00',
          timeOut: '00:00:00'
        }),
      });
      const data = await response.json();
      setAttendanceId(data.id);
      setButtonColor('success');
      alert("Attendance submitted as Absent.");

      setTimeIn('00:00:00');
      setTimeOut('00:00:00');

      localStorage.setItem(`attendanceId_${employeeId}`, data.id);
      localStorage.setItem(`attendanceStatus_${employeeId}`, 'Absent');
      clearLocalStorageAndReload();
    } catch (error) {
      console.error('Error during Time Absent:', error);
    }
  };

  const handleTimeOut = async () => {
    if (attendanceStatus === 'Absent') {
      alert("Cannot record Time Out for Absent attendance.");
      return;
    }

    try {
      await fetch(`http://localhost:8080/api/attendance/time-out/${attendanceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      setTimeOut(currentTime);
      setButtonColor('danger');

      const hoursWorked = calculateTotalHours(timeIn, currentTime);
      setTotalHours(hoursWorked);
      setShowModal(true);
      localStorage.setItem(`timeOut_${employeeId}`, currentTime);
    } catch (error) {
      console.error('Error during Time Out:', error);
    }
  };

  const calculateTotalHours = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}Z`);
    const end = new Date(`1970-01-01T${endTime}Z`);
    const difference = end - start;
    const hours = Math.floor(difference / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const clearLocalStorageAndReload = () => {
    localStorage.removeItem(`timeIn_${employeeId}`);
    localStorage.removeItem(`timeOut_${employeeId}`);
    localStorage.removeItem(`attendanceId_${employeeId}`);
    localStorage.removeItem(`attendanceStatus_${employeeId}`);
  };

  const fetchAttendanceByAction = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/attendance/action?action=${employeeId}`);
      setAttendance(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendanceVisibility = () => {
    setIsAttendanceVisible(!isAttendanceVisible);
    if (!isAttendanceVisible) {
      fetchAttendanceByAction();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    clearLocalStorageAndReload();
    window.location.reload();
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Mark Attendance</h2>
      <h4 className="text-center mb-4">Employee ID: {employeeId}</h4>

      <Row className="text-center">
        <Col>
          <p>Current Date: <strong>{currentDate}</strong></p>
          <p>Current Time: <strong>{currentTime}</strong></p>
        </Col>
      </Row>

      <Row className="text-center mb-4">
        <Col>
          <Button variant={buttonColor} onClick={handleTimePresent}>
            Time Present
          </Button>
          <Button variant="warning" onClick={handleTimeOut} disabled={!timeIn}>
            Time Out
          </Button>
          <Button variant="danger" onClick={handleTimeAbsent}>
            Submit Absent
          </Button>
        </Col>
      </Row>

      <Form className="text-center mb-4">
        <Form.Check
          inline
          label="Present"
          type="radio"
          value="Present"
          checked={attendanceStatus === 'Present'}
          onChange={(e) => setAttendanceStatus(e.target.value)}
        />
        <Form.Check
          inline
          label="Absent"
          type="radio"
          value="Absent"
          checked={attendanceStatus === 'Absent'}
          onChange={(e) => setAttendanceStatus(e.target.value)}
        />
      </Form>

      <Button className="mb-4" onClick={toggleAttendanceVisibility}>
        {isAttendanceVisible ? 'Hide Attendance Data' : 'Show Attendance Data'}
      </Button>

      {isAttendanceVisible && (
        <>
          {loading && <Spinner animation="border" variant="primary" />}
          {error && <Alert variant="danger">Error: {error}</Alert>}
          {!loading && !error && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Attendance ID</th>
                  <th>Employee ID</th>
                  <th>Time In</th>
                  <th>Time Out</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{record.id}</td>
                    <td>{record.action}</td>
                    <td>{record.attendanceStatus === 'Absent' ? '00:00:00' : record.timeIn}</td>
                    <td>{record.attendanceStatus === 'Absent' ? '00:00:00' : record.timeOut}</td>
                    <td>{record.attendanceStatus}</td>
                    <td>{record.dateIn}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Attendance Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Total Hours Worked: {totalHours}</p>
          <p>Time In: {timeIn}</p>
          <p>Time Out: {timeOut}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MarkAttendances;

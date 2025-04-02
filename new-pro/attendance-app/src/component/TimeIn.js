import React, { useState, useEffect } from "react";
import axios from "axios";
import '../style/EnterAttendance.css';

const TimeIn = ({ employeeId, onTimeIn }) => {
  const [selectedStatus, setSelectedStatus] = useState("Present");
  const [isAttendanceRecorded, setIsAttendanceRecorded] = useState(false);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/attendance/employee/${employeeId}`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          const lastAttendance = data[data.length - 1];

          // Check if attendance has already been recorded for today
          const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
          const lastAttendanceDate = lastAttendance?.dateIn?.split('T')[0]; // Assuming dateIn is in 'YYYY-MM-DD' format

          if (lastAttendanceDate === currentDate) {
            setIsAttendanceRecorded(true);
          } else {
            setIsAttendanceRecorded(false);
          }
        } else {
          console.error("Expected an array, but received:", data);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    if (employeeId) {
      fetchAttendanceData();
    }
  }, [employeeId]);

  const handleMarkAbsent = async () => {
    try {
      await axios.post("http://localhost:8080/api/attendance/mark-absent", null, {
        params: { employeeId },
      });

      alert("Attendance marked as Absent successfully!");
      window.location.reload(); // Refresh the page after marking as Absent
    } catch (error) {
      console.error("Error marking attendance as absent:", error);
      alert("Failed to mark attendance as Absent.");
    }
  };

  const handleTimeIn = async (event) => {
    event.preventDefault();

    if (selectedStatus !== "Present") {
      alert("Please select 'Present' before marking Time In.");
      return; // Prevent Time In if status is not Present
    }

    if (isAttendanceRecorded) {
      alert("Attendance has already been recorded for today.");
      return; // Prevent submitting attendance if already recorded
    }

    try {
      const payload = {
        employeeId: 12,
        attendanceStatus: selectedStatus,
      };

      const response = await axios.post("http://localhost:8080/api/attendance/time-in", payload);

      alert("Time In recorded successfully.");
      onTimeIn(response.data.id); // Pass the latest attendance ID to the parent component
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data); // Display backend error message
      } 
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "400px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      {/* Conditionally show radio buttons for attendance status */}
      {!isAttendanceRecorded && (
        <div className="wrapper">
          <input
            type="radio"
            name="select"
            id="option-1"
            value="Present"
            checked={selectedStatus === 'Present'}
            onChange={() => setSelectedStatus('Present')}
          />
          <input
            type="radio"
            name="select"
            id="option-2"
            value="Absent"
            checked={selectedStatus === 'Absent'}
            onChange={() => setSelectedStatus('Absent')}
          />
          
          <label htmlFor="option-1" className="option option-1">
            <div className="dot"></div>
            <span>Present</span>
          </label>
          
          <label htmlFor="option-2" className="option option-2">
            <div className="dot"></div>
            <span>Absent</span>
          </label>
        </div>
      )}

      {/* Buttons for Time In and Mark Absent */}
      {selectedStatus === "Present" && !isAttendanceRecorded && (
        <button className="buttontimein col-5" type="button" onClick={handleTimeIn}>
          <span>Time In</span>
        </button>
      )}

      {selectedStatus === "Absent" && !isAttendanceRecorded && (
        <button
          onClick={handleMarkAbsent}
          type="button"
          className="buttontimein"
        >
          Submit Absent
        </button>
      )}
    </div>
  );
};

export default TimeIn;
import React, { useState, useEffect } from "react";
import axios from "axios";
import '../style/EnterAttendance.css';

const EnterAttendance = ({ employeeId, onTimeIn }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Present");
  const [attendanceDetails, setAttendanceDetails] = useState(null);
  const [isAttendanceRecorded, setIsAttendanceRecorded] = useState(false);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/attendance/employee/${employeeId}`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setAttendanceData(data);
          const lastAttendance = data[data.length - 1];
          setAttendanceDetails(lastAttendance);

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
        employeeId: employeeId.toString(),
        attendanceStatus: selectedStatus,
      };

      await axios.post("http://localhost:8080/api/attendance/time-in", payload);

      alert("Time In recorded successfully.");
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data); // Display backend error message
      } else {
        console.error("Error submitting Time In:", error);
        alert("Failed to record Time In.");
      }
    }
  };

  const handleTimeOut = async (event) => {
    event.preventDefault();

    try {
      const latestAttendanceId = attendanceDetails?.id;
      if (!latestAttendanceId) return;

      await axios.post(
        `http://localhost:8080/api/attendance/time-out/${latestAttendanceId}`
      );

      window.location.reload();
    } catch (error) {
      console.error("Error during Time Out:", error);
      alert("Failed to record Time Out.");
    }
  };

  const hasTimeIn = !!attendanceDetails?.timeIn;
  const hasTimeOut = !!attendanceDetails?.timeOut;

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
      {!hasTimeIn && !hasTimeOut && !isAttendanceRecorded && (
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
      {selectedStatus === "Present" && !hasTimeIn && !isAttendanceRecorded && (
        <button className="buttontimein col-5" type="button" onClick={handleTimeIn}>
          <span>Time In</span>
        </button>
      )}

      {selectedStatus === "Absent" && !hasTimeIn && !isAttendanceRecorded && (
        <button
          onClick={handleMarkAbsent}
          type="button"
          className="buttontimein"
        >
          Submit Absent
        </button>
      )}

      {/* Time Out button (only show if Time In exists but Time Out is not recorded) */}
      {hasTimeIn && !hasTimeOut && (
        <button
          onClick={handleTimeOut}
          type="button"
          className="buttontimein"
        >
          Time Out
        </button>
      )}
    </div>
  );
};

export default EnterAttendance;

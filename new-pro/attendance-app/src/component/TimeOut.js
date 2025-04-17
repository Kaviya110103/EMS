import React from "react";
import axios from "axios";
import '../style/EnterAttendance.css';

const TimeOut = ({ latestAttendanceId }) => {
  const handleTimeOut = async (event) => {
    event.preventDefault();

    try {
      if (!latestAttendanceId) return;

      await axios.post(
        `http://localhost:8080/api/attendance/time-out/${latestAttendanceId}`
      );

      alert("Time Out recorded successfully.");
      window.location.reload();
    } catch (error) {
      console.error("Error during Time Out:", error);
      alert("Failed to record Time Out.");
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
      <button
        onClick={handleTimeOut}
        type="button"
        className="buttontimein"
      >
        Time Out
      </button>
    </div>
  );
};

export default TimeOut;
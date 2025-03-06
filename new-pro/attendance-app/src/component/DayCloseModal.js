import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaClock } from "react-icons/fa";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
    borderRadius: "10px",
    background: "#fff",
    border: "none",
    padding: "20px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
};

const DayCloseModal = ({ employeeId, timeIn, timeOut, attendanceId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDayClosed, setIsDayClosed] = useState(false); // Hide button after closing day
  const [isUpdating, setIsUpdating] = useState(false); // Show loading state
  const [attendanceData, setAttendanceData] = useState({
    id: "Fetching...",
    dateIn: "Fetching...",
    dayStatus: "Fetching...",
    statusMessage: "Checking...",
  });

 


  useEffect(() => {
    async function fetchAttendance() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/attendance/employee/${employeeId}`
        );
        const data = await response.json();
  
        console.log("Fetched attendance data:", data);
  
        if (data && data.length > 0) {
          const lastAttendance = data[data.length - 1]; // Get last record
          console.log("Extracted last attendance:", lastAttendance);
          const todayDate = new Date().toISOString().split("T")[0];
  
          let statusMessage = "Attendance is recorded";
  
          if (
            lastAttendance.dateIn === todayDate &&
            lastAttendance.dayStatus === "Completed"
          ) {
            statusMessage = "Attendance was recorded";
            setIsDayClosed(true); // Hide button if attendance is completed
          }
  
          setAttendanceData({
            id: lastAttendance.id,
            dateIn: lastAttendance.dateIn,
            dayStatus: lastAttendance.dayStatus,
            statusMessage,
          });
        } else {
          setAttendanceData({
            id: "No data",
            dateIn: "No data",
            dayStatus: "No data",
            statusMessage: "No attendance data available",
          });
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setAttendanceData({
          id: "Error fetching data",
          dateIn: "Error fetching data",
          dayStatus: "Error fetching data",
          statusMessage: "Error fetching data",
        });
      }
    }
  
    fetchAttendance();
  }, [employeeId]);
  

  const handleDayCloseClick = () => {
    setIsModalOpen(true);
  };


  
  const updateDayStatus = async (attendanceId) => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/attendance/updateDayStatus/${attendanceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dayStatus: "Completed",
          }),
        }
      );
  
      if (response.ok) {
        console.log("Day status updated successfully");
        setTimeout(() => {
          setIsDayClosed(true);
        }, 1000); // Delay status update to allow modal visibility
      } else {
        console.error("Failed to update day status");
      }
    } catch (error) {
      console.error("Error updating day status:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  

  // const updateDayStatus = async (attendanceId) => {
  //   setIsUpdating(true);
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8080/api/attendance/updateDayStatus/${attendanceId}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           dayStatus: "Completed",
  //         }),
  //       }
  //     );
  
  //     if (response.ok) {
  //       console.log("Day status updated successfully");
  //       setIsDayClosed(true);
  
  //       // Show loading for 1 second before reloading
  //       setTimeout(() => {
  //         setIsModalOpen(false);
  //         // window.location.reload(); // Reload the page
  //       }, 1000);
  //     } else {
  //       console.error("Failed to update day status");
  //     }
  //   } catch (error) {
  //     console.error("Error updating day status:", error);
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };
  

  function formatTime(timeString) {
    const [hours, minutes, seconds] = timeString.split(":");
    const date = new Date(`1970-01-01T${timeString}Z`);

    let hour = date.getUTCHours();
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12;
    const formattedMinutes = date
      .getUTCMinutes()
      .toString()
      .padStart(2, "0");
    const formattedSeconds = date
      .getUTCSeconds()
      .toString()
      .padStart(2, "0");

    return `${hour}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
  }

  const calculateTotalHours = () => {
    if (!timeIn || !timeOut) return "Not available";
    const inTime = new Date(`1970-01-01T${timeIn}`);
    const outTime = new Date(`1970-01-01T${timeOut}`);
    const diff = outTime - inTime;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours} hours, ${minutes} minutes`;
  };

  return (
    <>
      <div style={{ textAlign: "center" }}>
        {/* Show button only if day is not closed */}
        {!isDayClosed && (
  <button className="col-7 text-center button-81"   onClick={() => {
    handleDayCloseClick(); 
    updateDayStatus(attendanceId);
  }}>
    Day Close
  </button>
)}

        {/* Show attendance details when the button is hidden */}
        {!isModalOpen && isDayClosed && (
  <div>
    <h2>{attendanceData.statusMessage}</h2>
  </div>
)}

      </div>

      {/* Modal for Day Close */}
      <Modal
  isOpen={isModalOpen}
  onRequestClose={() => setIsModalOpen(false)} // Ensure this works
  style={customStyles}
  ariaHideApp={false}
>
  <div style={{ marginBottom: "20px" }}>
    <img
      src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
      alt="Success"
      style={{
        width: "50px",
        height: "50px",
        margin: "0 auto",
        display: "block",
      }}
    />
  </div>
  <h2 style={{ color: "#4caf50", margin: "10px 0", fontSize: "18px" }}>
    Success!
  </h2>
  <strong>Status: Present</strong>
  <div className="modal-body mt-2">
    <p><strong>Time In:</strong> {timeIn ? formatTime(timeIn) : "Not available"}</p>
    <p><strong>Time Out:</strong> {timeOut ? formatTime(timeOut) : "Not available"}</p>
    <p><strong>Total Working Hours:</strong> {calculateTotalHours()}</p>
  </div>
  <div>
    <p style={{ color: "#555", fontSize: "14px" }}>
      "If you're planning to take tomorrow off, don't forget to submit your leave request"
    </p>
    <button
      className="btn btn-danger btn-block mt-2"
      onClick={() => setIsModalOpen(false)}
    >
      Close
    </button>
  </div>
</Modal>

    </>
  );
};

export default DayCloseModal;

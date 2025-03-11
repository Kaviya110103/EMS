import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "../style/Calendar.css";

const EmployeeCalendar = ({ employeeId }) => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const fetchAttendanceData = (month, year) => {
    if (!employeeId) return; // Ensure employeeId is available before fetching

    axios
      .get(`http://localhost:8080/api/attendance/employee/${employeeId}?month=${month + 1}&year=${year}`)
      .then((response) => {
        console.log("Fetched attendance data:", response.data); // Log the fetched data
        setAttendanceList(response.data);
      })
      .catch((error) => console.error("Error fetching attendance data:", error));
  };

  useEffect(() => {
    fetchAttendanceData(currentMonth, currentYear);
  }, [currentMonth, currentYear, employeeId]);

  const formatTime = (timeString) => {
    return timeString ? timeString.split(".")[0] : "Not Available";
  };

  const calculateTotalHours = () => {
    if (!selectedAttendance?.timeIn || !selectedAttendance?.timeOut) return "Not Available";
    const timeIn = new Date(`1970-01-01T${selectedAttendance.timeIn}`);
    const timeOut = new Date(`1970-01-01T${selectedAttendance.timeOut}`);
    const diff = (timeOut - timeIn) / (1000 * 60 * 60);
    return `${diff.toFixed(2)} hours`;
  };

  const openModal = (attendance) => {
    if (!attendance) return;
    setSelectedAttendance(attendance);
    setIsModalOpen(true);
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };

  const getDatesInMonth = (month, year) => {
    const dates = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in the month
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)

    // Fill the beginning of the array with null values for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      dates.push(null);
    }

    // Add all the dates of the month in the format "YYYY-MM-DD"
    for (let day = 2; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const formattedDate = date.toISOString().split("T")[0]; // Format: "YYYY-MM-DD"
      dates.push(formattedDate);
    }

    return dates;
  };

  const dates = getDatesInMonth(currentMonth, currentYear);

  // Array of day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="calendar-container container">
      <h2 className="text-center mb-4">Employee Attendance</h2>

      <div className="arrow-container">
        <a onClick={goToPreviousMonth}><span className="arrow left"></span></a>
        <h6>
          {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })} {currentYear}
        </h6>
        <a onClick={goToNextMonth}><span className="arrow right"></span></a>
      </div>

      {/* Day Names Row */}
      <div className="calendar-grid day-names">
        {dayNames.map((day, index) => (
          <div key={index} className="calendar-day">
            <p className="fw-bold">{day}</p>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {dates.map((date, index) => {
          const attendance = attendanceList.find((item) => item.dateIn === date); // Ensure date formats match
          return (
            <div
              key={index}
              className={`calendar-day ${date ? "" : "empty"} ${attendance ? "clickable" : ""}`}
              onClick={() => openModal(attendance)}
            >
              {date ? (
                <>
                  <p className="fw-bold">{new Date(date).getDate()}</p>
                  <h6
  className={
    attendance?.attendanceStatus === "Present"
      ? "attendance-present" // Custom class for "Present"
      : attendance?.attendanceStatus === "Absent"
      ? "attendance-absent" // Custom class for "Absent"
      : "attendance-no-data" // Custom class for "No Data"
  }
>
  {attendance ? attendance.attendanceStatus : "No Data"}
</h6>
                </>
              ) : (
                <p>&nbsp;</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Attendance Details Modal */}
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Attendance Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAttendance ? (
            <>
              <p className="text-center">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    selectedAttendance.attendanceStatus === "Present"
                      ? "text-success"
                      : selectedAttendance.attendanceStatus === "Absent"
                      ? "text-danger"
                      : ""
                  }
                >
                  {selectedAttendance.attendanceStatus}
                </span>
              </p>
              <p>
                <strong>Time In:</strong> {formatTime(selectedAttendance.timeIn)}
              </p>
              <p>
                <strong>Time Out:</strong> {formatTime(selectedAttendance.timeOut)}
              </p>
              <p>
                <strong>Date:</strong> {selectedAttendance.dateIn}
              </p>
              <p>
                <strong>Total Working Hours:</strong> {calculateTotalHours()}
              </p>

              {/* Display Images */}
              <div className="d-flex justify-content-center gap-3 mt-3">
                <img
                  src={`http://localhost:8080/api/images/displayImage1ByAttendanceId/${selectedAttendance.id}`}
                  alt="Attendance Image 1"
                  className="img-thumbnail"
                  style={{ width: "200px", height: "200px", objectFit: "cover" }}
                />
                <img
                  src={`http://localhost:8080/api/images/displayImage2ByAttendanceId/${selectedAttendance.id}`}
                  alt="Attendance Image 2"
                  className="img-thumbnail"
                  style={{ width: "200px", height: "200px", objectFit: "cover" }}
                />
              </div>
            </>
          ) : (
            <p className="text-center">No attendance details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeCalendar;
import React, { useEffect, useState } from "react";
import UploadImage2Modal from "./UploadImage2Modal";
import Modal from "react-modal";
import EnterAttendance from './EnterAttendance';
import axios from "axios";
import '../style/EnterAttendance.css';

import DayCloseModal from './DayCloseModal';


// import '../style/Clock.css'; // Import CSS for styling



const ImageDisplay = ({ imageId, attendanceId, employeeId, timeIn, timeOut, onTimeIn ,onAttendanceIdChange }) => {
  const [imageUrl1, setImageUrl1] = useState(null);
  const [imageUrl2, setImageUrl2] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dayCloseClicked, setDayCloseClicked] = useState(false);
  const [buttonText, setButtonText] = useState("Day Close");
  const [isDayStarted, setIsDayStarted] = useState(false); // Track if the day has started
  const [attendanceStatus, setAttendanceStatus] = useState("present"); // Track attendance status
  const [selectedStatus, setSelectedStatus] = useState("Present");
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [todayDate, setTodayDate] = useState("");

  const [attendanceData, setAttendanceData] = useState({ id: 'Fetching...', dateIn: 'Fetching...', dayStatus: 'Fetching...', statusMessage: 'Checking...' });

  useEffect(() => {
    async function fetchAttendance() {
        try {
            const response = await fetch(`http://localhost:8080/api/attendance/employee/5`);
            const data = await response.json();
            
            console.log("Fetched attendance data:", data); // Debugging log

            if (data && data.length > 0) {
                const lastAttendance = data[data.length - 1]; // Get the last record
                console.log("Extracted last attendance:", lastAttendance);
                const todayDate = new Date().toISOString().split('T')[0];
                
                let statusMessage = "Attendance is not recorded";
                if (lastAttendance.dateIn === todayDate && lastAttendance.dayStatus === "Completed") {
                    statusMessage = "Attendance was recorded";
                }
                
                setAttendanceData({ 
                    id: lastAttendance.id, 
                    dateIn: lastAttendance.dateIn, 
                    dayStatus: lastAttendance.dayStatus, 
                    statusMessage
                });
            } else {
                setAttendanceData({ id: 'No data', dateIn: 'No data', dayStatus: 'No data', statusMessage: 'No attendance data available' });
            }
        } catch (error) {
            console.error("Error fetching attendance data:", error);
            setAttendanceData({ id: 'Error fetching data', dateIn: 'Error fetching data', dayStatus: 'Error fetching data', statusMessage: 'Error fetching data' });
        }
    }

    fetchAttendance();
}, [employeeId]);

  useEffect(() => {
    const fetchImages = async () => {
      if (imageId) {
        try {
          // Fetch Image 1
          const response1 = await fetch(`http://localhost:8080/api/images/displayImage1/${imageId}`);
          if (response1.ok) {
            setImageUrl1(`http://localhost:8080/api/images/displayImage1/${imageId}`);
          }

          // Fetch Image 2
          const response2 = await fetch(`http://localhost:8080/api/images/displayImage2/${imageId}`);
          if (response2.ok) {
            setImageUrl2(`http://localhost:8080/api/images/displayImage2/${imageId}`);
          }
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      }
    };

    fetchImages();

    // Check if the Day Close button was clicked for this employeeId
    const storedStatus = localStorage.getItem(`dayCloseClicked-${employeeId}`);
    if (storedStatus === "true") {
      setDayCloseClicked(true);
      setButtonText("Day Start"); // Change button text to "Day Start" after Day Close
    }
  }, [imageId, employeeId]);


  useEffect(() => {
    // Get today's date in YYYY-MM-DD format      C:\Users\student\Desktop\jilla\Employee Attendance web app\my-app\src\component\LeavePermissionManager.js
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    setTodayDate(today);

    const fetchAttendanceData = async () => {
      try {
        // Fetch attendance details for the given employee ID
        const response = await axios.get(
          `http://localhost:8080/api/attendance/employee/${employeeId}`
        );

        // If response data is available
        if (response.data?.length) {
          setAttendanceDetails(response.data);

          // Optionally pass the first attendanceId to the parent
          if (response.data[0].id) {
            onAttendanceIdChange(response.data[0].id);  // Pass the first attendanceId to parent
          }
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    if (employeeId) {
      fetchAttendanceData();
    }
  }, [employeeId, onAttendanceIdChange]);
  // Handle the "Day Close" or "Day Start" button click
  const handleDayCloseClick = () => {
    if (!dayCloseClicked) {
      // Handle Day Close
      localStorage.setItem(`dayCloseClicked-${employeeId}`, "true");
      setDayCloseClicked(true);
      setButtonText("Day Start"); // Change button text after closing the day
      console.log(`Day Close clicked for Employee ID: ${employeeId}`);
    } else {
      // Handle Day Start
      localStorage.removeItem(`dayCloseClicked-${employeeId}`); // Clear localStorage
      setDayCloseClicked(false);
      setButtonText("Day Close"); // Change button text back to "Day Close"
      setIsDayStarted(true); // Set state to indicate the day has started
      console.log(`Day Start clicked for Employee ID: ${employeeId}`);
    }
  };

  // Handle attendance status change
  const handleAttendanceChange = (status) => {
    setAttendanceStatus(status);
    console.log(`Attendance marked as: ${status}`);
  };

  // Calculate total working hours
  const calculateTotalHours = () => {
    if (!timeIn || !timeOut) return "Not available";
    const inTime = new Date(`1970-01-01T${timeIn}`);
    const outTime = new Date(`1970-01-01T${timeOut}`);
    const diff = outTime - inTime; // Difference in milliseconds
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours} hours, ${minutes} minutes`;
  };

  const handleTimeIn = async (event) => {
    event.preventDefault();
  
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
  

  const handleMarkAbsent = async (event) => {
    event.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/attendance/mark-absent", null, {
        params: { employeeId },
      });

      alert("Attendance marked as Absent successfully!");
    } catch (error) {
      console.error("Error marking attendance as absent:", error);
      alert("Failed to mark attendance as Absent.");
    }
  };

  return (
    <div className="text-center">
 <div>
 {attendanceDetails.map((attendance) => (
  <div key={attendance.id}>
    {attendance.dateIn === todayDate && imageUrl2 && (
      <h6 style={{ fontWeight: "bold", marginTop: "10px" }}>
<div>
      <DayCloseModal employeeId={employeeId} timeIn={timeIn} timeOut={timeOut} attendanceId={attendanceId} />
    </div>      </h6> 
    )}
    
  </div>
))}


  {/* "Start Day" button with additional condition */}
  {!isDayStarted &&
    imageUrl1 &&
    imageUrl2 &&
    !attendanceDetails.some((attendance) => attendance.dateIn === todayDate) && (
      <div className="d-flex justify-content-center align-items-center">
        <button onClick={handleDayCloseClick} className="button-33">
          Start Day
        </button>
        
      </div>
    )}
</div>


  {/* Image ID display */}
  {!imageId && (
    <div className="mb-3">
      <p>No Image ID provided.</p>
    </div>
  )}

  {/* Display Image 1 if available */}
  {imageUrl1 && (
    <div className="mb-3">
      <img
        src={imageUrl1}
        alt="Image 1"
        className="img-fluid rounded-3"
        style={{ width: "200px", height: "200px", objectFit: "cover", display: "none" }}
      />
    </div>
  )}

  {/* Display Image 2 or upload modal */}
  {imageUrl2 ? (
    <div className="mb-3">
      <img
        src={imageUrl2}
        alt="Image 2"
        className="img-fluid rounded-3"
        style={{ width: "200px", height: "200px", objectFit: "cover", display: "none" }}
      />
    </div>
  ) : (
    timeIn &&
    timeOut && (
      <UploadImage2Modal
        attendanceId={attendanceId}
        imageId={imageId}
        employeeId={employeeId}
        timeIn={timeIn}
        timeOut={timeOut}
        onTimeIn={onTimeIn}
      />
    )
  )}

  {/* No images found */}
  {!imageUrl1 && !imageUrl2 && (
    <div className="mb-3">
      <p>No images found for the provided ID.</p>
    </div>
  )}

  {/* Attendance Marking Section if Day is Started */}
  {isDayStarted && (
    <div className="mt-4 below-section">
      <div className="wrapper">
        <input
          type="radio"
          name="select"
          id="option-1"
          value="Present"
          checked={selectedStatus === "Present"}
          onChange={() => setSelectedStatus("Present")}
        />
        <input
          type="radio"
          name="select"
          id="option-2"
          value="Absent"
          checked={selectedStatus === "Absent"}
          onChange={() => setSelectedStatus("Absent")}
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
      <div>
        {selectedStatus === "Absent" && (
          <button onClick={handleMarkAbsent} className="buttontimein btn-sm mt-3">
            Submit Absent
          </button>
        )}
        {selectedStatus === "Present" && (
          <button type="button" className="buttontimein" onClick={handleTimeIn}>
            <span>Time In</span>
          </button>
        )}

        <div className="mt-4">
          <EnterAttendance employeeId={employeeId} attendanceId={attendanceId} imageId={imageId} />
        </div>
      </div>
    </div>
  )}

  {/* Attendance Details Section */}


  <div style={{ padding: "20px" }}>
    {attendanceDetails.length > 0 ? (
      <div>
        {/* <h2>
          Attendance Details for Employee {attendanceDetails[0].employee.firstName}{" "}
          {attendanceDetails[0].employee.lastName}
        </h2> */}

        {/* <h3>Attendance Information</h3> */}
      </div>
    ) : (
      <p>Loading attendance details...</p>
    )}
  </div>
</div>

  );
};
export default ImageDisplay;



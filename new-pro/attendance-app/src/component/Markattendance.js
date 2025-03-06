import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MarkEmployee from './MarkEmployee'; 
import DateTimeCard from './DateTimeCard';  
import AttendanceDetails from './AttendanceDetails';
import Navbar from './Navbar';
import LeavePermissionEmployee from './LeavePermissionEmployee';
import '../style/Clock.css'; // Import CSS for styling
import logo from '../images/logo.png'; // Adjust the path as per your project structure
import axios from 'axios';

function Markattendance() {
  const { state } = useLocation();
  const { employeeId, firstName, lastName, username, position, profileImage } = state;
  const [attendanceId, setAttendanceId] = useState(null);
  const [lastRequestStatus, setLastRequestStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLastRequestStatus();
  }, []);

  const fetchLastRequestStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/leave-permissions?employeeId=${employeeId}`);
      const requests = response.data;
      if (requests.length > 0) {
        const lastRequest = requests[requests.length - 1];
        setLastRequestStatus(lastRequest.status);
      }
    } catch (error) {
      console.error("Error fetching leave permission requests:", error);
    }
  };

  const handleAttendanceId = (id) => {
    setAttendanceId(id);
    console.log('Received Attendance ID:', id);
  };

  const employee = {
    id: employeeId,
    firstName: firstName,
    lastName: lastName,
    username: username,
    position: position,
    profileImage: profileImage
  };

  const [activeComponent, setActiveComponent] = useState("markEmployee");

  const handleRequestsClick = () => {
    setActiveComponent(prevComponent =>
      prevComponent === "leavePermission" ? "markEmployee" : "leavePermission"
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/loginEmployee');
  };

  return (
    <div style={{ overflowY: 'auto', maxHeight: '100vh', margin: '0px', backgroundColor: '#f4f8fb' }}>
      <div className="d-flex justify-content-start align-items-center flex-column min-vh-100 mt-3 ml-3">
        <div className="col-10 mb-4 ">
          <nav
            className="nav nav-borders"
            style={{
              backgroundColor: 'navy',
              padding: '5px',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',  // Allow wrapping for smaller screens
            }}
          >
            {/* Logo Section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: '1 1 auto', // Allows flexibility
                marginBottom: '10px', // Adds space between items on smaller screens
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundImage: `url(${logo})`, // Use the imported image
                  backgroundSize: 'cover', // Ensure the image fits the circle
                  display: 'flex',
                  justifyContent: 'end',
                  alignItems: 'center',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  marginLeft: "20px",
                  marginTop: "3px",
                  backgroundColor: '#ffffff'
                }}
              >
                {/* Optional: Placeholder text if image is not available */}
                {/* L */}
              </div>
            </div>

            {/* Buttons Section */}
            <div
              style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'flex-end', // Align buttons to the right
                flex: '1 1 auto', // Allows flexibility
                marginBottom: '0px', // Adds space between items on smaller screens
              }}
            >
              <a
                className="nav-link"
                onClick={handleRequestsClick}
                style={{ color: '#ffffff', fontWeight: '600', cursor: 'pointer', display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                {activeComponent === 'leavePermission' ? 'Back' : 'Requests'}
                {(lastRequestStatus === 'Approved' || lastRequestStatus === 'Rejected') && (
                  <span style={{ marginLeft: '5px', color: 'red' }}>•</span>
                )}
              </a>
              <a
                className="nav-link"
                onClick={handleLogout}
                rel="noreferrer"
                style={{ color: '#ffffff', fontWeight: '600', cursor: 'pointer', display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                Logout
              </a>
            </div>
          </nav>

          {/* Media Queries for Responsiveness */}
        </div>

        {activeComponent === "markEmployee" && (
          <div className="col-10 mb-2" style={{ backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <MarkEmployee employee={employee} />
          </div>
        )}

        {activeComponent === "leavePermission" && (
          <div className="col-10 mb-5">
            <LeavePermissionEmployee employeeId={employeeId} attendanceId={attendanceId} />
            {/* {attendanceId && <p>Attendance ID from child: {attendanceId}</p>} */}
          </div>
        )}

        {activeComponent === "markEmployee" && (
          <div className="col-10 bg-light mb-2" style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <DateTimeCard />
          </div>
        )}

        {activeComponent === "markEmployee" && (
          <div className="col-10">
            <AttendanceDetails employeeId={employeeId} onAttendanceIdChange={handleAttendanceId} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Markattendance;
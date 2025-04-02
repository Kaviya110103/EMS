import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MarkEmployee from './MarkEmployee'; 
import DateTimeCard from './DateTimeCard';  
import AttendanceDetails from './AttendanceDetails';
import LeavePermissionEmployee from './LeavePermissionEmployee';
import EmployeeCalender from './EmployeeCalender';
// import LocationSelector from './LocationSelector';
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

  const handleEmployeeCalendar = () => {
    setActiveComponent(prevComponent =>
      prevComponent === "EmployeeCalender" ? "markEmployee" : "EmployeeCalender"
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
          <nav className="nav nav-borders"
            style={{
              backgroundColor: 'navy',
              padding: '5px',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* Logo Section */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flex: '1 1 auto',
            }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundImage: `url(${logo})`,
                  backgroundSize: 'cover',
                  marginLeft: "20px",
                  marginTop: "3px",
                  backgroundColor: '#ffffff'
                }}
              >
              </div>
            </div>

            {/* Buttons Section */}
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'flex-end',
              flex: '1 1 auto',
            }}>
              <a
                className="nav-link"
                onClick={handleRequestsClick}
                style={{ color: '#ffffff', fontWeight: '600', cursor: 'pointer' }}
              >
                {activeComponent === 'leavePermission' ? 'Back' : 'Requests'}
                {(lastRequestStatus === 'Approved' || lastRequestStatus === 'Rejected') && (
                  <span style={{ marginLeft: '5px', color: 'red' }}>•</span>
                )}
              </a>
              <a
                className="nav-link"
                onClick={handleEmployeeCalendar}
                style={{ color: '#ffffff', fontWeight: '600', cursor: 'pointer' }}
              >
                {activeComponent === 'EmployeeCalender' ? 'Back' : 'Calendar'}
              </a>
              <a
                className="nav-link"
                onClick={handleLogout}
                rel="noreferrer"
                style={{ color: '#ffffff', fontWeight: '600', cursor: 'pointer' }}
              >
                Logout
              </a>
            </div>
          </nav>
        </div>

        {/* Display MarkEmployee by default */}
        {activeComponent === "markEmployee" && (
          <>
            <div className="col-10 mb-2" style={{ backgroundColor: '#ffffff', borderRadius: '10px' }}>
              <MarkEmployee employee={employee} />
              
            </div>
            <div className="col-10 bg-light mb-2" style={{ borderRadius: '10px' }}>
              <DateTimeCard />
            </div>
            <div className="col-10">
              <AttendanceDetails employeeId={employeeId} onAttendanceIdChange={handleAttendanceId} />
              {/* <LocationSelector /> */}
            </div>
          </>
        )}

        {/* Display Leave Permission Component */}
        {activeComponent === "leavePermission" && (
          <div className="col-10 mb-5">
            <LeavePermissionEmployee employeeId={employeeId} attendanceId={attendanceId} />
          </div>
        )}

        {/* Display Employee Calendar Component */}
        {activeComponent === "EmployeeCalender" && (
          <div className="col-10 mb-5">
            <EmployeeCalender employeeId={employeeId} />
          </div>
        )}
      </div>
  

    </div>
  );
}

export default Markattendance;

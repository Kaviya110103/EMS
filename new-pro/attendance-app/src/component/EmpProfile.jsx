import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; // Add useParams here
import { Button } from 'react-bootstrap'; // Import Button here
import { getEmployeeById } from '../service/EmployeeService'; // Import service for fetching employee
import '../style/profile.css';

const EmpProfile = () => {
  const { id } = useParams(); // Get the ID from the route parameters
  const [employee, setEmployee] = useState({
    id: '',
    firstName: '',
    lastName: '',
    position: '',
    branch: '',
    username: '',
    mobile: '',
    gender: '',
    dob: '',
    password: ''
  });

  const navigate = useNavigate();

  // Fetch employee data by ID
  useEffect(() => {
    getEmployeeById(id)
      .then((response) => {
        setEmployee(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  // Navigate to Admin Dashboard
  const handleGoToAdminDashboard = () => {
    navigate('/admindashboard'); // Navigate to admin dashboard
  };

  return (
    <div>
      {/* Name Navbar with Center-Aligned Employee Name */}
      <div className="name-navbar">
        <span>{employee.firstName} {employee.lastName}</span>
        <Button onClick={handleGoToAdminDashboard} className="btn-primary mt-3">
                Home
              </Button>
      </div>

      {/* Sidebar with Fixed Profile Photo and Employee Details */}
      <div className="sidebar d-flex flex-column align-items-center text-white">
        <img
          className="img-account-profile rounded-circle mb-2"
          src={employee.profileImage ? `http://localhost:8080/${employee.profileImage}` : "http://bootdey.com/img/Content/avatar/avatar1.png"}
          alt="Profile"
          style={{ width: '300px', height: '300px' }} // Set image width and height
        />
        <div className="employee-info">
          <h4>{employee.firstName} {employee.lastName}</h4>
          <p>{employee.position}</p>
        </div>
      </div>

      {/* Main Content Section with Employee Details and Buttons */}
      <div className="content">
        <div className="container content-container">
          <div className="row">
            <div className="col-12">
              <h3>Employee Details</h3>
              <hr />
              <div className="details-container">
                <strong>First Name:</strong>
                <span>{employee.firstName}</span>
                <strong>Last Name:</strong>
                <span>{employee.lastName}</span>
                <strong>Job Role:</strong>
                <span>{employee.position}</span>
                <strong>Date of Joining:</strong>
                <span>{employee.dateOfJoining}</span>
                <strong>Date of Birth:</strong>
                <span>{employee.dob}</span>
                <strong>Address:</strong>
                <span>{employee.address}</span>
                <strong>Email ID:</strong>
                <span>{employee.email}</span>
                <strong>Mobile No:</strong>
                <span>{employee.mobile}</span>
                <strong>Alternative Mobile No:</strong>
                <span>{employee.alternativeMobile}</span>
              </div>

              {/* Admin Dashboard Button */}
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpProfile;

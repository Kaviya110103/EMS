import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileUpload } from 'primereact/fileupload';
import '../style/EmployeeProfile.css';
import { Spinner, Alert } from 'react-bootstrap';
import MobNav from './MobNav';


const EmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false); // State to manage upload status
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/emp/${id}`);
        setEmployee(response.data);
      } catch (error) {
        setError('Error fetching employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  // Custom base64 upload handler
  const customBase64Uploader = async (event) => {
    if (!event.files || event.files.length === 0) {
      alert("Please select a file before uploading.");
      return;
    }

    const file = event.files[0]; // Get the first file
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await axios.post(`http://localhost:8080/api/emp/uploadProfileImage/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setEmployee(response.data); // Update employee data with the new profile image
      alert("Profile image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Error uploading profile image.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const handleMarkAttendance = () => {
    navigate('/mark-attendance', {
      state: {
        employeeId: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        username: employee.username,
        position: employee.position,
        profileImage: employee.profileImage // Pass profileImage here
      }
    });
  };

  // Handle Update Employee button click
  const handleUpdateEmployee = () => {
    navigate(`/update-employee/${employee.id}`); // Navigate to update employee page with employee ID
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const handleLogout = () => {
    // Clear any session data or tokens
    localStorage.clear(); // Example: Clear all local storage
    sessionStorage.clear(); // Example: Clear session storage

    // Redirect to login page
    navigate('/loginEmployee');
};
  return (
    <div className=' container overall'>
  {/* Name Navbar */}
  <div>
    <div className="name-navbar">
      <span>{employee.firstName} {employee.lastName}</span>
      <button className="btn btn-danger logout" onClick={handleLogout}>Logout</button>
    </div>

     
        <div className='col-12 '>
        <div className= " navbarmobile">

<MobNav 
  profileImage={
    employee.profileImage
      ? `http://localhost:8080/${employee.profileImage}`
      : "http://bootdey.com/img/Content/avatar/avatar1.png"
  }
/>
</div>
        </div>
  

  </div>

  {/* Sidebar with Profile Photo */}
  <div className="sidebar  d-flex flex-column align-items-center text-white">
    <img
      className="img-account-profile rounded-circle mb-2"
      src={employee.profileImage ? `http://localhost:8080/${employee.profileImage}` : "http://bootdey.com/img/Content/avatar/avatar1.png"}
      alt="Profile"
    />

    {/* Employee Info */}
    <div className="employee-info mt-4">
      <h4>{employee.firstName} {employee.lastName}</h4>
      <p>{employee.position}</p>
    </div>
    <div className="mt-3 fileuploadbtn">
      <FileUpload
        mode="basic"
        name="demo[]"
        url="/api/upload"
        accept="image/*"
        customUpload
        uploadHandler={customBase64Uploader}
        chooseLabel={uploading ? "Uploading..." : "Upload Profile Image"}
        disabled={uploading}
        style={{ backgroundColor: 'white', color: 'black', padding: '10px', borderRadius: '10px' }}
      />
    </div>
  </div>

  {/* Main Content Section */}
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
          <div className="attendance-buttons">
            <button className="btn btn-primary MarkAttendance" onClick={handleMarkAttendance}>
              Mark Attendance
            </button>
            <button className="btn btn-secondary UpdateEmployee" onClick={handleUpdateEmployee}>
              Update Employee
            </button>
            <button className="btn btn-danger logoutmob" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>



  );
};

export default EmployeeProfile;

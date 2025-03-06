import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileUpload } from 'primereact/fileupload';
import '../style/EmployeeProfile.css';
import { Spinner, Alert } from 'react-bootstrap';
import MobNav from './MobNav';
import logo from '../images/logo.png'; // Adjust the path as per your project structure


const EmployeePage = () => {
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
    <div
  className="container-fluid"
  // style={{
  //   overflowY: "auto",
  //   maxHeight: "100vh",
  //   margin: "0",
  //   padding: "0",
  //   minHeight: "100vh",
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   background: "linear-gradient(to top right, #f2f6fc, #e8eff4)",
  // }}
>
  <div className="w-100" style={{ maxWidth: "1200px" }}>
    {/* Account page navigation */}
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
     {/* Logo Section with Image */}
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
       marginLeft:"20px",
       marginTop:"3px",
       backgroundColor:'#ffffff'
     }}
       >
         {/* Optional: Placeholder text if image is not available */}
         {/* L */}
       </div>
      
     </div>
   
     {/* Buttons Section */}
     <a
       className="nav-link"
       onClick={handleMarkAttendance}
       rel="noreferrer"
       style={{ color: '#ffffff', fontWeight: '600', cursor: 'pointer' , display: "flex",
        justifyContent: "center", // Centers content horizontally
        alignItems: "center"}}
     >
MarkAttendance     </a>
     <a
       className="nav-link"
       onClick={handleLogout}
       rel="noreferrer"
       style={{ color: '#ffffff', fontWeight: '600', cursor: 'pointer' , display: "flex",
        justifyContent: "center", // Centers content horizontally
        alignItems: "center"}}
     >
       Logout
     </a>

   </div>
   
   </nav>
    <hr className="mt-0 mb-4" />
    <div className="row ">
  <div className="col-xl-4 d-flex justify-content-center">
    {/* Profile picture card */}
    <div
      className="card mb-4 mb-xl-0"
      style={{
        borderRadius: "15px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        width: "100%", // Ensures responsiveness
        maxWidth: "400px", // Limits the card width
        maxHeight:"400px", // Fixed height for the card
        overflow: "hidden", // Ensures content does not overflow the card
      }}
      
    >
      <div
        className="card-header text-center"
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "15px 15px 0 0",
          fontSize: "1.2rem",
        }}
      >
        Profile Picture
      </div>
      <div className="card-body text-center">
        {/* Profile picture image */}
        <img
          src={
            employee.profileImage
              ? `http://localhost:8080/${employee.profileImage}`
              : "http://bootdey.com/img/Content/avatar/avatar1.png"
          }
          alt="Profile"
          className="rounded-circle mb-2"
          style={{
            width: "200px",
            height: "200px",
            objectFit: "cover",
            borderRadius: "50%",
            border: "4px solid #e4e6ef",
            boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
          }}
        />
        {/* Profile picture upload */}
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
            style={{
              backgroundColor: "#fff",
              color: "#0061f2",
              padding: "12px",
              borderRadius: "8px",
              border: "2px solid #ddd",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>
          </div>
        </div>
      </div>
      <div className="col-xl-8">
      {/* Account details card */}
      <div
        className="card mb-4"
        style={{
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "600px", // Limit the card width
          margin: "auto", // Ensure proper centering for smaller devices
        }}
      >
        <div
          className="card-header text-center"
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "15px 15px 0 0",
            fontSize: "1.2rem",
          }}
        >
          Account Details
        </div>
        <div className="card-body">
          <form>
            {/* Username */}
            <div className="mb-3">
              <label className="small mb-1" htmlFor="username">
                Username
              </label>
              <input
                className="form-control"
                id="username"
                type="text"
                placeholder="Enter your username"
                value={employee.username || ""}
                readOnly
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "12px",
                  backgroundColor: "#f8f9fa",
                }}
              />
            </div>
              {/* First and Last Name */}
              <div className="row gx-3 mb-3">
                <div className="col-md-6">
                  <label className="small mb-1" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    className="form-control"
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={employee.firstName || ""}
                    readOnly
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "12px",
                      backgroundColor: "#f8f9fa",
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="small mb-1" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    className="form-control"
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={employee.lastName || ""}
                    readOnly
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "12px",
                      backgroundColor: "#f8f9fa",
                    }}
                  />
                </div>
              </div>
              {/* Position and Branch */}
              <div className="row gx-3 mb-3">
                <div className="col-md-6">
                  <label className="small mb-1">Position</label>
                  <input
                    className="form-control"
                    id="position"
                    type="text"
                    placeholder="Enter your position"
                    value={employee.position || ""}
                    readOnly
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "12px",
                      backgroundColor: "#f8f9fa",
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="small mb-1">Branch</label>
                  <input
                    className="form-control"
                    id="branch"
                    type="text"
                    placeholder="Enter your branch"
                    value={employee.branch || ""}
                    readOnly
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "12px",
                      backgroundColor: "#f8f9fa",
                    }}
                  />
                </div>
              </div>
              {/* Email */}
              <div className="mb-3">
                <label className="small mb-1">Email</label>
                <input
                  className="form-control"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={employee.email || ""}
                  readOnly
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "12px",
                    backgroundColor: "#f8f9fa",
                  }}
                />
              </div>
              {/* Phone and Birthday */}
              <div className="row gx-3 mb-3">
                <div className="col-md-6">
                  <label className="small mb-1">Phone</label>
                  <input
                    className="form-control"
                    id="mobile"
                    type="tel"
                    placeholder="Enter phone number"
                    value={employee.mobile || ""}
                    readOnly
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "12px",
                      backgroundColor: "#f8f9fa",
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="small mb-1">Birthday</label>
                  <input
                    className="form-control"
                    id="birthday"
                    type="text"
                    placeholder="Enter birthday"
                    value={employee.dob || ""}
                    readOnly
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "12px",
                      backgroundColor: "#f8f9fa",
                    }}
                  />
                </div>
              </div>
              {/* Alternative Mobile */}
              <div className="mb-3">
                <label className="small mb-1">Alternative Mobile</label>
                <input
                  className="form-control"
                  id="alternativeMobile"
                  type="tel"
                  placeholder="Enter alternative mobile"
                  value={employee.alternativeMobile || ""}
                  readOnly
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "12px",
                    backgroundColor: "#f8f9fa",
                  }}
                />
              </div>
          
            <button
              className="btn btn-primary w-100"
              type="button"
              onClick={handleUpdateEmployee}
              style={{
                background: "linear-gradient(to right, #0061f2, #00c6ff)",
                borderRadius: "8px",
                color: "#fff",
                padding: "12px",
                fontWeight: "bold",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  </div>
</div>

  );
};

export default EmployeePage;
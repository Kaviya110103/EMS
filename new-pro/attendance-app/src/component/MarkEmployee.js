import React from 'react';
import '../style/MarkEmployee.css'; // Import CSS for styling

const MarkEmployee = ({ employee }) => {
  return (
    <div style={{
      width: '100%',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding:'9px'
    }}>
      <div className="profile-section d-flex justify-content-around align-items-center">
        <div className="d-flex align-items-center">
          {/* Profile Image */}
          <div className="profile-container" style={{
            width: '100px', /* Set the size of the circle */
            height: '100px', /* Make sure height and width are equal to form a circle */
            borderRadius: '50%', /* Make it round */
            overflow: 'hidden', /* Ensures the image is clipped within the circle */
            display: 'flex',
            justifyContent: 'center', /* Center the image horizontally */
            alignItems: 'center', /* Center the image vertically */
            backgroundColor: '#f0f0f0' /* Optional background color */
          }}>
            <img 
              src={employee.profileImage ? `http://localhost:8080/${employee.profileImage}` : "http://bootdey.com/img/Content/avatar/avatar1.png"} 
              alt="Employee Profile" 
              style={{
                width: '100%', /* Make image fill the container */
                height: 'auto', /* Maintain the aspect ratio of the image */
                objectFit: 'cover' /* Ensure the image covers the circle */
              }} 
            />
          </div>
          <div className="ml-5 m-5">
            <h4>{employee.firstName || 'Not Available'} {employee.lastName || 'Not Available'}</h4>
            <p>{employee.position}</p>
          </div>
        </div>
        <div>
          {/* <p><strong>Employee ID:</strong> {employee.id || 'Not Available'}</p> */}
        </div>
      </div>
    </div>
  );
};

export default MarkEmployee;

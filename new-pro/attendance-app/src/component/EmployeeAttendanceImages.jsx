import React, { useEffect, useState } from 'react';


const EmployeeAttendanceImages = ({ employeeId, firstName, lastName, username }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [images, setImages] = useState([]);


  useEffect(() => {
    // Fetch attendance data
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/attendance/employee/1`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setAttendanceData(data);
        } else {
          console.error("Expected an array, but received:", data);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };
    fetchAttendanceData();
  }, [employeeId]);


  useEffect(() => {
    // Fetch the images by employeeId
    fetch(`http://localhost:8080/api/images/imagesByEmployeeId/1`)
      .then((response) => response.json())
      .then((data) => setImages(data))
      .catch((error) => console.error("Error fetching images:", error));
  }, [employeeId]);


  // Filter the images to only show those whose attendanceId matches any of the attendanceData ids
  const filteredImages = images.filter((image) =>
    attendanceData.some((attendance) => attendance.id === image.attendanceId)
  );


  return (
    <div>
      <h2>
        Attendance Records for {firstName} {lastName} ({username})
      </h2>


      {/* Attendance Table */}
      <h3>Attendance Records</h3>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee Name</th>
            <th>Date In</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>
                {record.employee.firstName} {record.employee.lastName}
              </td>
              <td>{record.dateIn}</td>
              <td>{record.timeIn}</td>
              <td>{record.timeOut || 'N/A'}</td>
              <td>{record.attendanceStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* Image Table */}
      <h3>Employee Images</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Image 1</th>
            <th>Image 2</th>
            <th>Employee ID</th>
            <th>Attendance ID</th>
            <th>Upload Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredImages.length > 0 ? (
            filteredImages.map((image, index) => (
              <tr key={index}>
                <td>
                  <img src={image.imageUrl1} alt={`Image 1 ${index}`} width="100" />
                </td>
                <td>
                  <img src={image.imageUrl2} alt={`Image 2 ${index}`} width="100" />
                </td>
                <td>{image.employeeId}</td>
                <td>{image.attendanceId ? image.attendanceId : 'N/A'}</td>
                <td>{image.uploadDate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No matching images found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};


export default EmployeeAttendanceImages;
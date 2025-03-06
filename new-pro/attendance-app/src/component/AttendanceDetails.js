import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EnterAttendance from './EnterAttendance';
import UploadImageModal from './UploadImageModal';
import Modal from 'react-modal';
import ImageDisplay from './ImageDisplay';
import "../style/AttendanceDetails.css";
const AttendanceDetails = ({ employeeId ,onAttendanceIdChange }) => {
  const [attendanceDetails, setAttendanceDetails] = useState(null);
  const [images, setImages] = useState([]);  // Declare the state for images
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [dayCloseModalOpen, setDayCloseModalOpen] = useState(false); // State for day close modal
  const [attendanceId, setAttendanceId] = useState(null);  // State to hold the attendanceId

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/attendance/employee/${employeeId}`
        );
        if (response.data?.length) {
          const lastAttendance = response.data[response.data.length - 1];
          setAttendanceDetails(lastAttendance);

          // Send the attendanceId to the parent component
          if (lastAttendance.id) {
            onAttendanceIdChange(lastAttendance.id);  // Pass attendanceId to parent
          }
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/images/imagesByEmployeeId/${employeeId}`
        );
        if (response.data?.length) {
          setImages(response.data);  // Set images in state
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (employeeId) {
      fetchAttendanceData();
      fetchImages();
    }
  }, [employeeId, onAttendanceIdChange]);

  if (!attendanceDetails) {
    return (
      <div
        style={{
          padding: "20px",
          maxWidth: "400px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px", // Corrected property name
          borderRadius: "10px",
          background: "#ffffff",
        }}
      >
        <EnterAttendance employeeId={employeeId} />
      </div>
    );
  }
  

  // Extract the ID of the latest attendance record
  const latestAttendanceId = attendanceDetails.id;

  // Filter images that match the latest attendance ID
  const matchingImages = images.filter(image => image.attendanceId === latestAttendanceId);

  // Get the first and second matching image URLs and IDs
  const imageUrl1 = matchingImages[0]?.imageUrl1 || null;
  const imageUrl2 = matchingImages[0]?.imageUrl2 || null;
  const image1Id = matchingImages[0]?.imageId || 'N/A';
  const image2Id = matchingImages[1]?.imageId || 'N/A';  // Assuming image2 is at index 1

  const showUploadImageModal = attendanceDetails.timeIn && !imageUrl1;
  const showEnterAttendance = attendanceDetails.timeIn && imageUrl1 && !attendanceDetails.timeOut;
  
  // Calculate total working hours (if timeIn and timeOut are available)
  const calculateTotalWorkingHours = () => {
    if (!attendanceDetails.timeIn || !attendanceDetails.timeOut) return 'Not available';
    const timeIn = new Date(`1970-01-01T${attendanceDetails.timeIn}`);
    const timeOut = new Date(`1970-01-01T${attendanceDetails.timeOut}`);
    const diff = timeOut - timeIn;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours} hours, ${minutes} minutes`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not Available';

    const date = new Date(`1970-01-01T${timeString}`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};


  return (
    <div className="attendance-details-card ">
      <div className="attendance-status">
        Attendance Status: {attendanceDetails.attendanceStatus || 'Not Available'}
      </div>

      <h6 className="text-center" style={{ display: 'none' }}>
        Last Attendance ID: {latestAttendanceId || 'N/A'}
      </h6>

      <div className="attendance-images m-5">
    <div className="image-column">
        <strong>TimeIn:</strong> {formatTime(attendanceDetails.timeIn)}

        {imageUrl1 && (
            <div className="image-container">
                <img src={imageUrl1} alt="Image 1" className="attendance-image" />
                <div style={{ display: 'none' }}>
                    <strong>Image 1 ID:</strong> {image1Id}
                </div>
            </div>
        )}

        <div className="attendance-date">
            <strong>Date:</strong> {attendanceDetails.dateIn ? new Date(attendanceDetails.dateIn).toLocaleDateString() : 'Not Available'}
        </div>
    </div>

    <div className="image-column">
        <strong>TimeOut:</strong> {formatTime(attendanceDetails.timeOut)}

        {imageUrl2 && (
            <div className="image-container">
                <img src={imageUrl2} alt="Image 2" className="attendance-image" />
                <div style={{ display: 'none' }}>
                    <strong>Image 2 ID:</strong> {image2Id}
                </div>
            </div>
        )}

        <div className="attendance-date">
            <strong>Date:</strong> {attendanceDetails.dateIn ? new Date(attendanceDetails.dateIn).toLocaleDateString() : 'Not Available'}
        </div>
    </div>
    {showUploadImageModal && (
        <UploadImageModal employeeId={employeeId} attendanceId={latestAttendanceId} imageId={image1Id} />
      )}
       {showEnterAttendance && (
        <EnterAttendance
          employeeId={employeeId}
          attendanceId={latestAttendanceId}
          imageId={image1Id}
          attendanceStatus={attendanceStatus}
        />
      )}
      
      {attendanceDetails.attendanceStatus === 'Absent' && (
        <div>
          <EnterAttendance
            employeeId={employeeId}
            attendanceId={latestAttendanceId}
            imageId={image1Id}
            attendanceStatus={attendanceStatus}
          />
        </div>
      )}

</div>


      {/* Conditionally render components based on the state */}
      
     

      {attendanceDetails.timeIn && attendanceDetails.timeOut && (
        <ImageDisplay
          attendanceId={latestAttendanceId}
          imageId={image1Id}
          timeIn={attendanceDetails.timeIn}
          timeOut={attendanceDetails.timeOut}
          employeeId={employeeId}
        />
      )}

          <br>
             </br>
    </div>
  );
};

export default AttendanceDetails;

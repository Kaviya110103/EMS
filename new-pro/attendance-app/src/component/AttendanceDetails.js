import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../style/AttendanceDetails.css";
import TimeIn from './TimeIn';
import TimeOut from './TimeOut';
import UploadImageModal from './UploadImageModal';
import UploadImage2Modal from './UploadImage2Modal';
import DayClose from './DayCloseModal';

const SimpleAttendanceDetails = ({ employeeId }) => {
  const [attendanceDetails, setAttendanceDetails] = useState(null);
  const [images, setImages] = useState(null); // Store image details
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [latestAttendanceId, setLatestAttendanceId] = useState(null);
  const [showTimeIn, setShowTimeIn] = useState(false);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/attendance/employee/${employeeId}`
        );
        if (response.data?.length) {
          const lastAttendance = response.data[response.data.length - 1];
          setAttendanceDetails(lastAttendance);
          setLatestAttendanceId(lastAttendance.id);
          fetchImagesByAttendanceId(lastAttendance.id); // Fetch images for the latest attendance
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    const fetchImagesByAttendanceId = async (attendanceId) => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/images/displayImagesByAttendanceId/${attendanceId}`
        );
        if (response.data) {
          setImages(response.data); // Set image details
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (employeeId) {
      fetchAttendanceData();
    }
  }, [employeeId]);

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImageUrl('');
  };

  const handleStartDayClick = () => {
    setShowTimeIn(true);
  };

  if (!attendanceDetails) {
    return <div>Loading...</div>;
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'Not Available';
    const date = new Date(`1970-01-01T${timeString}`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const showStartDayButton = !isToday(attendanceDetails.dateIn) && !showTimeIn;

  const shouldShowUploadImageModal =
    attendanceDetails.timeIn && // If timeIn exists
    !images?.imageUrl1; // But imageUrl1 (TimeIn image) does not exist

  const shouldShowTimeOut =
    attendanceDetails.timeIn && // If timeIn exists
    images?.imageUrl1 && // If TimeIn image exists
    !attendanceDetails.timeOut; // But timeOut is NOT recorded

  const shouldShowUploadImage2Modal =
    attendanceDetails.timeIn && // If timeIn exists
    images?.imageUrl1 && // If TimeIn image exists
    attendanceDetails.timeOut && // If timeOut exists
    !images?.imageUrl2; // But imageUrl2 (TimeOut image) does not exist

  const shouldShowDayClose =
  attendanceDetails.timeIn && // If timeIn exists
    images?.imageUrl1 && // If TimeIn image exists
    attendanceDetails.timeOut && // If timeOut exists
    images?.imageUrl2; // But imageUrl2 (TimeOut image) does not exist



  return (
    <div className="attendance-details-card">
    
  
  
  
      <div className="attendance-status pt-5">
        Attendance Status: {attendanceDetails.attendanceStatus || 'Not Available'}
      </div>

      <div className="attendance-images m-5">
        <div className="image-column">
          <strong>TimeIn:</strong> {formatTime(attendanceDetails.timeIn)}

          {images?.imageUrl1 && (
            <div className="image-container" onClick={() => handleImageClick(images.imageUrl1)}>
              <img src={images.imageUrl1} alt="Image 1" className="attendance-image" />
            </div>
          )}

          <div className="attendance-date">
            <strong>Date:</strong> {attendanceDetails.dateIn ? new Date(attendanceDetails.dateIn).toLocaleDateString() : 'Not Available'}
          </div>
        </div>

        <div className="image-column">
          <strong>TimeOut:</strong> {formatTime(attendanceDetails.timeOut)}

          {images?.imageUrl2 && (
            <div className="image-container" onClick={() => handleImageClick(images.imageUrl2)}>
              <img src={images.imageUrl2} alt="Image 2" className="attendance-image" />
            </div>
          )}

          <div className="attendance-date">
            <strong>Date:</strong> {attendanceDetails.dateIn ? new Date(attendanceDetails.dateIn).toLocaleDateString() : 'Not Available'}
          </div>
        </div>
      </div>

      {modalVisible && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img src={selectedImageUrl} alt="Selected" />
          </div>
        </div>
      )}

      {showStartDayButton && (
        <button onClick={handleStartDayClick} className="start-day-button">
          Start Day
        </button>
      )}

      {showTimeIn && (
        <TimeIn employeeId={employeeId} attendanceId={latestAttendanceId} />
      )}

      {shouldShowUploadImageModal && (
        <UploadImageModal
          employeeId={employeeId}
          attendanceId={latestAttendanceId}
          imageId={null}

        />
      )}

      {shouldShowTimeOut && (
        <TimeOut latestAttendanceId={latestAttendanceId} />
      )}

      {shouldShowUploadImage2Modal && (
        <UploadImage2Modal
          imageId={images?.imageId} // Pass the imageId from the API response
          attendanceId={latestAttendanceId} // Pass the attendanceId if needed
        />
      )}

      {shouldShowDayClose && (
        <DayClose
        employeeId={employeeId}
        attendanceId={latestAttendanceId}
        timeIn={attendanceDetails.timeIn}
        timeOut={attendanceDetails.timeOut}
        DateIn={attendanceDetails.dateIn}
        TimeInImage={images.imageUrl1}
        TimeOutImage={images.imageUrl2}

         />)}
    </div>
  );
};

export default SimpleAttendanceDetails;
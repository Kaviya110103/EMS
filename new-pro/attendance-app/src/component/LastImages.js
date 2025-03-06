import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LastImages = ({ employeeId, attendanceId }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch images by employee ID
    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/images/imagesByEmployeeId/${employeeId}`);
        if (response.data && response.data.length > 0) {
          setImages(response.data);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (employeeId) {
      fetchImages();
    }
  }, [employeeId]);

  if (!images.length) {
    return <div>Loading images...</div>;
  }

  // Filter images based on attendanceId
  const filteredImages = images.filter(image => image.attendanceId === attendanceId);

  if (!filteredImages.length) {
    return <div>No images found for this attendance ID.</div>;
  }

  return (
    <div>
 <h5 style={{ display: 'none' }}>Images for Last Attendance ID: {attendanceId}</h5>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {filteredImages.map((image, index) => (
          <div key={index} className="image-card" style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>
                <strong>TimeIn Image</strong>
                <img src={image.imageUrl1} alt="Image 1" style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }} />
              </div>
              <div>
                <strong> Timeout Image</strong>
                <img src={image.imageUrl2} alt="Image 2" style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }} />
              </div>
            </div>
            <div>
              <strong>Upload Date:</strong> {new Date(image.uploadDate).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LastImages;

// AttendanceUpload.jsx
import React, { useState } from 'react';

const AttendanceUpload = () => {
  const [file, setFile] = useState(null);
  const [action, setAction] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleActionChange = (event) => {
    setAction(event.target.value);
  };

  const handleStatusChange = (event) => {
    setAttendanceStatus(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('action', action);
    formData.append('attendanceStatus', attendanceStatus);

    try {
      const response = await fetch('http://localhost:8080/api/attendance/time-in', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setMessage(`Attendance recorded: ${data.id}`); // Assuming the backend returns the attendance ID
      setFile(null); // Reset the file input after upload
    } catch (error) {
      console.error('Error uploading attendance:', error);
      setMessage('Failed to upload attendance file');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <h3 className="mb-3">Upload Attendance File</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <input
          type="text"
          value={action}
          onChange={handleActionChange}
          placeholder="Action (Present/Absent)"
          required
        />
        <input
          type="text"
          value={attendanceStatus}
          onChange={handleStatusChange}
          placeholder="Attendance Status"
          required
        />
        <button className="btn btn-sm btn-outline-success float-right" type="submit">
          Upload
        </button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default AttendanceUpload;

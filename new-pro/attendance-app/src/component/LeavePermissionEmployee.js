import React, { useState, useEffect } from "react";
import "../style/LeavePermissionEmployee.css";
import { FaCalendarAlt, FaClipboardList, FaClock, FaAlignLeft } from "react-icons/fa";


const LeavePermissionEmployee = ({ employeeId, attendanceId }) => {
  const [newRequest, setNewRequest] = useState({
    employeeId: employeeId,
    type: "Leave", // Default to Leave
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [approvalMessage, setApprovalMessage] = useState("");
  const [lastRequest, setLastRequest] = useState(null);

  // Fetch the last leave/permission request for the employee
  const getLastRequest = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/leave-permissions/employee/${employeeId}`
      ); // Replace with your actual GET endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch last request");
      }
      const requests = await response.json();
      if (requests.length > 0) {
        const lastRequest = requests[requests.length - 1];
        setLastRequest(lastRequest);
      }
    } catch (error) {
      console.error("Error fetching previous requests:", error);
    }
  };

  useEffect(() => {
    getLastRequest();
  }, [employeeId]);

  const handleInputChange = (e) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if the employee has already submitted a request today
    if (lastRequest && new Date(lastRequest.startDate).toDateString() === new Date().toDateString()) {
      alert("Your request has already been submitted today.");
      return;
    }
  
    try {
      // Replace attendanceId with employeeId in the endpoint URL
      const response = await fetch(
        `http://localhost:8080/api/leave-permissions/${employeeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRequest),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to create leave permission");
      }
  
      const newLeavePermission = await response.json();
  
      alert("Request created successfully!");
  
      // Show approval message if status is approved
      if (newLeavePermission.status === "Approved") {
        setApprovalMessage("Your leave/permission has been approved!");
      }
  
      // Refresh the last request details
      getLastRequest();
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };
  
  

  return (
    <div className="form-container">
     
      <p className="form-subtitle">
        Create New Leave/Permission Request
      </p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <FaClipboardList className="form-icon" />
          <select
            name="type"
            value={newRequest.type}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Type</option>
            <option value="Leave">Leave</option>
            <option value="Permission">Permission</option>
          </select>
        </div>

        {newRequest.type === "Leave" && (
          <div className="form-group">
            <FaAlignLeft className="form-icon" />
            <input
              type="text"
              name="leaveType"
              placeholder="Leave Type"
              value={newRequest.leaveType}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <FaClock className="form-icon" />
          <input
            type="datetime-local"
            name="startDate"
            placeholder="Start Date"
            value={newRequest.startDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <FaClock className="form-icon" />
          <input
            type="datetime-local"
            name="endDate"
            placeholder="End Date"
            value={newRequest.endDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <FaAlignLeft className="form-icon" />
          <textarea
            name="reason"
            placeholder="Reason for Leave/Permission"
            rows="3"
            value={newRequest.reason}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="form-button">
          Submit Request
        </button>
      </form>

      {approvalMessage && (
        <div className="alert alert-success mt-4 text-center">
          {approvalMessage}
        </div>
      )}

      {lastRequest && (
        <div className="last-request">
          <p>
            <strong>Last Request ID:</strong> {lastRequest.id}
          </p>
          <p>
            <strong>Status:</strong> {lastRequest.status}
          </p>
        </div>
      )}
    </div>
    
  );
};

export default LeavePermissionEmployee;
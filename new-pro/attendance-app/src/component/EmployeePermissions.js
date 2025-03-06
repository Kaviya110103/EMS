import React, { useState } from "react";
import axios from "axios";

// Define the API base URL for leave/permission requests
const API_BASE_URL = "http://localhost:8080/api/leave-permissions";

const EmployeePermissions = () => {
  const [employeeId, setEmployeeId] = useState(""); // State for employee ID input
  const [permissions, setPermissions] = useState([]); // State to store permissions data
  const [error, setError] = useState(""); // State to handle errors
  const [isLoading, setIsLoading] = useState(false); // State to handle loading status

  // Function to fetch permissions for the given employee ID
  const fetchPermissions = async (id) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/employee/${id}`);
      setPermissions(response.data);
    } catch (err) {
      setError("Error fetching permissions. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change for employee ID
  const handleInputChange = (e) => {
    setEmployeeId(e.target.value);
  };

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (employeeId) {
      fetchPermissions(employeeId);
    } else {
      setError("Please enter a valid Employee ID.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Employee Leave/Permission Details</h3>

      {/* Input Form */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="form-group">
          <label htmlFor="employeeId">Employee ID:</label>
          <input
            type="text"
            id="employeeId"
            className="form-control"
            value={employeeId}
            onChange={handleInputChange}
            placeholder="Enter Employee ID"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          Search
        </button>
      </form>

      {/* Display Loading Status */}
      {isLoading && <p>Loading...</p>}

      {/* Display Error Message */}
      {error && <p className="text-danger">{error}</p>}

      {/* Display Permissions Data */}
      {permissions.length > 0 ? (
        <table className="table table-bordered table-striped">
          <thead>
            <tr style={{ backgroundColor: "#add8e6", fontWeight: "bold" }}>
              <th>ID</th>
              <th>Type</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Requested Date</th>
              <th>Attendance Details</th> {/* New column for Attendance Details */}
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission) => {
              const requestDate = new Date(permission.requestedAt).toLocaleDateString(); // Extract only the date
              const attendance = permission.attendance; // Extract attendance details
              const attendanceDetails = attendance
                ? `
                  Attendance ID: ${attendance.id}, 
                  Date: ${attendance.dateIn}, 
                  Status: ${attendance.attendanceStatus}, 
                  Time In: ${attendance.timeIn || "N/A"}, 
                  Time Out: ${attendance.timeOut || "N/A"}
                `
                : "No attendance data available";

              return (
                <tr key={permission.id}>
                  <td>{permission.id}</td>
                  <td>{permission.type}</td>
                  <td>{permission.leaveType || "N/A"}</td>
                  <td>{new Date(permission.startDate).toLocaleString()}</td>
                  <td>{new Date(permission.endDate).toLocaleString()}</td>
                  <td>{permission.reason}</td>
                  <td>{permission.status}</td>
                  <td>{requestDate}</td>
                  <td>{attendanceDetails}</td> {/* Display attendance details in one column */}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        !isLoading && !error && <p>No permissions found for this employee.</p>
      )}
    </div>
  );
};

export default EmployeePermissions;

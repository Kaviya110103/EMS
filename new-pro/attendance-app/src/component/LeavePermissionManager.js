import React, { useEffect, useState } from "react";
import {
  fetchRequestsByEmployee,
  createRequest,
  updateRequestStatus,
  deleteRequest,
} from "../service/leavePermissionService"; // Import the API service

const LeavePermissionManager = ({ employeeId }) => {
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    employeeId: employeeId,
    type: "Leave", // Default to Leave
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [statusUpdate, setStatusUpdate] = useState({
    id: "",
    status: "",
  });

  // Fetch leave/permission requests for the employee
  useEffect(() => {
    if (employeeId) {
      fetchRequestsByEmployee(employeeId).then(setRequests).catch(console.error);
    }
  }, [employeeId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  // Handle new request form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    createRequest(newRequest)
      .then((data) => {
        alert("Request created successfully!");
        setRequests([...requests, data]);
        setNewRequest({
          employeeId: employeeId,
          type: "Leave",
          leaveType: "",
          startDate: "",
          endDate: "",
          reason: "",
        });
      })
      .catch(console.error);
  };

  // Handle status update
  const handleStatusUpdate = (e) => {
    e.preventDefault();
    updateRequestStatus(statusUpdate.id, statusUpdate.status)
      .then((updatedRequest) => {
        alert("Status updated successfully!");
        setRequests((prev) =>
          prev.map((req) => (req.id === updatedRequest.id ? updatedRequest : req))
        );
        setStatusUpdate({ id: "", status: "" });
      })
      .catch(console.error);
  };

  // Handle request deletion
  const handleDelete = (id) => {
    deleteRequest(id)
      .then(() => {
        alert("Request deleted successfully!");
        setRequests(requests.filter((req) => req.id !== id));
      })
      .catch(console.error);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Leave and Permission Management</h2>

      {/* New Request Form */}
      <form className="mb-5 p-3 border rounded" onSubmit={handleSubmit}>
        <h3>Create New Request</h3>
        <div className="mb-3">
          <label className="form-label">Type:</label>
          <select
            className="form-select"
            name="type"
            value={newRequest.type}
            onChange={handleInputChange}
          >
            <option value="Leave">Leave</option>
            <option value="Permission">Permission</option>
          </select>
        </div>
        {newRequest.type === "Leave" && (
          <div className="mb-3">
            <label className="form-label">Leave Type:</label>
            <input
              type="text"
              className="form-control"
              name="leaveType"
              value={newRequest.leaveType}
              onChange={handleInputChange}
            />
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Start Date:</label>
          <input
            type="datetime-local"
            className="form-control"
            name="startDate"
            value={newRequest.startDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">End Date:</label>
          <input
            type="datetime-local"
            className="form-control"
            name="endDate"
            value={newRequest.endDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Reason:</label>
          <textarea
            className="form-control"
            name="reason"
            value={newRequest.reason}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Request
        </button>
      </form>

      {/* Status Update Form */}
      <form className="mb-5 p-3 border rounded" onSubmit={handleStatusUpdate}>
        <h3>Update Request Status</h3>
        <div className="mb-3">
          <label className="form-label">Request ID:</label>
          <input
            type="number"
            className="form-control"
            name="id"
            value={statusUpdate.id}
            onChange={(e) => setStatusUpdate({ ...statusUpdate, id: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status:</label>
          <select
            className="form-select"
            name="status"
            value={statusUpdate.status}
            onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
            required
          >
            <option value="">Select</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Update Status
        </button>
      </form>

      {/* List of Requests */}
      <h3>Your Leave and Permission Requests</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.type}</td>
              <td>{req.leaveType || "N/A"}</td>
              <td>{req.startDate}</td>
              <td>{req.endDate}</td>
              <td>{req.reason}</td>
              <td>{req.status}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(req.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeavePermissionManager;

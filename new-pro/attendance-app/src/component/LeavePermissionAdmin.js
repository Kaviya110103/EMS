import React, { useEffect, useState } from "react";
import approve from "../images/mark.png";
import rejecte from "../images/remove.png";
import pending from "../images/wall-clock.png";
import "./LeavePermissionAdmin.css"; // Import the custom CSS file

const LeavePermissionAdmin = ({ setPendingCount, employeeId }) => {
  const [requests, setRequests] = useState([]);
  const [isDayClosed, setIsDayClosed] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceId, setAttendanceId] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(""); // State for selected branch

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/attendance/employee/1`
        );
        const data = await response.json();
        console.log("Fetched attendance data:", data);

        if (data && data.length > 0) {
          const lastAttendance = data[data.length - 1]; // Get last record
          console.log("Latest attendance ID:", lastAttendance.id);

          setAttendanceId(lastAttendance.id); // Only setting the latest ID
        } else {
          setAttendanceId("No data");
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setAttendanceId("Error fetching data");
      }
    }

    if (employeeId) {
      fetchAttendance();
    }
  }, [employeeId]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/leave-permissions"
      );
      const data = await response.json();
      setRequests(data);

      const pendingCount = data.filter((req) => req.status === "Pending").length;
      setPendingCount(pendingCount);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const updateRequestStatus = async (id, status, employeeId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/leave-permissions/${id}/status?status=${status}`,
        { method: "PUT" }
      );

      if (!response.ok) throw new Error("Failed to update status");

      // If Approved, mark attendance as absent
      if (status === "Approved") {
        handleMarkAbsent(employeeId);
      }

      fetchRequests(); // Refresh list after updating
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const handleMarkAbsent = async (employeeId) => {
    try {
      await fetch(
        `http://localhost:8080/api/attendance/mark-absent?employeeId=${employeeId}`,
        {
          method: "POST",
        }
      );

      console.log("Attendance marked as Absent successfully!");
    } catch (error) {
      console.error("Error marking attendance as absent:", error);
    }
  };

  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
  };

  const filteredRequests = selectedBranch
    ? requests.filter((req) => req.attendance.employee.branch === selectedBranch)
    : requests;

  return (
    <div className="container mt-5 leave-permission-admin">
      <h3 className="text-center mb-4">Leave and Permission Requests</h3>

      {/* Branch Selection Cards */}
      <div className="branch-cards">
        <div
          className={`branch-card ${selectedBranch === "" ? "active" : ""}`}
          onClick={() => handleBranchChange("")}
        >
          <div className="branch-icon">🏢</div>
          <div className="branch-label">All Branches</div>
        </div>
        <div
          className={`branch-card ${
            selectedBranch === "IIE 100FT Gandhipuram" ? "active" : ""
          }`}
          onClick={() => handleBranchChange("IIE 100FT Gandhipuram")}
        >
          <div className="branch-icon">🏛️</div>
          <div className="branch-label">IIE, 100 FT</div>
        </div>
        <div
          className={`branch-card ${
            selectedBranch === "IIE Kuniyamuthur" ? "active" : ""
          }`}
          onClick={() => handleBranchChange("IIE Kuniyamuthur")}
        >
          <div className="branch-icon">🏫</div>
          <div className="branch-label">IIE, Kuniyamuthur</div>
        </div>
        <div
          className={`branch-card ${
            selectedBranch === "IIE Hopes" ? "active" : ""
          }`}
          onClick={() => handleBranchChange("IIE Hopes")}
        >
          <div className="branch-icon">🏢</div>
          <div className="branch-label">IIE Hopes</div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="table-section">
        <h4>All Leave and Permission Requests</h4>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Branch</th>
              <th>Employee ID</th>
              <th>Type</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.attendance.employee.branch}</td>
                <td>{req.employeeId}</td>
                <td>{req.type}</td>
                <td>{req.leaveType || "N/A"}</td>
                <td>{req.startDate}</td>
                <td>{req.endDate}</td>
                <td>{req.reason}</td>
                <td>
                  <span
                    className={`badge ${
                      req.status === "Pending"
                        ? "bg-primary"
                        : req.status === "Rejected"
                        ? "bg-danger"
                        : "bg-success"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex flex-row align-items-center">
                    <button
                      className="btn p-0 border-0 bg-transparent mb-2"
                      onClick={() =>
                        updateRequestStatus(req.id, "Approved", req.employeeId)
                      }
                    >
                      <img
                        src={approve}
                        alt="approve"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </button>

                    <button
                      className="btn p-0 border-0 bg-transparent mb-2"
                      onClick={() => updateRequestStatus(req.id, "Rejected")}
                    >
                      <img
                        src={rejecte}
                        alt="Reject"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </button>

                    <button
                      className="btn p-0 border-0 bg-transparent"
                      onClick={() => updateRequestStatus(req.id, "Pending")}
                    >
                      <img
                        src={pending}
                        alt="Pending"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeavePermissionAdmin;
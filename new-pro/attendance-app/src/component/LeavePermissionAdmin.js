import React, { useEffect, useState } from "react";
import approve from "../images/mark.png";
import rejecte from "../images/remove.png";
import pending from "../images/wall-clock.png";

const LeavePermissionAdmin = ({ setPendingCount, employeeId }) => {
  const [requests, setRequests] = useState([]);
  const [isDayClosed, setIsDayClosed] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceId, setAttendanceId] = useState(null); // Declare state
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

      <div className="form-group mb-4">
        <label>Filter by Branch</label>
        <fieldset className="bg-light p-3 d-flex flex-row">
          <div className="form-check me-3">
            <input
              className="form-check-input"
              type="radio"
              name="branch"
              value=""
              id="branchAll"
              onChange={() => handleBranchChange('')}
              checked={selectedBranch === ''}
              style={{ display: 'block' }}
            />
            <label className="form-check-label" htmlFor="branchAll" style={{ cursor: 'pointer' }}>
              All Branches
            </label>
          </div>
          <div className="form-check me-3">
            <input
              className="form-check-input"
              type="radio"
              name="branch"
              value="IIE 100FT Gandhipuram"
              id="branch1"
              onChange={() => handleBranchChange("IIE 100FT Gandhipuram")}
              checked={selectedBranch === "IIE 100FT Gandhipuram"}
              style={{ display: 'block' }}
            />
            <label className="form-check-label" htmlFor="branch1" style={{ cursor: 'pointer' }}>
              IIE, 100 FT
            </label>
          </div>
          <div className="form-check me-3">
            <input
              className="form-check-input"
              type="radio"
              name="branch"
              value="IIE Kuniyamuthur"
              id="branch2"
              onChange={() => handleBranchChange("IIE Kuniyamuthur")}
              checked={selectedBranch === "IIE Kuniyamuthur"}
              style={{ display: 'block' }}
            />
            <label className="form-check-label" htmlFor="branch2" style={{ cursor: 'pointer' }}>
              IIE, Kuniyamuthur
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="branch"
              value="IIE Hopes"
              id="branch3"
              onChange={() => handleBranchChange("IIE Hopes")}
              checked={selectedBranch === "IIE Hopes"}
              style={{ display: 'block' }}
            />
            <label className="form-check-label" htmlFor="branch3" style={{ cursor: 'pointer' }}>
              IIE Hopes
            </label>
          </div>
        </fieldset>
      </div>

      <div className="table-section">
        <h4>All Leave and Permission Requests</h4>
        <h3>Latest Attendance ID: {attendanceId}</h3>
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
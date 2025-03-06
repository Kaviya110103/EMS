import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployeeRecords = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [presentDaysCount, setPresentDaysCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/attendance");
        setAttendanceData(response.data);
        setFilteredAttendance(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching attendance data", err);
        setError("Error fetching data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendanceData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    let filtered = attendanceData;

    if (selectedBranch) {
      filtered = filtered.filter(
        (attendance) => attendance.employee.branch === selectedBranch
      );
    } else if (employeeId) {
      filtered = filtered.filter(
        (attendance) => attendance.employee.id === parseInt(employeeId)
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter(
        (attendance) => new Date(attendance.dateIn).getMonth() + 1 === parseInt(selectedMonth)
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter(
        (attendance) =>
          new Date(attendance.dateIn) >= new Date(startDate) &&
          new Date(attendance.dateIn) <= new Date(endDate)
      );
    }

    setFilteredAttendance(filtered);

    // Calculate the number of distinct present days in the selected month
    const distinctDates = new Set(filtered.map((attendance) => new Date(attendance.dateIn).toISOString().split("T")[0]));
    setPresentDaysCount(distinctDates.size); // Set the count of distinct present days

    // Calculate the count of "Present" and "Absent" statuses
    const presentCount = filtered.filter((attendance) => attendance.attendanceStatus === "Present").length;
    const absentCount = filtered.filter((attendance) => attendance.attendanceStatus === "Absent").length;
    setPresentCount(presentCount);
    setAbsentCount(absentCount);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("attendance-table");
    const windowPrint = window.open("", "", "height=600,width=800");
    windowPrint.document.write("<html><head><title>Attendance Records</title>");
    windowPrint.document.write("</head><body>");
    windowPrint.document.write(printContent.innerHTML);
    windowPrint.document.write("</body></html>");
    windowPrint.document.close();
    windowPrint.print();
  };

  const calculateWorkingHours = (timeIn, timeOut) => {
    if (!timeIn || !timeOut) return "N/A";
    const start = new Date(`1970-01-01T${timeIn}Z`);
    const end = new Date(`1970-01-01T${timeOut}Z`);
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="container mt-4 bg-light p-4 shadow rounded">
      <style>
        {`
          .page-title {
            color: #0056b3;
            font-weight: bold;
            margin-bottom: 1rem;
            text-align: center;
          }
          .form-container {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .form-group label {
            font-weight: bold;
            color: #333;
          }
          .attendance-table-container {
            margin-top: 20px;
          }
          .table-header {
            background: #007bff;
            color: white;
          }
          .error-message {
            color: red;
            font-weight: bold;
            text-align: center;
          }
          .btn-primary, .btn-info {
            font-size: 1rem;
            font-weight: bold;
          }
        `}
      </style>

      <h3 className="page-title">Employee Attendance Records</h3>
      <form onSubmit={handleSearch} className="form-container">
        <style>
          {`
            .form-container {
              background: linear-gradient(135deg, #007bff, #00d4ff);
              color: #fff;
              padding: 30px;
              border-radius: 12px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              margin-top: 20px;
              width: 100%;
              max-width: 100%;
            }
            .form-container label {
              font-weight: bold;
              color: #f8f9fa;
            }
            .form-container input, 
            .form-container select {
              background: #f8f9fa;
              color: #333;
              border: 2px solid #007bff;
              border-radius: 8px;
              padding: 10px;
              width: 100%;
            }
            .form-container input:focus, 
            .form-container select:focus {
              border-color: #00d4ff;
              box-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
              outline: none;
            }
            .form-container button {
              background: #0056b3;
              color: #fff;
              border: none;
              border-radius: 8px;
              padding: 12px;
              font-size: 1rem;
              font-weight: bold;
              transition: background-color 0.3s;
              width: 100%;
            }
            .form-container button:hover {
              background: #003f7f;
            }
            .form-container .row {
              margin-bottom: 15px;
            }
          `}
        </style>

        <div className="row gy-3">
          <div className="col-md-3 col-sm-12">
            <div className="form-group">
              <label htmlFor="employeeId">EmployeeID</label>
              <input
                type="text"
                id="employeeId"
                className="form-control"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter Employee ID"
                disabled={selectedBranch !== ""}
              />
            </div>
          </div>

          <div className="col-md-3 col-sm-12">
            <div className="form-group">
              <label htmlFor="startDate">StartDate</label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-3 col-sm-12">
            <div className="form-group">
              <label htmlFor="endDate">EndDate</label>
              <input
                type="date"
                id="endDate"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-3 col-sm-12">
            <div className="form-group">
              <label htmlFor="month">Month</label>
              <select
                id="month"
                className="form-control"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">All Months</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
          </div>

          <div className="col-md-3 col-sm-12">
            <div className="form-group">
              <label htmlFor="branch">Branch</label>
              <select
                id="branch"
                className="form-control"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="">All Branches</option>
                <option value="IIE 100FT Gandhipuram">IIE 100FT Gandhipuram</option>
                <option value="IIE Kuniyamuthur">IIE Kuniyamuthur</option>
                <option value="IIE Hopes">IIE Hopes</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Search
            </button>
          </div>
        </div>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {filteredAttendance.length > 0 && (
        <div className="attendance-table-container" id="attendance-table">
          <h4>Attendance Records</h4>
          {selectedMonth && presentDaysCount > 0 && (
            <p>
              Employee was present for {presentDaysCount} day{presentDaysCount > 1 ? "s" : ""} in Above Month.
            </p>
          )}
          <p>
            Total Present: {presentCount} | Total Absent: {absentCount}
          </p>
          <table className="table table-striped table-bordered">
            <thead>
              <tr className="text-center table-header">
                <th>Attendance ID</th>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Total Working Hours</th>
                <th>Attendance Status</th>

              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((attendance) => (
                <tr key={attendance.id} className="text-center">
                  <td>{attendance.id}</td>
                  <td>{attendance.employee.id}</td>
                  <td>{attendance.employee.firstName}</td>
                  <td>{attendance.employee.branch}</td>
                  <td>{attendance.dateIn}</td>
                  <td>{attendance.timeIn || "N/A"}</td>
                  <td>{attendance.timeOut || "N/A"}</td>
                  <td>{calculateWorkingHours(attendance.timeIn, attendance.timeOut)}</td>
                  <td>{attendance.attendanceStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handlePrint} className="btn btn-info mt-3">
            Print Attendance Records
          </button>
        </div>
      )}

      {!isLoading && !error && filteredAttendance.length === 0 && (
        <p>No records found for this employee.</p>
      )}
    </div>
  );
};

export default EmployeeRecords;
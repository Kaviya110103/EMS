import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaPrint, FaCalendarAlt, FaUser, FaBuilding } from "react-icons/fa";

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
  const [isEmployeeIdEnabled, setIsEmployeeIdEnabled] = useState(false);

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

    // Apply branch filter if selected
    if (selectedBranch) {
      filtered = filtered.filter(
        (attendance) => attendance.employee.branch === selectedBranch
      );
      setIsEmployeeIdEnabled(true); // Enable Employee ID field after selecting a branch
    }

    // Apply employee ID filter if selected
    if (employeeId) {
      filtered = filtered.filter(
        (attendance) => attendance.employee.id === parseInt(employeeId)
      );
    }

    // Apply month filter if selected
    if (selectedMonth) {
      filtered = filtered.filter(
        (attendance) => new Date(attendance.dateIn).getMonth() + 1 === parseInt(selectedMonth)
      );
    }

    // Apply date range filter if selected
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
    <div className="container mx-auto px-4 py-8">
      <style>
        {`
          .page-title {
            color: #2c3e50;
            font-weight: bold;
            margin-bottom: 2rem;
            text-align: center;
            font-size: 2.5rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          }
          .filter-card {
            background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin-bottom: 1rem;
            transition: transform 0.3s, box-shadow 0.3s;
            color: #2c3e50;
            width: 100%;
            max-width: 300px;
          }
          .filter-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }
          .filter-card label {
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #2c3e50;
            font-size: 0.9rem;
          }
          .filter-card input,
          .filter-card select {
            background: rgba(255, 255, 255, 0.8);
            color: #2c3e50;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 6px;
            padding: 0.5rem;
            width: 100%;
            transition: border-color 0.3s, box-shadow 0.3s;
            font-size: 0.9rem;
          }
          .filter-card input:focus,
          .filter-card select:focus {
            border-color: #4299e1;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.3);
            outline: none;
          }
          .filter-card input::placeholder {
            color: rgba(44, 62, 80, 0.7);
          }
          .search-button {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 0.75rem;
            font-size: 0.9rem;
            font-weight: bold;
            transition: background-color 0.3s;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }
          .search-button:hover {
            background: linear-gradient(135deg, #764ba2, #667eea);
          }
          .filter-container {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            justify-content: center;
          }
        `}
      </style>

      <h1 className="page-title">Employee Attendance Records</h1>

      {/* Filter Section */}
      <form onSubmit={handleSearch} className="filter-container">
        {/* Employee ID Filter */}
        <div className="filter-card">
          <label htmlFor="employeeId">
            <FaUser className="text-blue-500" />
            Employee ID
          </label>
          <input
            type="text"
            id="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Enter Employee ID"
            disabled={!isEmployeeIdEnabled && selectedBranch !== ""}
          />
        </div>

        {/* Date Range Filter */}
        <div className="filter-card">
          <label htmlFor="startDate">
            <FaCalendarAlt className="text-blue-500" />
            Date Range
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Month Filter */}
        <div className="filter-card">
          <label htmlFor="month">
            <FaCalendarAlt className="text-blue-500" />
            Month
          </label>
          <select
            id="month"
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

        {/* Branch Filter */}
        <div className="filter-card">
          <label htmlFor="branch">
            <FaBuilding className="text-blue-500" />
            Branch
          </label>
          <select
            id="branch"
            value={selectedBranch}
            onChange={(e) => {
              setSelectedBranch(e.target.value);
              if (!e.target.value) {
                setIsEmployeeIdEnabled(false); // Disable Employee ID field if branch is cleared
              }
            }}
          >
            <option value="">All Branches</option>
            <option value="IIE 100FT Gandhipuram">IIE 100FT Gandhipuram</option>
            <option value="IIE Kuniyamuthur">IIE Kuniyamuthur</option>
            <option value="IIE Hopes">IIE Hopes</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="filter-card">
          <button type="submit" className="search-button">
            <FaSearch />
            Search
          </button>
        </div>
      </form>

      {/* Rest of the code remains the same */}
      {isLoading && <div className="loading-spinner"></div>}
      {error && <p className="error-message">{error}</p>}

      {filteredAttendance.length > 0 && (
        <div className="attendance-table-container" id="attendance-table">
          <h2 className="text-xl font-bold mb-4">Attendance Records</h2>
          {selectedMonth && presentDaysCount > 0 && (
            <p className="mb-4">
              Employee was present for {presentDaysCount} day{presentDaysCount > 1 ? "s" : ""} in the selected month.
            </p>
          )}
          <p className="mb-4">
            Total Present: {presentCount} | Total Absent: {absentCount}
          </p>
          <table className="table">
            <thead>
              <tr>
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
                <tr key={attendance.id}>
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

          <button onClick={handlePrint} className="btn btn-info mt-4">
            <FaPrint />
            Print Attendance Records
          </button>
        </div>
      )}

      {!isLoading && !error && filteredAttendance.length === 0 && (
        <p className="text-center text-gray-600">No records found for this employee.</p>
      )}
    </div>
  );
};

export default EmployeeRecords;
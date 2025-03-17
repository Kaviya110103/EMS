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
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState("");

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
      setIsEmployeeIdEnabled(true);
    }

    if (employeeId) {
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

    if (attendanceStatusFilter) {
      filtered = filtered.filter(
        (attendance) => attendance.attendanceStatus === attendanceStatusFilter
      );
    }

    setFilteredAttendance(filtered);

    const distinctDates = new Set(
      filtered.map((attendance) => new Date(attendance.dateIn).toISOString().split("T")[0])
    );
    setPresentDaysCount(distinctDates.size);

    const presentCount = filtered.filter((attendance) => attendance.attendanceStatus === "Present").length;
    const absentCount = filtered.filter((attendance) => attendance.attendanceStatus === "Absent").length;
    setPresentCount(presentCount);
    setAbsentCount(absentCount);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("attendance-table");
    const windowPrint = window.open("", "", "height=600,width=800");

    // Get the employee name(s) and selected month for the print header
    const employeeNames = [...new Set(filteredAttendance.map((attendance) => attendance.employee.firstName))];
    const employeeNameText = employeeNames.length === 1 ? employeeNames[0] : "Employees";
    const monthName = selectedMonth ? new Date(`2023-${selectedMonth}-01`).toLocaleString('default', { month: 'long' }) : "";

    // Create the print content with the logo, institute name, and header
    windowPrint.document.write("<html><head><title>Attendance Records</title>");
    windowPrint.document.write(`
      <style>
        .print-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .print-header img {
          height: 50px;
        }
        .print-header h1 {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          flex-grow: 1;
        }
        .print-subheader {
          text-align: center;
          font-size: 18px;
          margin-bottom: 20px;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        .table th,
        .table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        .table th {
          background: #f7fafc;
          color: #4a5568;
          font-weight: bold;
        }
      </style>
    `);
    windowPrint.document.write("</head><body>");
    windowPrint.document.write(`
      <div class="print-header">
        <img src="path/to/your/logo.png" alt="Logo" />
        <h1>Indra Institute of Education</h1>
      </div>
      <div class="print-subheader">
        ${monthName ? `${monthName} Month ` : ""}${employeeNameText} Attendance Details
      </div>
    `);
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
          .filter-container {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 2rem;
          }
          .filter-card {
            background: #ffffff;
            border-radius: 8px;
            padding: 1rem;
            width: 100%;
            max-width: 220px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .filter-card label {
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            color: #4a5568;
          }
          .filter-card input,
          .filter-card select {
            background: #f7fafc;
            color: #2c3e50;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 0.5rem;
            width: 100%;
            font-size: 0.9rem;
          }
          .filter-card input:focus,
          .filter-card select:focus {
            border-color: #4299e1;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.3);
          }
          .search-button {
            background: #4299e1;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 0.75rem;
            font-size: 0.9rem;
            font-weight: bold;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }
          .search-button:hover {
            background: #3182ce;
          }
          .attendance-table-container {
            margin-top: 2rem;
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
          }
          .table th,
          .table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
          }
          .table th {
            background: #f7fafc;
            color: #4a5568;
            font-weight: bold;
          }
          .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            font-size: 0.9rem;
            font-weight: bold;
            transition: background-color 0.3s;
          }
          .btn-info {
            background: #4299e1;
            color: white;
          }
          .btn-info:hover {
            background: #3182ce;
          }
        `}
      </style>

      <h1 className="page-title">Employee Attendance Records</h1>

      {/* Filter Section */}
      <form onSubmit={handleSearch} className="filter-container">
        {/* Employee ID Filter */}
        <div className="filter-card bg-white rounded-lg shadow-md p-4">
          <label htmlFor="employeeId" className="flex items-center text-gray-700 font-semibold mb-2">
            <FaUser className="mr-2 text-blue-500" />
            Employee ID
          </label>
          <input
            type="text"
            id="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Enter Employee ID"
            disabled={!isEmployeeIdEnabled && selectedBranch !== ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date Range Filter */}
        <div className="filter-card bg-white rounded-lg shadow-md p-4">
          <label htmlFor="startDate" className="flex items-center text-gray-700 font-semibold mb-2">
            <FaCalendarAlt className="mr-2 text-blue-500" />
            Date Range
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Month Filter */}
        <div className="filter-card bg-white rounded-lg shadow-md p-4">
          <label htmlFor="month" className="flex items-center text-gray-700 font-semibold mb-2">
            <FaCalendarAlt className="mr-2 text-blue-500" />
            Month
          </label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="filter-card bg-white rounded-lg shadow-md p-4">
          <label htmlFor="branch" className="flex items-center text-gray-700 font-semibold mb-2">
            <FaBuilding className="mr-2 text-blue-500" />
            Branch
          </label>
          <select
            id="branch"
            value={selectedBranch}
            onChange={(e) => {
              setSelectedBranch(e.target.value);
              if (!e.target.value) {
                setIsEmployeeIdEnabled(false);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Branches</option>
            <option value="IIE 100FT Gandhipuram">IIE 100FT Gandhipuram</option>
            <option value="IIE Kuniyamuthur">IIE Kuniyamuthur</option>
            <option value="IIE Hopes">IIE Hopes</option>
          </select>
        </div>

        {/* Attendance Status Filter */}
        <div className="filter-card bg-white rounded-lg shadow-md p-4">
          <label htmlFor="attendanceStatus" className="flex items-center text-gray-700 font-semibold mb-2">
            <FaCalendarAlt className="mr-2 text-blue-500" />
            Attendance Status
          </label>
          <select
            id="attendanceStatus"
            value={attendanceStatusFilter}
            onChange={(e) => setAttendanceStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="filter-card bg-white rounded-lg shadow-md p-4 flex items-end">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center"
          >
            <FaSearch className="mr-2" />
            Search
          </button>
        </div>
      </form>

      {isLoading && <div className="loading-spinner"></div>}
      {error && <p className="error-message">{error}</p>}

      {/* Attendance Table */}
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
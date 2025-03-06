import React, { useState, useEffect } from "react";
import axios from "axios";

function EmployeeAttendanceSalary() {
    const [employeeId, setEmployeeId] = useState("");
    const [totalDays, setTotalDays] = useState(0);
    const [presentDays, setPresentDays] = useState(0);
    const [absentDays, setAbsentDays] = useState(0);
    const [weekOffDays, setWeekOffDays] = useState(0);
    const [workingDays, setWorkingDays] = useState(0);
    const [salary, setSalary] = useState(0);
    const [dailySalary, setDailySalary] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [attendanceData, setAttendanceData] = useState([]);
    const [employeeSalary, setEmployeeSalary] = useState(0);

    useEffect(() => {
        fetchAttendance();
    }, []);

    useEffect(() => {
        if (selectedMonth && employeeId) {
            calculateAttendance();
        }
    }, [selectedMonth, selectedYear, employeeId]);

    useEffect(() => {
        calculateWorkingDays();
    }, [totalDays, absentDays, weekOffDays]);

    useEffect(() => {
        calculateSalary();
    }, [workingDays, employeeSalary, presentDays]);

    useEffect(() => {
        if (employeeId) {
            fetchEmployeeDetails();
        }
    }, [employeeId]);

    const fetchAttendance = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/attendance");
            setAttendanceData(response.data);
        } catch (error) {
            console.error("Error fetching attendance data:", error);
        }
    };

    const fetchEmployeeDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/emp/${employeeId}`);
            setEmployeeSalary(response.data.salary);
        } catch (error) {
            console.error("Error fetching employee details:", error);
        }
    };

    const calculateTotalDays = (month, year) => new Date(year, month, 0).getDate();

    const calculateAttendance = () => {
        const daysInMonth = calculateTotalDays(parseInt(selectedMonth), selectedYear);
        setTotalDays(daysInMonth);

        let filtered = attendanceData.filter(
            (attendance) =>
                new Date(attendance.dateIn).getMonth() + 1 === parseInt(selectedMonth) &&
                new Date(attendance.dateIn).getFullYear() === parseInt(selectedYear) &&
                attendance.employee.id === parseInt(employeeId)
        );

        const distinctPresentDates = new Set(filtered.filter(a => a.attendanceStatus === "Present").map(a => a.dateIn));
        setPresentDays(distinctPresentDates.size);
        setAbsentDays(daysInMonth - distinctPresentDates.size);
    };

    const calculateWorkingDays = () => setWorkingDays(totalDays - absentDays - weekOffDays);
    const calculateSalary = () => {
        if (totalDays > 0) {
            setDailySalary(employeeSalary / totalDays);
        }
        setSalary(dailySalary * presentDays);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-6xl bg-white  shadow-2xl rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-center text-blue-600 mb-6">Employee Attendance & Salary</h3>
                
                <div className="grid grid-cols-5 text-center gap-4 mb-6">
                    <input type="text" className="p-2 m-3 border rounded" placeholder="Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
                    <select className="p-2 border m-3 rounded" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                        <option value="">Select Month</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i} value={i + 1}>{new Date(0, i).toLocaleString("en", { month: "long" })}</option>
                        ))}
                    </select>
                    <input type="number" className="p-2 m-3 border rounded" placeholder="Year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} />
                    <input type="number" className="p-2 m-3 border rounded" placeholder="Week Off Days" value={weekOffDays} onChange={(e) => setWeekOffDays(parseInt(e.target.value) || 0)} />
                </div>
                
                <table className="min-w-full bg-white text-center border text-center rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4 border">Total Days</th>
                            <th className="py-2 px-4 border">Present Days</th>
                            <th className="py-2 px-4 border">Absent Days</th>
                            <th className="py-2 px-4 border">Working Days</th>
                            <th className="py-2 px-4 border">Daily Salary</th>
                            <th className="py-2 px-4 border text-lg font-bold text-green-600">Monthly Salary</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-2 px-4 border">{totalDays}</td>
                            <td className="py-2 px-4 border">{presentDays}</td>
                            <td className="py-2 px-4 border">{absentDays}</td>
                            <td className="py-2 px-4 border">{workingDays}</td>
                            <td className="py-2 px-4 border">₹{dailySalary.toFixed(2)}</td>
                            <td className="py-2 px-4 border text-lg font-bold text-green-600">₹{salary.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EmployeeAttendanceSalary;

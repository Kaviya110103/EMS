import React, { useEffect, useState } from "react";

const AttendanceStatus = ({ employeeId }) => {
    const [status, setStatus] = useState("Loading...");
    const [attendanceData, setAttendanceData] = useState([]);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/attendance");
                const data = await response.json();
                setAttendanceData(data);
            } catch (error) {
                console.error("Error fetching attendance:", error);
                setStatus("Error fetching data");
            }
        };

        fetchAttendance();
    }, []);

    useEffect(() => {
        if (attendanceData.length > 0) {
            const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)
            
            const todayAttendance = attendanceData.find(
                (record) => record.employee.id === employeeId && record.dateIn === today
            );

            if (todayAttendance) {
                setStatus(todayAttendance.attendanceStatus); // "Present" or "Absent"
            } else {
                setStatus("Not Marked"); // If no record for today
            }
        }
    }, [attendanceData, employeeId]);

    return (
        <div>
            <h2>Today's Attendance</h2>
            <p>Employee ID: {employeeId}</p>
            <p>Status: <strong>{status}</strong></p>
        </div>
    );
};

export default AttendanceStatus;

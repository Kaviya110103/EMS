import { useEffect, useState } from 'react';

function CheckAttendance({ employeeId }) {
    const [attendanceData, setAttendanceData] = useState({ dateIn: 'Fetching...', dayStatus: 'Fetching...' });
    
    useEffect(() => {
        async function fetchAttendance() {
            try {
                const response = await fetch(`http://localhost:8080/api/attendance/employee/1`);
                const data = await response.json();
                
                console.log("Fetched attendance data:", data); // Debugging log
    
                if (data && data.length > 0) {
                    const lastAttendance = data[data.length - 1]; // Get the last record
                    console.log("Extracted last attendance:", lastAttendance);
                    setAttendanceData({ dateIn: lastAttendance.dateIn, dayStatus: lastAttendance.dayStatus });
                } else {
                    setAttendanceData({ dateIn: 'No data', dayStatus: 'No data' });
                }
            } catch (error) {
                console.error("Error fetching attendance data:", error);
                setAttendanceData({ dateIn: 'Error fetching data', dayStatus: 'Error fetching data' });
            }
        }
    
        fetchAttendance();
    }, [employeeId]);
    
    return (
        <div>
            <p>Last Attendance Date In: {attendanceData.dateIn}</p>
            <p>Last Attendance Day Status: {attendanceData.dayStatus}</p>
        </div>
    );
}

export default CheckAttendance;

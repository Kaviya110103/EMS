import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AbsenteesTable = () => {
    const [employeeIds, setEmployeeIds] = useState([]); // State to store employee IDs
    const [absenteesList, setAbsenteesList] = useState([]); // State to store absentees
    const [todayDate, setTodayDate] = useState(''); // State to store today's date
    const [employeeDetails, setEmployeeDetails] = useState([]); // State to store employee details
    const [selectedBranch, setSelectedBranch] = useState(''); // State to store selected branch

    // Fetch employee data from the API
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/emp`);
                const employeeData = response.data;

                // Extract employee IDs and set the state
                const ids = employeeData.map(employee => employee.id);
                setEmployeeIds(ids);

                // Store employee details for later use
                setEmployeeDetails(employeeData);
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchEmployeeData();
    }, []);

    // Fetch attendance data for all employees
    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                // Get today's date in YYYY-MM-DD format
                const today = new Date().toISOString().split('T')[0];
                setTodayDate(today);

                // Fetch attendance data from the API
                const response = await axios.get(`http://localhost:8080/api/attendance`);
                const attendanceData = response.data;

                // Create a list of absentees
                const absentees = employeeIds
                    .map(employeeId => {
                        const todaysRecord = attendanceData.find(record =>
                            record.employee.id === employeeId && record.dateIn === today
                        );

                        // Find employee details
                        const employee = employeeDetails.find(emp => emp.id === employeeId);

                        // Consider "No record for today" and "Absent" as absent
                        if (!todaysRecord || todaysRecord.attendanceStatus === 'Absent') {
                            return {
                                employeeId,
                                status: todaysRecord ? todaysRecord.attendanceStatus : 'No record for today',
                                employeeDetails: employee ? {
                                    firstName: employee.firstName,
                                    lastName: employee.lastName,
                                    branch: employee.branch,
                                    mobile: employee.mobile,
                                    email: employee.email,
                                    profileImage: employee.profileImage
                                } : null,
                                dateIn: today,
                                timeIn: todaysRecord ? todaysRecord.timeIn : 'N/A',
                                timeOut: todaysRecord ? todaysRecord.timeOut : 'N/A'
                            };
                        }
                        return null;
                    })
                    .filter(employee => employee !== null); // Filter out null values

                setAbsenteesList(absentees);

                // Automatically mark as absent if no record by 2 PM
                const currentTime = new Date();
                if (currentTime.getHours() >= 13) { // 2 PM is 14:00 in 24-hour format
                    absentees.forEach(async (employee) => {
                        if (employee.status === 'No record for today') {
                            await handleMarkAbsent(employee.employeeId);
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching attendance data:', error);
                setAbsenteesList([{ employeeId: 'Error', status: 'Failed to fetch data', employeeDetails: null }]);
            }
        };

        if (employeeIds.length > 0 && employeeDetails.length > 0) {
            fetchAttendanceData();
        }
    }, [employeeIds, employeeDetails]);

    // Handle branch filter change
    const handleBranchChange = (branch) => {
        setSelectedBranch(branch);
    };

    // Function to mark attendance as absent
    const handleMarkAbsent = async (employeeId) => {
        try {
            await axios.post("http://localhost:8080/api/attendance/mark-absent", null, {
                params: { employeeId },
            });

            alert(`Employee ${employeeId} marked as Absent successfully!`);
            window.location.reload(); // Refresh the page after marking as Absent
        } catch (error) {
            console.error("Error marking attendance as absent:", error);
            alert("Failed to mark attendance as Absent.");
        }
    };

    // Filter absentees based on selected branch
    const filteredAbsentEmployees = selectedBranch
        ? absenteesList.filter(employee => employee.employeeDetails.branch === selectedBranch)
        : absenteesList;

    return (
        <div className="container mt-4 bg-light p-4 shadow rounded">
            <h3 className="text-center mb-4">Today's Absent Employees</h3>
            <div className="row mb-3">
                <div className="col-12">
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
            </div>
            {filteredAbsentEmployees.length > 0 ? (
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr className="text-center table-header">
                            <th>Employee ID</th>
                            <th>Profile Image</th>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Branch</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAbsentEmployees.map((attendance) => (
                            <tr key={attendance.employeeId} className="text-center">
                                <td>{attendance.employeeId}</td>
                                <td>
                                    <img
                                        src={
                                            attendance.employeeDetails.profileImage
                                                ? `http://localhost:8080/${attendance.employeeDetails.profileImage}`
                                                : "http://bootdey.com/img/Content/avatar/avatar1.png"
                                        }
                                        alt="Profile"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            borderRadius: "50%",
                                        }}
                                    />
                                </td>
                                <td>{attendance.employeeDetails.firstName} {attendance.employeeDetails.lastName}</td>
                                <td>{attendance.employeeDetails.mobile}</td>
                                <td>{attendance.employeeDetails.branch}</td>
                                <td>{attendance.dateIn}</td>
                                <td>{attendance.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center">
                    {selectedBranch ? `No employees absent in ${selectedBranch} branch today.` : "No employees absent today."}
                </p>
            )}
        </div>
    );
};

export default AbsenteesTable;
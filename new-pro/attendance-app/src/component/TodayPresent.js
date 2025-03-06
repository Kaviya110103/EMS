import React, { useState, useEffect } from "react";
import axios from "axios";

function TodayPresent() {
    const [attendanceData, setAttendanceData] = useState([]);
    const [presentEmployees, setPresentEmployees] = useState([]);
    const [filteredPresentEmployees, setFilteredPresentEmployees] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    useEffect(() => {
        if (selectedBranch) {
            setFilteredPresentEmployees(presentEmployees.filter(employee => employee.employee.branch === selectedBranch));
        } else {
            setFilteredPresentEmployees(presentEmployees);
        }
    }, [selectedBranch, presentEmployees]);

    const fetchAttendanceData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/attendance");
            setAttendanceData(response.data);
            filterPresentEmployees(response.data);
        } catch (err) {
            console.error("Error fetching attendance data", err);
        }
    };

    const filterPresentEmployees = (data) => {
        const present = data.filter(
            (attendance) => attendance.dateIn === today && attendance.attendanceStatus === "Present"
        );
        setPresentEmployees(present);
        setFilteredPresentEmployees(present);
    };

    const handleBranchChange = (branch) => {
        setSelectedBranch(branch);
    };

    return (
        <div className="container mt-4 bg-light p-4 shadow rounded">
            <h3 className="text-center mb-4">Today's Present Employees</h3>
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
            {filteredPresentEmployees.length > 0 ? (
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr className="text-center table-header">
                            <th>Employee ID</th>
                            <th>Profile Image</th>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Branch</th>
                            <th>Date</th>
                            <th>Time In</th>
                            <th>Time Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPresentEmployees.map((attendance) => (
                            <tr key={attendance.id} className="text-center">
                                <td>{attendance.employee.id}</td>
                                <td>
                                    <img
                                        src={
                                            attendance.employee.profileImage
                                                ? `http://localhost:8080/${attendance.employee.profileImage}`
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
                                <td>{attendance.employee.firstName}</td>
                                <td>{attendance.employee.mobile}</td>
                                <td>{attendance.employee.branch}</td>
                                <td>{attendance.dateIn}</td>
                                <td>{attendance.timeIn || "N/A"}</td>
                                <td>{attendance.timeOut || "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center">
                    {selectedBranch ? `No employees present in ${selectedBranch} branch today.` : "No employees present today."}
                </p>
            )}
        </div>
    );
}

export default TodayPresent;
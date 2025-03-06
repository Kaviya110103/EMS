import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/AdminDashboard.css';
import { listEmployees, deleteEmployee } from '../service/EmployeeService.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Spinner, Alert, Button, Form } from 'react-bootstrap';
import ListEmployeeComponent from './ListEmployeeComponent'; // Import the ListEmployeeComponent
import TodayPresent from './TodayPresent.js';
import TodayAbsent from './TodayAbsent.js';
import AttendanceTable from './AttendanceTable.js';
import LeavePermissionAdmin from "./LeavePermissionAdmin.js"; // Import the new LeavePermissionAdmin component
import EmployeePermissions from './EmployeePermissions.js';
import Payroll from './Payroll'; // Import the Payroll component
import { BiPerson, BiCalendarCheck, BiPersonPlus, BiFileText, BiDoorOpen, BiLogOut } from 'react-icons/bi';
import logo from '../images/logo.png'; // Adjust the path as per your project structure

const AdminDashboard = () => {
    const [title, setTitle] = useState("Admin");
    
    const [activeSection, setActiveSection] = useState('');
    const navigate = useNavigate();
    const [employee, setEmployee] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [filteredAttendance, setFilteredAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [employeeIdFilter, setEmployeeIdFilter] = useState('');
    const [presentCount, setPresentCount] = useState(0);
    const [absentCount, setAbsentCount] = useState(0);
    const [pendingRequests, setPendingRequests] = useState(0);
      const [requests, setRequests] = useState([]);
    

      useEffect(() => {
            document.title = title; // Update the tab title
          }, [title]); // Runs whenever 'title' changes
    useEffect(() => {
        fetchRequests();
    }, []);
    
    const fetchRequests = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/leave-permissions");
            const data = await response.json();
            setRequests(data);
    
            const pendingCount = data.filter((req) => req.status === "Pending").length;
            setPendingRequests(pendingCount);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };
    useEffect(() => {
        const countPresentsToday = () => {
            const today = new Date().toISOString().split('T')[0];
            const presentRecords = filteredAttendance.filter((record) => {
                const isToday = record.dateIn === today;
                return isToday && record.timeIn && record.timeOut;
            });
            return presentRecords.length;
        };

        const countAbsentsToday = () => {
            const today = new Date().toISOString().split('T')[0];
            const absentRecords = filteredAttendance.filter((record) => {
                const isToday = record.dateIn === today;
                return isToday && (!record.timeIn || !record.timeOut);
            });
            return absentRecords.length;
        };

        setPresentCount(countPresentsToday());
        setAbsentCount(countAbsentsToday());
    }, [filteredAttendance]);

    useEffect(() => {
        getAllEmployee();
        fetchPendingRequests();
    }, []);

    const getAllEmployee = () => {
        listEmployees()
            .then((response) => {
                setEmployee(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/leave-permissions/pending');
            setPendingRequests(response.data.length);
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        }
    };

    function addNewEmployee() {
        navigate('/add-employee');
    }

    function updatehandler(id) {
        navigate(`/update-employee/${id}`);
    }

    function deletehandler(id) {
        deleteEmployee(id)
            .then(() => {
                getAllEmployee();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function viewProfile(id) {
        navigate(`/employee-profile/${id}`);
    }

    const handleNavigation = () => {
        navigate('/Attendancelist');
    };

    // Function to handle button click and show/hide the corresponding section
    const handleButtonClick = (section) => {
        setActiveSection((prevSection) => (prevSection === section ? '' : section));
        if (section === 'leavePermission') {
            fetchPendingRequests();
        }
    };

    // Attendance list logic
    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/attendance');
                setAttendance(response.data);
                setFilteredAttendance(response.data); // Initially show all records
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, []);

    const formatTime = (time) => {
        if (!time) return "Not yet recorded";
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        return new Date(`1970-01-01T${time}`).toLocaleTimeString([], options);
    };

    const groupByEmployee = (records) => {
        return records.reduce((acc, record) => {
            const { action: employeeId } = record;
            if (!acc[employeeId]) {
                acc[employeeId] = [];
            }
            acc[employeeId].push(record);
            return acc;
        }, {});
    };

    const handleFilter = () => {
        let filtered = [...attendance];
        if (selectedDate) {
            filtered = filtered.filter((record) => record.dateIn === selectedDate);
        }

        if (employeeIdFilter) {
            filtered = filtered.filter((record) => record.action === employeeIdFilter);
        }

        setFilteredAttendance(filtered);
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">Error: {error}</Alert>;
    }

    const groupedAttendance = groupByEmployee(filteredAttendance);

    const handleEmployeeLogin = () => {
        navigate('/loginEmployee');
    };

    const handleLogout = async () => {
        // Optional: Call the backend logout endpoint (if implemented)
        try {
            await axios.post('http://localhost:8080/api/logout', null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
        } catch (err) {
            console.error("Logout failed", err);
        }

        // Clear JWT token from localStorage
        localStorage.removeItem('token');

        // Redirect to the admin login page
        navigate('/adminlogin');
    };

    return (
        <div className="container-fluid dashboard-container" style={{ padding: 0, overflowY: 'auto' }}>
            <div className="row" style={{ height: '100%', width: '100%' }}>
                {/* Side Navigation */}
                <div className="side-nav col-lg-3 col-md-4 col-sm-12 p-3" style={{
                    position: 'fixed', top: '30px', left: '10px', height: '60vh', zIndex: 1000,
                    backgroundColor: '#000957', borderRadius: '15px', boxShadow: '2px 2px 15px rgba(0, 0, 0, 0.2)'
                }}>
                    <div
                        style={{
                            width: '85px',
                            height: '85px',
                            borderRadius: '50%',
                            backgroundImage: `url(${logo})`, // Use the imported image
                            backgroundSize: 'cover', // Ensure the image fits the circle
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'center',
                            color: '#ffffff',
                            fontWeight: 'bold',
                            fontSize: '18px',
                            marginLeft: "65px",
                            marginTop: "3px",
                            backgroundColor: '#ffffff'
                        }}
                    >
                        {/* Optional: Placeholder text if image is not available */}
                        {/* L */}
                    </div>
                    <h6 className="text-center text-white mb-4" style={{ fontSize: '1.3rem', letterSpacing: '0px' }}>Indra Institute of Education</h6>
                    <a href="#totalEmployees" onClick={() => handleButtonClick('totalEmployees')} className="side-nav-link">
                        <i className="bi bi-person-lines-fill"></i> <span>Total Employees</span>
                    </a>
                    <a href="#" onClick={addNewEmployee} className="side-nav-link">
                        <i className="bi bi-person-plus-fill"></i> <span>Add Employee</span>
                    </a>
                    <a href="#attendanceDetails" onClick={() => handleButtonClick('attendanceDetails')} className="side-nav-link">
                        <i className="bi bi-calendar-check-fill"></i> <span>Attendance Records</span>
                    </a>
                    <a href="#leavePermission" onClick={() => handleButtonClick("leavePermission")} className="side-nav-link">
                        <i className="bi bi-file-earmark-person-fill"></i> <span>Leave/Permission Requests</span>
                    </a>
                    <a href="#" onClick={handleEmployeeLogin} className="side-nav-link">
                        <i className="bi bi-door-open-fill"></i> <span>Employee Login</span>
                    </a>
                    <button className="btn btn-danger mt-3 w-100" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                </div>

                {/* Content Area */}
                <div className="content col-lg-9 col-md-8 col-sm-12 p-3" style={{
                    marginLeft: '280px', paddingLeft: '30px', paddingRight: '30px', marginTop: '30px', borderRadius: '15px', height: '100%', width: '85%'
                }}>
                    <section id="overview">
                        <h3 className="section-title mb-4" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2980b9' }}>
                            <i className="bi bi-house-door-fill"></i> Dashboard Overview
                        </h3>
                        <div className="row g-3">
                            <div className="col-md-3 col-sm-6">
                                <button
                                    onClick={() => handleButtonClick("totalEmployees")}
                                    className="btn btn-primary btn-overview shadow d-flex align-items-center justify-content-between"
                                >
                                    <i className="fas fa-users fa-2x"></i>
                                    <div className="button-text">
                                        <span>Employees</span>
                                        <br />
                                        <span id="totalEmployees" className="count-value">{employee.length}</span>
                                    </div>
                                </button>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <button
                                    onClick={() => handleButtonClick("todayAttendees")}
                                    className="btn btn-success btn-overview shadow d-flex align-items-center justify-content-between"
                                >
                                    <i className="fas fa-user-check fa-2x"></i>
                                    <div className="button-text">
                                        <span>Today Attendees</span>
                                        <br />
                                        <span id="presentCount" className="count-value">{presentCount}</span>

                                    </div>
                                </button>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <button
                                    onClick={() => handleButtonClick("absentees")}
                                    className="btn btn-warning btn-overview shadow d-flex align-items-center justify-content-between"
                                >
                                    <i className="fas fa-user-times fa-2x"></i>
                                    <div className="button-text">
                                        <span>Absentees</span>

                                        <br />
                                        <span id="notificationsCount" className="count-value">{employee.length - presentCount}</span>
                                    </div>
                                </button>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <button
                                    onClick={() => handleButtonClick("attendanceDetails")}
                                    className="btn btn-info btn-overview shadow"
                                >
                                    <i className="fas fa-table fa-2x"></i>
                                    <div className="button-text">
                                        <span>Attendance Table</span>
                                    </div>
                                </button>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <button
                                    onClick={() => handleButtonClick("leavePermission")}
                                    className="btn btn-danger btn-overview shadow d-flex align-items-center justify-content-between"
                                >
                                    <i className="fas fa-bell fa-2x"></i>
                                    <div className="button-text">
                                        <span>Notifications</span> <br />
                                        <span id="pendingRequests" className="count-value">{pendingRequests}</span>
                                    </div>
                                </button>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <button
                                    onClick={() => handleButtonClick("payroll")}
                                    className="btn btn-secondary btn-overview shadow d-flex align-items-center justify-content-between"
                                >
                                    <i className="fas fa-dollar-sign fa-2x"></i>
                                    <div className="button-text">
                                        <span>Payroll</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </section>
                    {activeSection && (
                        <><section className="mt-5">
                            <div style={{ overflowY: 'auto', maxHeight: '100vh' }}>
                                {activeSection === 'totalEmployees' && <div ><ListEmployeeComponent /></div>}
                                {activeSection === 'todayAttendees' && (
                                    <div >
                                        {/* <h4>Total Present Today: <span className="badge bg-success">{presentCount}</span></h4> */}
                                        <TodayPresent setPresentCount={setPresentCount} />

                                    </div>
                                )}
                                {activeSection === 'absentees' && (
                                    <>
                                        <h5 className="card-title">Absentees</h5>
                                        <TodayAbsent setAbsentCount={setAbsentCount} />
                                    </>
                                )}
                                {activeSection === 'attendanceDetails' && (
                                    <>
                                        <AttendanceTable />

                                    </>
                                )}
                                {activeSection === 'leavePermission' && <LeavePermissionAdmin setPendingCount={setPendingRequests} />}
                                {activeSection === 'payroll' && <Payroll />}
                                {/* <h1>Pending Leave/Permission Requests: {pendingRequests}</h1> */}
                            </div>
                        </section></>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
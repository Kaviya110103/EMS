import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listEmployees } from "../service/EmployeeService.js"; // Assuming you have this API function defined elsewhere
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from 'axios'; // Using axios to handle API requests

function ListEmployeeComponent() {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        getAllEmployee();
    }, []);

    const getAllEmployee = () => {
        listEmployees()
            .then((response) => {
                console.log(response.data); // Check the structure here
                setEmployee(response.data);
                setFilteredEmployees(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        if (selectedBranch) {
            setFilteredEmployees(employee.filter(emp => emp.branch === selectedBranch));
        } else {
            setFilteredEmployees(employee);
        }
    }, [selectedBranch, employee]);

    const handleBranchChange = (branch) => {
        setSelectedBranch(branch);
    };

    const addNewEmployee = () => {
        navigate("/add-employee");
    };

    const updateHandler = (id) => {
        navigate(`/update-employee/${id}`);
    };

    const deleteHandler = async (id) => {
        if (window.confirm(`Are you sure you want to delete the employee with ID: ${id}?`)) {
            try {
                const response = await axios.delete(`http://localhost:8080/api/emp/${id}`);
                if (response.status === 200) {
                    console.log("Employee deleted successfully");
                    setEmployee(employee.filter((emp) => emp.id !== id));
                } else {
                    console.error("Failed to delete employee");
                }
            } catch (error) {
                console.error("Error deleting employee:", error);
            }
        }
    };

    const viewProfile = (id) => {
        navigate(`/employee-profile/${id}`);
    };

    const printTable = () => {
        const originalContents = document.body.innerHTML;
        const printContents = document.getElementById('printableTable').innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Reload to restore the original content
    };

    // Function to open modal with image
    const openImageModal = (image) => {
        setSelectedImage(image);
        setShowImageModal(true);
    };

    // Function to close modal
    const closeImageModal = () => {
        setShowImageModal(false);
        setSelectedImage(null);
    };

    return (
        <>
            <div className="container bg-light">
                <h3 className="text-center mb-4">All Employees</h3>
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
        

            <div
                id="printableTable"
                className="table-wrapper"
                style={{
                    overflowX: "auto",
                    overflowY: "auto",
                    maxHeight: "600px",
                    maxWidth: "100%",
                    margin: "20px auto",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "10px",
                    backgroundColor: "#f9f9f9"
                }}
            >
                <table
                    className="table table-striped table-bordered"
                    style={{
                        minWidth: "1200px",
                        tableLayout: "fixed",
                        wordWrap: "break-word",
                        fontSize: "14px",
                    }}
                >
                    <thead>
                        <tr
                            className="text-center"
                            style={{
                                backgroundColor: "#add8e6",
                                color: "#333",
                                fontWeight: "bold",
                            }}
                        >
                            <th scope="col">Id</th>
                            <th scope="col">Profile Image</th>
                            <th scope="col">Name</th>
                            <th scope="col">Mobile</th>
                            <th scope="col">Gender</th>
                            <th scope="col">Position</th>
                            <th scope="col">Branch</th>
                            <th scope="col">DOB</th>
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th scope="col">Address</th>
                            <th scope="col">Alternative Mobile</th>
                            <th scope="col">Date of Joining</th>
                            {/* <th scope="col">Reset Token</th> */}
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(filteredEmployees) &&
                            filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="text-center">
                                    <td>{emp.id}</td>
                                    <td>
                                        <img
                                            src={
                                                emp.profileImage
                                                    ? `http://localhost:8080/${emp.profileImage}`
                                                    : "http://bootdey.com/img/Content/avatar/avatar1.png"
                                            }
                                            alt="Profile"
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                borderRadius: "50%",
                                            }}
                                            onClick={() =>
                                                openImageModal(
                                                    emp.profileImage
                                                        ? `http://localhost:8080/${emp.profileImage}`
                                                        : "http://bootdey.com/img/Content/avatar/avatar1.png"
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        {emp.firstName} {emp.lastName}
                                    </td>
                                    <td>{emp.mobile}</td>
                                    <td>{emp.gender}</td>
                                    <td>{emp.position}</td>
                                    <td>{emp.branch}</td>
                                    <td>{emp.dob}</td>
                                    <td>{emp.username}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.address}</td>
                                    <td>{emp.alternativeMobile}</td>
                                    <td>{emp.dateOfJoining}</td>
                                    {/* <td>{emp.resetToken}</td> */}
                                    <td>
                                        <i
                                            className="fas fa-edit text-primary me-3"
                                            onClick={() => updateHandler(emp.id)}
                                            style={{ cursor: "pointer" }}
                                            title="Update"
                                        ></i>
                                        <i
                                            className="fas fa-trash text-danger me-3"
                                            onClick={() => deleteHandler(emp.id)}
                                            style={{ cursor: "pointer" }}
                                            title="Delete"
                                        ></i>
                                        <i
                                            className="fas fa-user-circle text-info"
                                            onClick={() => viewProfile(emp.id)}
                                            style={{ cursor: "pointer" }}
                                            title="View Profile"
                                        ></i>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                <div>
                    <button
                        className="btn btn-primary mt-3 col-3"
                        style={{
                            display: "block",
                            margin: "auto",
                        }}
                        onClick={printTable}
                    >
                        Print Table
                    </button>
                </div>
            </div>

            {/* Image Modal */}
            {showImageModal && (
                <div className="modal show " style={{ display: "block", backgroundColor: "transparent", marginTop: "200px", marginLeft: "100px" }}>
                    <div className="modal-dialog" style={{ maxWidth: "500px", maxHeight: "500px", margin: "auto" }}>
                        <div className="modal-content" style={{ border: "none", backgroundColor: "transparent", boxShadow: "none" }}>
                            <div className="modal-header" style={{ border: "none", backgroundColor: "transparent" }}>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeImageModal}
                                    style={{ color: "#fff" }} // You can customize the close button color
                                ></button>
                            </div>
                            <div className="modal-body" style={{ textAlign: "center", padding: "0" }}>
                                <img
                                    src={selectedImage}
                                    alt="Selected Profile"
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        maxWidth: "500px",
                                        maxHeight: "500px",
                                        objectFit: "contain",
                                        borderRadius: "50%", // Makes the image round
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
                </div>
        </>
    );
}

export default ListEmployeeComponent;
import React, { useState, useEffect } from 'react';
import { savedEmployee, updateDataEmployee, editEmployee } from '../service/EmployeeService';
import '../style/employeeform.css';
import { useNavigate, useParams } from 'react-router-dom';

function EmployeeComponent() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [gender, setGender] = useState('');
    const [position, setPosition] = useState('');
    const [branch, setBranch] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [alternativeMobile, setAlternativeMobile] = useState('');
    const [dateOfJoining, setDateOfJoining] = useState('');
    const [resetToken, setResetToken] = useState('');

    const navigate = useNavigate();
    const { id } = useParams();

    function pageTitle() {
        if (id) {
            return <h4 className='card-title'>Update Employee</h4>;
        } else {
            return <h4 className='card-title'>Add Employee</h4>;
        }
    }

    useEffect(() => {
        if (id) {
            editEmployee(id).then((response) => {
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setMobile(response.data.mobile);
                setGender(response.data.gender);
                setPosition(response.data.position);
                setBranch(response.data.branch);
                setDob(response.data.dob);
                setEmail(response.data.email);
                setUsername(response.data.username);
                setPassword(response.data.password);
                setAddress(response.data.address);
                setAlternativeMobile(response.data.alternativeMobile);
                setDateOfJoining(response.data.dateOfJoining);
                setResetToken(response.data.resetToken);
            });
        }
    }, [id]);

    function saveEmployee(e) {
        e.preventDefault();

        const employee = { 
            firstName, 
            lastName, 
            mobile, 
            gender, 
            position, 
            branch, 
            dob, 
            email, 
            username, 
            password, 
            address, 
            alternativeMobile, 
            dateOfJoining, 
            resetToken 
        };

        // Check if all fields are filled
        if (
            firstName === "" || lastName === "" || mobile === "" || gender === "" || 
            position === "" || branch === "" || dob === "" || email === "" || 
            username === "" || password === "" || address === "" || 
            alternativeMobile === "" || dateOfJoining === ""
        ) {
            return;
        }

        if (id) {
            updateDataEmployee(id, employee).then(() => {
                navigate(`/profile/${id}`);
            }).catch((error) => {
                console.error(error);
            });
        } else {
            savedEmployee(employee).then(() => {
                navigate('/admindashboard');
            }).catch((error) => {
                console.error(error);
            });
        }
    }

    return (
        <>
    <div className="container d-flex justify-content-center bg-light ">
    <div className="col-10 d-flex justify-content-center bg-light ">
        <div className="card">
            <div className="card-header text-center">
                {pageTitle()}
            </div>
            <div className="card-body">
                <form onSubmit={saveEmployee}>
                    {/* Row for First and Last Name */}
                    <div className="row mb-3">
                        <div className="col-6">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                className="form-control"
                                value={firstName}
                                placeholder="Enter first name"
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                className="form-control"
                                value={lastName}
                                placeholder="Enter last name"
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Row for Mobile and Alternative Mobile */}
                    <div className="row mb-3">
                        <div className="col-6">
                            <label htmlFor="mobile" className="form-label">Mobile</label>
                            <input
                                type="text"
                                id="mobile"
                                className="form-control"
                                value={mobile}
                                placeholder="Enter mobile number"
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="alternativeMobile" className="form-label">Alternative Mobile</label>
                            <input
                                type="text"
                                id="alternativeMobile"
                                className="form-control"
                                value={alternativeMobile}
                                placeholder="Enter alternative mobile"
                                onChange={(e) => setAlternativeMobile(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Row for Email and Gender */}
                    <div className="row mb-3">
                        <div className="col-6">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                placeholder="Enter email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="gender" className="form-label">Gender</label>
                            <input
                                type="text"
                                id="gender"
                                className="form-control"
                                value={gender}
                                placeholder="Enter gender"
                                onChange={(e) => setGender(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Row for Username and Password */}
                    <div className="row mb-3">
                        <div className="col-6">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                value={username}
                                placeholder="Enter username"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                placeholder="Enter password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Full-width Address */}
                    <div className="row mb-3">
                        <div className="col-12">
                            <label htmlFor="address" className="form-label">Address</label>
                            <textarea
                                id="address"
                                className="form-control"
                                value={address}
                                placeholder="Enter address"
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Row for Position and Branch */}
                    <div className="row mb-3">
                        <div className="col-6">
                            <label htmlFor="position" className="form-label">Position</label>
                            <input
                                type="text"
                                id="position"
                                className="form-control"
                                value={position}
                                placeholder="Enter position"
                                onChange={(e) => setPosition(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="branch" className="form-label">Branch</label>
                            <select
                                id="branch"
                                className="form-select"
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                required
                            >   
                                <option value="IIE 100FT Gandhipuram">IIE, 100 FT </option>
                                <option value="IIE Kuniyamuthur">IIE, Kuniyamuthur</option>
                                <option value="IIE Hopes">IIE Hopes</option>
                            </select>
                        </div>
                    </div>

                    {/* Date Fields */}
                    <div className="row mb-3">
                        <div className="col-6">
                            <label htmlFor="dob" className="form-label">Date of Birth</label>
                            <input
                                type="date"
                                id="dob"
                                className="form-control"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="dateOfJoining" className="form-label">Date of Joining</label>
                            <input
                                type="date"
                                id="dateOfJoining"
                                className="form-control"
                                value={dateOfJoining}
                                onChange={(e) => setDateOfJoining(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Reset Token */}
                    <div className="row mb-3">
                        <div className="col-6">
                            <label htmlFor="resetToken" className="form-label">Reset Token (Optional)</label>
                            <input
                                type="text"
                                id="resetToken"
                                className="form-control"
                                value={resetToken}
                                placeholder="Enter reset token"
                                onChange={(e) => setResetToken(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="row mb-3">
                        <div className="col-12 text-end">
                            <button type="submit" className="btn btn-success">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>




        </>
    );
}

export default EmployeeComponent;

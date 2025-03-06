import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// import './AdminLogin.css'; // Import the CSS file for styling

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginData = { username, password };

        try {
            const response = await axios.post('http://localhost:8080/api/users/authenticate', loginData);
            console.log('Login Successful:', response.data);
            navigate('/admindashboard');
        } catch (error) {
            setErrorMessage(error.response ? 'Invalid credentials. Try again.' : 'Something went wrong.');
        }
    };

    return (
        <div className="login-container">
            {/* Left Section */}
            <div className="left-section">
                <i className="admin-icon bi bi-person-circle"></i>
                <h3>Welcome to the Admin Panel</h3>
                <p>Manage your dashboard securely and efficiently. Login to proceed.</p>
            </div>

            {/* Right Section */}
            <div className="right-section">
                <h3 className="text-center mb-4">Admin Login</h3>
                <form onSubmit={handleLogin}>
                    <div className="form-group mb-3">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password">Passwords</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-login w-100">Login</button>
                    {errorMessage && <p className="text-danger mt-3 text-center">{errorMessage}</p>}
                    <div className="forgot-password">
                        <a href="#">Forgot Password?</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;

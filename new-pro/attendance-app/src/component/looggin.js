import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
    const [isAdminLogin, setIsAdminLogin] = useState(true);

    const handleSwitchToEmployee = () => {
        setIsAdminLogin(false);
    };

    const handleSwitchToAdmin = () => {
        setIsAdminLogin(true);
    };

    return (
        <div className="login-container" style={styles.loginContainer}>
            {/* Login Header */}
            <div style={styles.loginHeader}>{isAdminLogin ? 'Admin Login' : 'Employee Login'}</div>

            {/* Admin Login Form */}
            {isAdminLogin && (
                <div id="adminLogin">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="adminEmail" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="adminEmail"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="adminPassword" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="adminPassword"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={styles.button}>
                            Login as Admin
                        </button>
                    </form>
                    <p className="mt-3 text-center">
                        Not an admin?{' '}
                        <span
                            id="switchToEmployee"
                            className="toggle-link"
                            style={styles.toggleLink}
                            onClick={handleSwitchToEmployee}
                        >
                            Login as Employee
                        </span>
                    </p>
                </div>
            )}

            {/* Employee Login Form */}
            {!isAdminLogin && (
                <div id="employeeLogin">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="employeeEmail" className="form-label">
                                Username
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="employeeEmail"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="employeePassword" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="employeePassword"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={styles.button}>
                            Login
                        </button>
                    </form>
                    <p className="mt-3 text-center">
                        Not an employee?{' '}
                        <span
                            id="switchToAdmin"
                            className="toggle-link"
                            style={styles.toggleLink}
                            onClick={handleSwitchToAdmin}
                        >
                            Login as Admin
                        </span>
                    </p>
                    <p className="mt-2 text-center">
                        New Employee?{' '}
                        <a href="regist.html" className="register-link" style={styles.registerLink}>
                            Click here to register
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
};

const styles = {
    loginContainer: {
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(10px)',
        animation: 'slideUp 0.7s ease-out',
    },
    loginHeader: {
        backgroundColor: 'transparent',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '30px',
        textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)',
    },
    button: {
        background: '#2575fc',
        border: 'none',
        padding: '12px',
        width: '100%',
        fontSize: '1.1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    toggleLink: {
        color: '#ffbb00',
        textDecoration: 'none',
        cursor: 'pointer',
    },
    registerLink: {
        color: '#28a745',
        fontWeight: '600',
    },
};

export default LoginPage;

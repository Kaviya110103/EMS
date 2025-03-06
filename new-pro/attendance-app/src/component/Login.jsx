
// import React, { useState } from 'react';
// import { Container, Form, Button, Alert } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import { login } from '../service/AuthService.js'; // Assume this service handles authentication

// const LoginComponent = () => {
//     const navigate = useNavigate();
//     const [credentials, setCredentials] = useState({ username: '', password: '' });
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setCredentials({ ...credentials, [name]: value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');

//         // Call the login service
//         login(credentials)
//             .then((response) => {
//                 // Check if login was successful
//                 if (response.status === 200) {
//                     setSuccess('Login successful!');
//                     setTimeout(() => {
//                         navigate('/home'); // Redirect to home or another page
//                     }, 2000);
//                 }
//             })
//             .catch((error) => {
//                 setError('Invalid username or password.'); // Set error message
//             });
//     };

//     return (
//         <Container className="mt-5">
//             <h2 className="text-center">Login</h2>
//             {error && <Alert variant="danger">{error}</Alert>}
//             {success && <Alert variant="success">{success}</Alert>}
//             <Form onSubmit={handleSubmit}>
//                 <Form.Group controlId="formUsername">
//                     <Form.Label>Username</Form.Label>
//                     <Form.Control
//                         type="text"
//                         placeholder="Enter your username"
//                         name="username"
//                         value={credentials.username}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Form.Group>

//                 <Form.Group controlId="formPassword">
//                     <Form.Label>Password</Form.Label>
//                     <Form.Control
//                         type="password"
//                         placeholder="Enter your password"
//                         name="password"
//                         value={credentials.password}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Form.Group>

//                 <Button variant="primary" type="submit" className="mt-3">
//                     Login
//                 </Button>
//             </Form>
//         </Container>
//     );
// };

// export default LoginComponent;

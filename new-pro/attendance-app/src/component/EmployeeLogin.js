import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from 'mdb-react-ui-kit';

function EmployeeLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
        const response = await axios.post('http://localhost:8080/api/emp/authenticate', {
            username,
            password
        });
        console.log('Login successful:', response.data);
        navigate(`/profile/${response.data.id}`);
        // Handle successful login
    } catch (error) {
        console.error('Login failed:', error);
        setError('Login failed. Please check your credentials.');
    }
};

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   const loginDetails = { username, password };

  //   try {
  //     // Send login request to backend API
  //     const response = await axios.post(
  //       'http://localhost:8080/api/emp/authenticate',
  //       loginDetails
  //     );

  //     // If login is successful, redirect to employee profile page
  //     if (response.status === 200) {
  //       // Assuming employee ID is returned in the response
  //       navigate(`/profile/${response.data.id}`);
  //     } else {
  //       setError('Invalid username or password');
  //     }
  //   } catch (error) {
  //     setError('Error occurred during login');
  //     console.error(error);
  //   }
  // };

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom d-flex align-items-center justify-content-center flex-column">
      <MDBRow className="d-flex align-items-center justify-content-center w-100 ">
        <MDBCol col="10" md="6">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img-fluid"
            alt="Sample image"
          />
        </MDBCol>

        <MDBCol col="4" md="6">
          <div className="d-flex flex-row align-items-center justify-content-center">
            <p className="lead fw-normal mb-0 me-3">Sign in with</p>

            <MDBBtn floating size="md" tag="a" className="me-2">
              <MDBIcon fab icon="facebook-f" />
            </MDBBtn>

            <MDBBtn floating size="md" tag="a" className="me-2">
              <MDBIcon fab icon="twitter" />
            </MDBBtn>

            <MDBBtn floating size="md" tag="a" className="me-2">
              <MDBIcon fab icon="linkedin-in" />
            </MDBBtn>
          </div>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">Or</p>
          </div>

          {/* Input fields for username and password */}
          <MDBInput
            wrapperClass="mb-4"
            label="Email address"
            id="formControlLg"
            type="text"
            size="lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            id="formControlLg"
            type="password"
            size="lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Error message display */}
          {error && <p className="text-danger">{error}</p>}

          <div className="d-flex justify-content-between mb-4">
            <MDBCheckbox
              name="flexCheck"
              value=""
              id="flexCheckDefault"
              label="Remember me"
            />
            <a href="#!">Forgot password?</a>
          </div>

          <div className="text-center text-md-start mt-4 pt-2">
            <MDBBtn className="mb-0 px-5" size="lg" onClick={handleLogin}>
              Login
            </MDBBtn>
            <p className="small fw-bold mt-2 pt-1 mb-2">
              Don't have an account?{' '}
              <a href="#!" className="link-danger">
                Register
              </a>
            </p>
          </div>
        </MDBCol>
      </MDBRow>

      {/* Copyright section */}
      <MDBRow className="d-flex align-items-center justify-content-center mt-5 w-100">
        <div className="text-center text-white bg-primary py-2 px-4">
          Copyright © 2020. All rights reserved.
        </div>
      </MDBRow>
    </MDBContainer>
  );
}

export default EmployeeLogin;

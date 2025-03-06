import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav } from 'react-bootstrap';
import '../style/profile.css';
import { Link, useParams } from 'react-router-dom';
import { getEmployeeById } from '../service/EmployeeService.js'; // Import the service to get employee data
import { useNavigate } from 'react-router-dom';

const EmpProfiles = () => {
  const { id } = useParams(); // Get the ID from the route parameters
  const [employee, setEmployee] = useState({
    id: '',
    firstName: '',
    lastName: '',
    position: '',
    branch: '',
    username: '',
    mobile: '',
    gender: '',
    dob: '',
    password: ''
  });

  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    // Fetch employee data from API based on ID
    getEmployeeById(id).then((response) => {
      setEmployee(response.data); // Assuming response.data contains the employee object
    }).catch(error => {
      console.error(error);
    });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value
    });
  };

  function updatehandler() {
    navigate(`/update-employee/${employee.id}`); // Navigate to the update page
  }

  return (
    <Container className="px-4 mt-4">
      <Nav className="nav-borders">
        <Nav.Link href="#" target="_blank" active style={{ color: '#007bff', fontWeight: 'bold' }}>
          Profile
        </Nav.Link>
        <Nav.Link as={Link} to="/markattendance">
          Mark Attendance
        </Nav.Link>
        <Nav.Link className="ms-auto" href="#" target="_blank">
          Logout
        </Nav.Link>
      </Nav>
      <hr className="mt-0 mb-4" />
      <Row>
        <Col xl={4}>
          <Card className="mb-4 mb-xl-0">
            <Card.Header>Profile Picture</Card.Header>
            <Card.Body className="text-center">
              <img
                className="img-account-profile rounded-circle mb-2"
                src="http://bootdey.com/img/Content/avatar/avatar1.png"
                alt=""
              />
              <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
              <Button type="submit" className="btn-primary">
                Upload
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex flex-row">
              <div className="col-6">Employee Details</div>
              <div className="col-6">Employee ID: {employee.id}</div>
            </Card.Header>
            <Card.Body>
              <Form>
                <Row className="gx-3 mb-3">
                  <Col md={6}>
                    <Form.Group controlId="inputFirstName">
                      <Form.Label>First name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your first name"
                        name="firstName"
                        value={employee.firstName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="inputLastName">
                      <Form.Label>Last name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your last name"
                        name="lastName"
                        value={employee.lastName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="gx-3 mb-3">
                  <Col md={6}>
                    <Form.Group controlId="inputPosition">
                      <Form.Label>Position</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your position"
                        name="position"
                        value={employee.position}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="inputBranch">
                      <Form.Label>Branch</Form.Label>
                      <Form.Select name="branch" value={employee.branch} onChange={handleInputChange}>
                        <option value="Branch 1">Branch 1</option>
                        <option value="Branch 2">Branch 2</option>
                        <option value="Branch 3">Branch 3</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="gx-3 mb-3">
                  <Col md={6}>
                    <Form.Group controlId="inputUsername">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your username"
                        name="username"
                        value={employee.username}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="inputMobile">
                      <Form.Label>Phone number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter your phone number"
                        name="mobile"
                        value={employee.mobile}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="gx-3 mb-3">
                  <Col md={6}>
                    <Form.Group controlId="inputGender">
                      <Form.Label>Gender</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Male / Female / Others"
                        name="gender"
                        value={employee.gender}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="inputBirthday">
                      <Form.Label>Birthday</Form.Label>
                      <Form.Control
                        type="date" // Changed to date input
                        name="dob"
                        value={employee.dob}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="inputPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        value={employee.password}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" type="button" onClick={updatehandler}>
                  Update
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EmpProfiles;

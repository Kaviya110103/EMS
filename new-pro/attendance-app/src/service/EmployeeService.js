import axios from "axios";

const URL = "http://localhost:8080/api/emp";

// Fetch the list of all employees
export const listEmployees = () => axios.get(URL);

// Save a new employee
export const savedEmployee = (employee) => axios.post(URL, employee);

// Get employee details by ID
export const getEmployeeById = (employeeId) => axios.get(`${URL}/${employeeId}`);

// Edit an existing employee by ID (for retrieving details before updating)
export const editEmployee = (employeeId) => axios.get(`${URL}/${employeeId}`);

// Update employee data by ID
export const updateDataEmployee = (employeeId, employee) => axios.put(`${URL}/${employeeId}`, employee);

// Delete an employee by ID
export const deleteEmployee = (employeeId) => axios.delete(`${URL}/${employeeId}`);

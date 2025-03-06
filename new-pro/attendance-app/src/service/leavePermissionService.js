import axios from "axios";

// Base URL for the backend API
const API_BASE_URL = "http://localhost:8080/api/leave-permissions";

// Fetch all leave/permission requests
export const fetchAllRequests = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

// Fetch leave/permission requests for a specific employee
export const fetchRequestsByEmployee = async (employeeId) => {
  const response = await axios.get(`${API_BASE_URL}/employee/${employeeId}`);
  return response.data;
};

// Create a new leave/permission request
export const createRequest = async (data) => {
  const response = await axios.post(API_BASE_URL, data);
  return response.data;
};

// Update the status of a leave/permission request
export const updateRequestStatus = async (id, status) => {
    const url = `${API_BASE_URL}/${id}/status`;
    try {
        const response = await axios
            .put(url, null, { params: { status } }) // Pass the status as a query parameter
            ;
        return response.data;
    } catch (error) {
        console.error("Error updating request status:", error);
        throw error; // Rethrow the error for further handling
    }
  };

// Delete a leave/permission request
export const deleteRequest = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};

const createLeavePermission = async (employeeId, leaveDetails) => {
  // Assume `attendanceId` is already available (either from a previous API call or input)
  const attendanceId = 123; // Replace with the actual attendance ID

  const leavePermissionData = {
    ...leaveDetails, // Include other leave details like type, start date, reason, etc.
    attendance: { id: attendanceId }, // Include the attendance ID
  };

  try {
    const newLeavePermission = await createLeavePermission(leavePermissionData);
    console.log('Leave Permission created:', newLeavePermission);
  } catch (error) {
    console.error('Error creating leave permission:', error);
  }
};

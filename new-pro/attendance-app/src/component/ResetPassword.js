import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const token = searchParams.get('token');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/reset-password', { token, password });
      setMessage(response.data);
    } catch (error) {
      setMessage('Error occurred: ' + error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPassword;

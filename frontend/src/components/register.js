// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To redirect after successful registration

function Register() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);  // To handle error messages
  const [loading, setLoading] = useState(false);  // Loading state while submitting
  const history = useNavigate(); // To redirect after successful registration

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send POST request to backend to register the user
      const response = await axios.post('http://localhost:5000/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle success (e.g., store token, redirect to login)
      console.log('Registration successful:', response.data);
      history.push('/login'); // Redirect to login page after successful registration

    } catch (err) {
      // Handle error (e.g., username already taken)
      console.error('Registration error:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;

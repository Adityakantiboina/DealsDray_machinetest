import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      const token = response.data.token;

      console.log('Login successful:', response.data);
      console.log(token);

      nav("/dashboard");
      Cookies.set('token', token);
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-no-repeat" style={{ backgroundImage: "url('https://31.media.tumblr.com/41c01e3f366d61793e5a3df70e46b462/tumblr_n4vc8sDHsd1st5lhmo1_1280.jpg')" }}>
      <div className="w-full max-w-sm p-8 bg-black bg-opacity-70 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <span className="text-4xl text-white">
            <i className="fas fa-lock"></i>
          </span>
        </div>
        <h2 className="text-2xl font-bold text-center text-white">Login</h2>

        {/* Display error message if login fails */}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-transparent border border-gray-400 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-transparent border border-gray-400 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="/forgot-password" className="text-sm text-gray-400 hover:text-blue-500">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;

import { React, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from "../images/logo.jpg";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get('token');
      console.log("Token retrieved:", token); // Check if the token is correct
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          console.log(data);
        } else {
          console.log("Failed to fetch user data");
        }
      } catch (error) {
        console.log("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo Image */}
          <img src={logo} alt="Logo" className="h-8 w-8 rounded-full" />
          {/* Navigation Links */}
          <Link to="/dashboard" className="hover:text-gray-300">Home</Link>
          <Link to="/employeelist" className="hover:text-gray-300">Employee List</Link>
        </div>
        <div className="flex items-center space-x-4">
          {/* User or Guest */}
          <span>{user ? user.username : "Aditya"}</span>
          {/* Logout Button */}
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
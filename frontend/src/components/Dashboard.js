// src/pages/Dashboard.js
import React from 'react';
import Navbar from './Navbar';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> 

      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-full flex justify-start mb-4">
          <h2 className="text-5xl font-bold text-gray-800">Dashboard</h2>
        </div>
        <div className="w-full flex justify-center">
          <h1 className="text-3xl font-semibold text-gray-800">Welcome to Admin Panel</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

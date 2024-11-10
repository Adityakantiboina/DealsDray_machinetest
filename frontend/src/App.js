// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Login from './components/login';
import Register from "./components/register";
import Dashboard from "./components/Dashboard";
import EmployeeForm from "./components/CreateEmployee";
import EmployeeList from "./components/EmployeeList";
import EditEmployee from "./components/EditEmployee";
function App() {
  return (
    <Router>
    <Routes>
     <Route path="/" element={<Login/>}/>
     <Route path="/register" element={<Register/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/create" element={<EmployeeForm/>}/>
      <Route path="/employeelist" element={<EmployeeList/>}/>
      <Route path="/edit/:email" element={<EditEmployee/>}/>
    </Routes>
    </Router>
  );
}

export default App;

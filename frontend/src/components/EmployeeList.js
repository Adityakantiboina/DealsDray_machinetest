import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";  // Importing Navbar

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);  // For handling delete confirmation
  const [employeeToDelete, setEmployeeToDelete] = useState(null);  // Store email of employee to be deleted

  const navigate = useNavigate();  // Using useNavigate for redirection

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/employees");
        setEmployees(response.data.employees);
        setTotalCount(response.data.employees.length);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // Search functionality
  useEffect(() => {
    setFilteredEmployees(
      employees.filter((employee) =>
        employee.name.toLowerCase().includes(search.toLowerCase()) ||
        employee.email.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, employees]);

  const handleEdit = (email) => {
    navigate(`/edit/${email}`);  // Redirect to the edit page using useNavigate
  };

  const handleDeleteClick = (email) => {
    setEmployeeToDelete(email);  // Store email to delete
    setIsDeleting(true);  // Show confirmation dialog
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/employee/${employeeToDelete}`);
      setEmployees(employees.filter((emp) => emp.email !== employeeToDelete));
      alert("Employee deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Error deleting employee.");
    } finally {
      setIsDeleting(false);  // Close the confirmation popup
    }
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);  // Close the confirmation popup without deletion
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto p-6 flex-1">
        <div className="flex justify-between mb-6 items-center">
          <div className="text-gray-800">
            <h2 className="text-2xl font-semibold">Employee List</h2>
            <p className="text-gray-600">Total Employees: {totalCount}</p>
          </div>
          <div className="flex space-x-4">
            {/* Total count before Create Employee */}
            <button
              onClick={() => navigate("/create")}
              className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
            >
              Create Employee
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
        <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-80 px-4 py-2 bg-gray-100 border  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      
        </div>

        {/* Employee Table */}
        <table className="w-full table-auto bg-white shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="border px-4 py-2 text-left">Unique ID</th>
              <th className="border px-4 py-2 text-left">Image</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Mobile</th>
              <th className="border px-4 py-2 text-left">Designation</th>
              <th className="border px-4 py-2 text-left">Gender</th>
              <th className="border px-4 py-2 text-left">Course</th>
              <th className="border px-4 py-2 text-left">Create Date</th>
              <th className="border px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {filteredEmployees.map((employee) => (
              <tr key={employee.email} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{employee._id.slice(-3)}</td>
                <td className="border px-4 py-2">
                  <img
                    src={`http://localhost:5000/${employee.image}`}
                    alt="employee"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="border px-4 py-2">{employee.name}</td>
                <td className="border px-4 py-2">{employee.email}</td>
                <td className="border px-4 py-2">{employee.mobile}</td>
                <td className="border px-4 py-2">{employee.designation}</td>
                <td className="border px-4 py-2">{employee.gender}</td>
                <td className="border px-4 py-2">{employee.course.join(", ")}</td>
                <td className="border px-4 py-2">{new Date(employee.createDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(employee.email)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 transition mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(employee.email)}
                    className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Confirmation Popup */}
        {isDeleting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this employee?</h3>
              <div className="flex justify-between">
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600 transition"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="bg-gray-300 text-black px-6 py-2 rounded shadow hover:bg-gray-400 transition"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;

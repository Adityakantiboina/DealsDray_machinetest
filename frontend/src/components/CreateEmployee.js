import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";  // Importing Navbar

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: [],
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    if (!formData.designation) newErrors.designation = "Designation is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (formData.course.length === 0) newErrors.course = "At least one course must be selected";
    if (!formData.image) newErrors.image = "Image upload is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox"
        ? checked ? [...prevData.course, value] : prevData.course.filter(c => c !== value)
        : value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("mobile", formData.mobile);
    data.append("designation", formData.designation);
    data.append("gender", formData.gender);
    formData.course.forEach((course) => data.append("course", course));
    if (formData.image) data.append("image", formData.image);

    try {
      const response = await axios.post("http://localhost:5000/employee", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage("Employee registered successfully!");
      setErrorMessage(""); // Clear any error message
      setFormData({
        name: "",
        email: "",
        mobile: "",
        designation: "",
        gender: "",
        course: [],
        image: null,
      });
      // Optionally, redirect after success
      navigate("/employeelist"); // Replace with the desired route
    } catch (error) {
      setErrorMessage("Error submitting form: " + (error.response?.data?.message || "Server error"));
      setSuccessMessage(""); // Clear success message
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto p-6 flex-1">
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Employee Registration</h2>

          {/* Success message */}
          {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}

          {/* Error message */}
          {errorMessage && <p className="text-red-600 text-center mb-4">{errorMessage}</p>}

          <div className="mb-6">
            <label className="block text-lg text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-lg text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-lg text-gray-700 mb-2">Mobile Number</label>
            <input
              type="text"
              name="mobile"
              placeholder="Enter Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-lg text-gray-700 mb-2">Designation</label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Designation</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
            {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-lg text-gray-700 mb-2">Gender</label>
            <div className="flex items-center mb-2">
              <label className="mr-4 flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={formData.gender === "M"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={formData.gender === "F"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Female
              </label>
            </div>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-lg text-gray-700 mb-2">Course</label>
            <div className="flex items-center">
              <label className="mr-6 flex items-center">
                <input
                  type="checkbox"
                  name="course"
                  value="MCA"
                  checked={formData.course.includes("MCA")}
                  onChange={handleChange}
                  className="mr-2"
                />
                MCA
              </label>
              <label className="mr-6 flex items-center">
                <input
                  type="checkbox"
                  name="course"
                  value="BCA"
                  checked={formData.course.includes("BCA")}
                  onChange={handleChange}
                  className="mr-2"
                />
                BCA
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="course"
                  value="BSC"
                  checked={formData.course.includes("BSC")}
                  onChange={handleChange}
                  className="mr-2"
                />
                BSC
              </label>
            </div>
            {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-lg text-gray-700 mb-2">Image Upload</label>
            <input
              type="file"
              accept=".jpg,.png"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;

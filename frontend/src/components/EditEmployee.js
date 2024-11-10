import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

const EditEmployee = () => {
  const { email } = useParams();
  const [employeeData, setEmployeeData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: [], // For multiple course selection
    image: null, // For image file
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/employee/${email}`);
        setEmployeeData(response.data);
        setFormData(response.data); // Populate form with employee data
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchEmployee();
  }, [email]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, image: files[0] }); // Set image file
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked
          ? [...formData.course, value]
          : formData.course.filter((c) => c !== value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("mobile", formData.mobile);
    form.append("designation", formData.designation);
    form.append("gender", formData.gender);
    form.append("course", formData.course.join(",")); // Join array of courses to a string
    
    // Append the image file if it exists
    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      await axios.put(`http://localhost:5000/employee/${email}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Employee updated successfully!");
      navigate("/employeelist"); // Redirect back to the employee list
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  if (!employeeData) return <div className="text-center text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar/>

      {/* Main content */}
      <div className="container mx-auto p-8 flex-1">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Edit Employee</h2>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-lg text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded p-2 w-full mt-2"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-lg text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded p-2 w-full mt-2"
              disabled // Disable email input since it's read-only
            />
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className="block text-lg text-gray-700">Mobile</label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="border rounded p-2 w-full mt-2"
            />
          </div>

          {/* Designation */}
          <div>
            <label htmlFor="designation" className="block text-lg text-gray-700">Designation</label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="border rounded p-2 w-full mt-2"
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-lg text-gray-700">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border rounded p-2 w-full mt-2"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Courses */}
          <div>
            <label className="block text-lg text-gray-700">Courses</label>
            <div className="space-y-2 mt-2">
              {["MCA", "BCA", "BSC"].map((course) => (
                <div key={course} className="flex items-center">
                  <input
                    type="checkbox"
                    id={course.toLowerCase()}
                    name="course"
                    value={course}
                    checked={formData.course.includes(course)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor={course.toLowerCase()}>{course}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div>
            <label htmlFor="image" className="block text-lg text-gray-700">Employee Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="border rounded p-2 mt-2"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mt-6 hover:bg-blue-700">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;

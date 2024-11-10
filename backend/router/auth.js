require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const User = require("../model/userSchema");

const multer = require("multer");
const Employee = require("../model/employee");
const fs = require('fs');

router.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ success: false, message: "Username not found!" });
        }

        const isMatch = (req.body.password === user.password) ? true : false;

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password!" });
        }

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET, {
                expiresIn: "4h",
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 4 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === "production",
        }).status(200).json({ success: true, message: "Login successful" });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.get("/user", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Authorization token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = {
            username: user.username,
        };

        res.status(200).json(userData);
    } catch (error) {
        console.error("Token verification error:", error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token" });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        }

        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const newUser = new User({
            username,
            password,  // Save password as it is without hashing
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir); 
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/employee", upload.single("image"), async (req, res) => {
    const { name, email, mobile, designation, gender, course } = req.body;
  
    if (!name || !email || !mobile || !designation || !gender || !course || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) {
        return res.status(409).json({ message: "Email already exists" });
      }
  
      const newEmployee = new Employee({
        name,
        email,
        mobile,
        designation,
        gender,
        course: Array.isArray(course) ? course : [course],
        image: req.file.path,
      });
  
      await newEmployee.save();
      res.status(201).json({ message: "Employee registered successfully" });
    } catch (error) {
      console.error("Error saving employee:", error);
      res.status(500).json({ message: "Error registering employee", error });
    }
  });
  

  router.get("/employees", async (req, res) => {
    try {
      const employees = await Employee.find(); // Fetch all employees
  
      if (employees.length === 0) {
        return res.status(404).json({ message: "No employees found" });
      }
  
      res.status(200).json({ employees }); // Send back the list of employees
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Error fetching employees" });
    }
  });

  router.get("/employee/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const employee = await Employee.findOne({ email });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json(employee); // Send back employee data
    } catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).json({ message: "Error fetching employee data" });
    }
});

  
  router.put("/employee/:email", upload.single('image'), async (req, res) => {
    const { email } = req.params;
    const { name, mobile, designation, gender, course } = req.body;

    // Prepare the data to update
    let updatedEmployeeData = {
        name,
        mobile,
        designation,
        gender,
        course: Array.isArray(course) ? course : [course], // Ensure course is an array
    };

    // If a new image is uploaded, update the image field
    if (req.file) {
        // If the employee already has an image, delete the old one from the server
        try {
            const existingEmployee = await Employee.findOne({ email });
            if (existingEmployee && existingEmployee.image) {
                fs.unlinkSync(existingEmployee.image); // Delete the old image
            }
        } catch (err) {
            console.error("Error deleting old image:", err);
        }

        updatedEmployeeData.image = req.file.path; // Update the image path
    }

    try {
        // Update the employee in the database
        const updatedEmployee = await Employee.findOneAndUpdate(
            { email },
            updatedEmployeeData,
            { new: true }
        );

        // If no employee is found, return a 404 error
        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json(updatedEmployee); // Send the updated employee data
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating employee data" });
    }
});

router.delete("/employee/:email", async (req, res) => {
    const { email } = req.params;
  
    try {
      const deletedEmployee = await Employee.findOneAndDelete({ email });
  
      if (!deletedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ message: "Error deleting employee" });
    }
  });
  

module.exports = router;
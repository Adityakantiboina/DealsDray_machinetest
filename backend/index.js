const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const authRoutes=require("./router/auth");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
// Use cookie-parser middleware before handling any routes
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
app.use('/', authRoutes);
// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://adityakantiboina10:Rishi9826@cluster9826.kwxir.mongodb.net/MachineTest", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

//Load environment variables
dotenv.config();

//Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

//Define routes
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Choose role: 'admin' or 'student'
const user = {
  id: '12345',
  role: 'admin' // or 'student'
};

const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

console.log('Your JWT Token:\n', token);

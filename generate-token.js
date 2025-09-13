const jwt = require('jsonwebtoken');
require('dotenv').config();

// Check if JWT_SECRET is configured
if (!process.env.JWT_SECRET) {
    console.error('Error: JWT_SECRET not found in environment variables');
    console.log('Please set JWT_SECRET in your .env file');
    process.exit(1);
}

console.log('JWT_SECRET found in environment');

const user = {
  id: '12345',
  role: 'admin' // Change this to 'student' if needed
};

try {
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('\n Your JWT Token:');
  console.log('Bearer', token);
  console.log('\n Usage: Add this to your Authorization header:');
  console.log('Authorization: Bearer ' + token);
} catch (error) {
  console.error(' Error generating token:', error.message);
}

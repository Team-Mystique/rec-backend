const jwt = require('jsonwebtoken');
require('dotenv').config();

console.log('JWT_SECRET from .env:', process.env.JWT_SECRET);

const user = {
  id: '12345',
  role: 'admin'
};

try {
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('Your JWT Token:\n', token);
} catch (error) {
  console.error('Error generating token:', error.message);
}

require('dotenv').config();
const jwt = require('jsonwebtoken');

const payload = {
  id: 'user123',
  name: 'Test User',
  email: 'testuser@example.com'
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

console.log('Generated JWT:', token);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { uniqueNamesGenerator, adjectives, animals } = require('unique-names-generator');

const generateUserName = uniqueNamesGenerator({
  dictionaries: [adjectives, adjectives, animals],
  separator: ' ',
  style: 'capital',
  length: 3
});

exports.createUser = async (req, res) => {

    const { email, password } = req.body;
    const username = generateUserName;
    try {
        let user;
        user = await User.findOne({where: {email}});

        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({ username, email, password: hashedPassword });
        const { role } = user;
        const userRes = {username, email, role};

        // Generate a JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.status(201).json({ token, user: { username: user.username, email: user.email }, message: "success" });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
};

exports.getEmail = async (req, res) => {
  const {userId} = req.user;
  let user,
      id = userId;
  user = await User.findOne({where: {id}});
  res.status(201).json({email: user.dataValues.email} )
}


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};

exports.createAdminUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role: 'admin' });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create admin user' });
  }
};

exports.createTestUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role: 'test' });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create test user' });
  }
};

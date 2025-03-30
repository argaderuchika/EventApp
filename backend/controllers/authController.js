const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, state, district, taluka, city,address, email, phone, dob, password, isAdmin } = req.body;

    // Check if an admin already exists for the given taluka
    const existingAdmin = await User.findOne({ taluka, isAdmin: true });

    // Only allow the first user in a taluka to be an admin
    const assignedAdmin = isAdmin && !existingAdmin;

    // Set role based on isAdmin status
    const role = assignedAdmin ? 'admin' : 'user';

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with correct isAdmin and role values
    const user = new User({
        name,
        state,
        district,
        taluka,
        city,
        address,
        email,
        phone,
        dob,
        password: hashedPassword,
        isAdmin: assignedAdmin, 
        role
    });

    // Save user to database
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });

} catch (error) {
    res.status(400).json({ error: error.message });
}

};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, taluka: user.taluka, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const userRole = user.role
    res.json({ token , userRole, user: {
      email: user.email,
      city: user.city,
      taluka: user.taluka,
      name: user.name,
      id: user._id
    }});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

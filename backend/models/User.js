const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    dob: Date,
    state: String,
    district: String,
    taluka: String,
    city: String,
    address: String,
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
});
module.exports = mongoose.model('User', UserSchema);

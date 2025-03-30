const mongoose = require('mongoose');

// Define the schema for comments on an event
const CommentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who posted the comment
    text: { type: String, required: true }, // Comment text
    createdAt: { type: Date, default: Date.now } // Timestamp for when the comment was posted
});
const EventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    city: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema],
});
module.exports = mongoose.model('Event', EventSchema);

const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');


// Controller for creating an event (only Admins can create)
const createEvent = asyncHandler(async (req, res) => {
    const { title, description, date, city } = req.body;

    // Ensure the user is an admin
    let admin = await User.findById(req.user.id);
    admin = admin.toObject();
    
    
    if (!admin || admin.role !== 'admin') {
        return res.status(403).json({ message: "Access denied! Only admins can create events." });
    }

    // Ensure admin is assigned to only one city
    if (admin.city !== city) {
        return res.status(400).json({ message: `You can only create events for ${admin.city}` });
    }

    // Create event with the admin's ID
    const event = new Event({
        title,
        description,
        date,
        city,
        createdBy: req.user.id
    });

    await event.save();
    res.status(201).json({ message: "Event created successfully!", event });
});

module.exports = { createEvent };


// Get all events
const getEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({ city: req.user.city })
    .populate("comments.user", "name email") // Populate user details
            .exec();
    res.json(events);
});

// Get event by ID
const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
    .populate("comments.user", "name email") // Populate user details
            .exec();;;
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
});

// Update an event
const updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    Object.assign(event, req.body);
    await event.save();
    res.json(event);
});

// Delete an event
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id).exec(); // Ensure Mongoose Document

    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: 'Not authorized' });
    }

    await event.deleteOne(); // Correct method for Mongoose 6+
    
    res.json({ message: 'Event deleted successfully' });
});


const attendEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id; // Extract user from the request
    
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
    
        // Check if user is already attending
        if (event.attendees.includes(userId)) {
            return res.status(400).json({ message: "User already attending" });
        }
    
        // Push only non-null user IDs directly into the Mongoose document
        event.attendees.push(userId.toString()); // ✅ Modify the actual event document
        await event.save(); // ✅ Ensure changes are saved
    
        res.status(200).json({ attendees: event.attendees });
    } catch (error) {
        console.error("Error attending event:", error);
        res.status(500).json({ message: "Server error" });
    }
    
};



// Add a comment to an event
const postComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.user._id; // Extract user from the request

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Add comment with user reference
        event.comments.push({ user: userId, text });
        await event.save();

        // Populate user details in comments
        const updatedEvent = await Event.findById(id)
            .populate("comments.user", "name email") // Populate user details
            .exec();

        res.status(201).json({ 
            message: "Comment added successfully", 
            comments: updatedEvent.comments // Send updated comments with user info
        });

    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
};




module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent, attendEvent, postComment };
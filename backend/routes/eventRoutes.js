const express = require('express');
const { 
    createEvent, 
    getEvents, 
    getEventById, 
    updateEvent, 
    deleteEvent, 
    attendEvent, 
    postComment 
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createEvent).get(protect, getEvents);
router.route('/:id').get(protect, getEventById).put(protect, updateEvent).delete(protect, deleteEvent);
router.post('/:id/attend', protect, attendEvent);  // ✅ Fixed: Added missing attend event route
router.post('/:id/comment', protect, postComment); // 🚨 Implement this function in the controller

module.exports = router;

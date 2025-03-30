import { Card, CardContent, Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";

const EventCard = ({ event, onDelete, userRole, userId }) => {
  const user = JSON.parse(localStorage.getItem("user")); 
  const token = user?.token;
  const [isAttending, setIsAttending] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(event.attendees.length);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(event.comments || []);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/events/${event._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAttending(data.attendees.map(id => id?.toString()).includes(userId?.toString()));
        setAttendeeCount(data.attendees.length); // Update count
        setComments(data.comments || []); // Load latest comments
      } catch (error) {
        console.error("Error fetching event data:", error.response?.data || error.message);
      }
    };

    fetchEvent();
  }, [event._id, token, userId]);

  const handleAttend = async () => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/events/${event._id}/attend`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsAttending(true);  // Keep button disabled
      setAttendeeCount(data.attendees.length); // Update count
    } catch (error) {
      console.error("Error attending event:", error.response?.data || error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${event._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onDelete(event._id);
      } catch (error) {
        console.error("Error deleting event:", error.response?.data || error.message);
      }
    }
  };

  const handlePostComment = async () => {
    if (!comment.trim()) return;
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/events/${event._id}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update comments state with the latest comments from the API response
      setComments(data.comments);
      setComment(""); // Clear input field
    } catch (error) {
      console.error("Error posting comment:", error.response?.data || error.message);
    }
  };


  console.log("comments",comments)
  return (
    <Card sx={{ maxWidth: 400, mx: "auto", my: 2, p: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {event.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {event.description}
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight="500">
          📅 {new Date(event.date).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          🎟️ {attendeeCount} attending
        </Typography>

        {user.userRole !== "admin" ? (<Button
          variant="contained"
          color="primary"
          onClick={handleAttend}
          sx={{ mt: 2, mx: 1 }}
          disabled={isAttending}  // Disable button after attending
        >
          {isAttending ? "Attending" : "Attend"}
        </Button>) : null}


        {userRole === "admin" && (
          <Button variant="contained" color="error" onClick={handleDelete} sx={{ mt: 2, mx: 1 }}>
            Delete Event
          </Button>
        )}

        {/* Comment Input */}
        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button onClick={handlePostComment} variant="contained" sx={{ mt: 1 }}>
          Post Comment
        </Button>

        {error && <Typography color="error">{error}</Typography>}

        {/* Display Comments */}
        {comments.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Comments:
            </Typography>
            {comments.map((c, index) => (
              <Typography key={index} variant="body2" sx={{ mt: 1 }}>
                {c.user.name} : {c.text}
              </Typography>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;

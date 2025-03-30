import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Card, CardContent } from "@mui/material";
import AddEventForm from "../components/AddEventForm";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("storedUser", storedUser);
    if (!storedUser || storedUser.userRole !== "admin") {
      navigate("/events"); // Redirect non-admin users
    } else {
      setUser(storedUser.user);
    }
  }, [navigate]);

  if (!user) return <Typography variant="h6">Loading...</Typography>;

  return (
    <Container sx={{ marginTop: 10 }}>
      {/* Admin Details */}
      <Card sx={{ padding: 2, marginBottom: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {user.email} &nbsp;&nbsp; 
            <strong>City:</strong> {user.city || "Not Provided"}
          </Typography>
        </CardContent>
      </Card>

      {/* Add Event Button */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setShowForm(!showForm)}
        sx={{ marginBottom: 3 }}
      >
        + Add New Event
      </Button>

      {/* Add Event Form */}
      {showForm && <AddEventForm />}
    </Container>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, CircularProgress } from '@mui/material';
import EventCard from '../components/EventCard';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const userCity = user?.user?.city;
    const token = user?.token;
    const userRole = user?.userRole
    const userId = user.user.id

    useEffect(() => {
        if (!userCity || !token) {
            setError("User not authenticated");
            setLoading(false);
            return;
        }

        const fetchEvents = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`http://localhost:5000/api/events?city=${userCity}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEvents(data);
                setError(null);
            } catch (error) {
                console.error("Error fetching events:", error.response?.data || error.message);
                setError(error.response?.data?.message || "Failed to fetch events");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [userCity, token]); // Dependencies to avoid unnecessary re-renders

    const handleDeleteEvent = (eventId) => {
        setEvents(events.filter(event => event._id !== eventId));
    };

    return (
        <Container sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Events in Your City
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : events.length === 0 ? (
                <Typography>No events found for your city.</Typography>
            ) : (
                events.map(event => (
                    <EventCard key={event._id} event={event} userRole={userRole} userId={userId} onDelete={handleDeleteEvent} />
                ))
            )}
        </Container>
    );
};

export default Events;

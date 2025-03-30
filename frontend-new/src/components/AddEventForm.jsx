import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import API from '../api/api';

const AddEventForm = () => {
    const [eventData, setEventData] = useState({
        title: '',
        date: '',
        description: '',
        adminId: '',
        city: ''
    });

    const [error, setError] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.user) {
            setEventData(prev => ({
                ...prev,
                adminId: user.user._id,  // Set admin ID
                city: user.user.city     // Auto-set city from admin info
            }));
        }
    }, []);

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/events', eventData);
            alert('Event added successfully!');
            setEventData(prev => ({
                ...prev,
                title: '',
                date: '',
                description: ''
            }));
        } catch (err) {
            setError('Error adding event. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "#f9f9f9" }}>
            <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
                Add New Event
            </Typography>

            {error && (
                <Typography color="error" textAlign="center" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <TextField
                    label="Title"
                    name="title"
                    value={eventData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                />

                <TextField
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    label="Description"
                    name="description"
                    value={eventData.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    required
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, py: 1.5, fontSize: "1rem" }}
                >
                    Add Event
                </Button>
            </form>
        </Container>

    );
};

export default AddEventForm;

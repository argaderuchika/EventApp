import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';
import { login } from '../api/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await login({ email, password });
    
            if (!response.data || !response.data.token) {
                throw new Error("Token not received");
            }
    
            const { token, userRole } = response.data; // Get isAdmin flag
    
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            console.log("Extracted User Role:", userRole);

            // Redirect based on isAdmin flag
            navigate(userRole === 'admin' ? '/dashboard' : '/events');
        } catch (err) {
            console.error("Login Error:", err.response ? err.response.data : err.message);
            setError('Invalid email or password');
        }
    };
    
    
    

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>Login</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </form>
        </Container>
    );
};

export default Login;

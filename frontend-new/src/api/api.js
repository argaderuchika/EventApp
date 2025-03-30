import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
    const user = localStorage.getItem('user');
    if (user) {
        req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
    } else {
        console.log("No token found in localStorage");
    }
    return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const getEvents = () => API.get('/events');
export const createEvent = (eventData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    return API.post('/events', eventData, {
        headers: {
            Authorization: `Bearer ${user?.token}`, // Ensure token is included
        }
    });
};
export const deleteEvent = (id) => API.delete(`/events/${id}`);

export default API;
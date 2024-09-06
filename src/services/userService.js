// services/userService.js
import axios from './axios';

export const register = async (username, password, phone) => {
    const response = await axios.post('/register', { username, password, phone });
    return response.data;
};

export const login = async (username, password) => {
    const response = await axios.post('/login', { username, password });
    return response.data;
};
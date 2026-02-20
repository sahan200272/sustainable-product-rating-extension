import axios from "axios";

// Base URL for the backend API
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Response from the API
 */
export const registerUser = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/api/users/register`, userData);
    return response.data;
};

/**
 * Login a user
 * @param {Object} credentials - User login credentials (email, password)
 * @returns {Promise} Response from the API with token
 */
export const loginUser = async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/api/users/login`, credentials);
    
    // Store token in localStorage if login is successful
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response.data;
};

/**
 * Get current user data
 * @returns {Promise} User data
 */
export const getUser = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/api/users/getUser`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

/**
 * Logout user
 */
export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a token
 */
export const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
};

/**
 * Get stored user from localStorage
 * @returns {Object|null} User object or null
 */
export const getStoredUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

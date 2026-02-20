import api from "./api";

/**
 * Register a new user.
 * @param {Object} userData - User registration data.
 * @returns {Promise} Response from the API.
 */
export const registerUser = async (userData) => {
    const response = await api.post("/api/users/register", userData);
    return response.data;
};

/**
 * Login a user.
 * Token storage is handled by AuthContext (not here) to keep the service layer pure.
 * @param {Object} credentials - { email, password }
 * @returns {Promise} Response from the API — contains { user, token }.
 */
export const loginUser = async (credentials) => {
    const response = await api.post("/api/users/login", credentials);
    return response.data;
};

/**
 * Get the current authenticated user's data.
 * The auth token is automatically attached by the api.js interceptor.
 * @returns {Promise} User data.
 */
export const getUser = async () => {
    const response = await api.get("/api/users/getUser");
    return response.data;
};

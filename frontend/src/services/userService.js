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

/**
 * Semantic alias via the /api/users/me REST route.
 * Prefer this in components that display the logged-in user's profile.
 * @returns {Promise} User data.
 */
export const getMe = async () => {
    const response = await api.get("/api/users/me");
    return response.data;
};


/**
 * Login a user via Google.
 * Token storage is handled by AuthContext.
 * @param {string} credential - The Google JWT credential (ID Token)
 * @returns {Promise} Response from the API — contains { user, token }.
 */
export const googleLogin = async (credential) => {
    const response = await api.post("/api/users/google-login", { accessToken: credential });
    return response.data;
};

/**
 * Update the logged-in user's own profile fields.
 * Only whitelisted fields are sent; the backend ignores the rest.
 * @param {{ firstName?, lastName?, phone?, address?, profilePicture? }} payload
 * @returns {Promise} Response from API — contains { message, user }
 */
export const updateProfile = async (payload) => {
    const response = await api.patch("/api/users/me", payload);
    return response.data;
};


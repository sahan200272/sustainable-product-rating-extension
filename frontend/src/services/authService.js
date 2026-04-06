import api from "./api";

/**
 * Send an OTP to the authenticated user's email.
 * Reuses the existing /api/users/send-otp endpoint.
 * @returns {Promise} Response from the API.
 */
export const sendOtp = async () => {
    const response = await api.post("/api/users/send-otp");
    return response.data;
};

/**
 * Verify an OTP code for the authenticated user.
 * Reuses the existing /api/users/verify-otp endpoint.
 * @param {string|number} code - 6-digit OTP code
 * @returns {Promise} Response from the API.
 */
export const verifyOtp = async (code) => {
    const response = await api.post("/api/users/verify-otp", { code });
    return response.data;
};

// Centralised access to all environment variables.
// Import from here rather than using import.meta.env directly in components or services.

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

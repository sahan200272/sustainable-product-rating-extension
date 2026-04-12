// Centralised access to all environment variables.
// Import from here rather than using import.meta.env directly in components or services.

import greenvyLogo from '../assets/icons/app_logo.png';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Brand assets - High-quality logo with retina support and optimizations
export const GREENVY_LOGO_URL = greenvyLogo;
export const GREENVY_LOGO_ALT = "Greenvy Sustainable Shopping Logo";

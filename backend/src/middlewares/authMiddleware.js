import jwt from 'jsonwebtoken';

// Verify JWT token and attach user to request
export function authenticate(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
        
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next(); // Continue to next middleware/controller
        
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

// Check if user is Admin
export function isAdmin(req, res, next) {
    if (req.user && req.user.role === "Admin") {
        next();
    } else {
        return res.status(403).json({ error: "Admin access required" });
    }
}

// Check if user is Customer
export function isCustomer(req, res, next) {
    if (req.user && req.user.role === "Customer") {
        next();
    } else {
        return res.status(403).json({ error: "Customer access required" });
    }
}
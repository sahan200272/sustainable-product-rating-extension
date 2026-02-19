import * as userService from '../services/userService.js';
import jwt from 'jsonwebtoken';

// Controller function to register a new user
export async function registerUser(req, res) {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ 
                error: "All fields are required" 
            });
        }

        // Call service
        const user = await userService.registerUser(req.body);

        res.status(201).json({ 
            message: "User registered successfully",
            user
        });

    } catch (error) {
        console.error("Registration error:", error);
        
        if (error.message === 'User already exists') {
            return res.status(409).json({ error: error.message });
        }
        
        res.status(500).json({ 
            error: "User registration failed"
        });
    }
}

// Controller function to login a user
export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ 
                error: "Email and password are required" 
            });
        }

        // Call service to authenticate user
        const user = await userService.loginUser(req.body);

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                phone: user.phone,
                emailVerified: user.emailVerified
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login Successful!",
            token: token,
            user: user
        });

    } catch (error) {
        console.error("Login error:", error);

        if (error.message === 'User not found') {
            return res.status(404).json({ error: "User not found" });
        }

        if (error.message === 'Account is blocked') {
            return res.status(403).json({ 
                error: "Your Account is blocked. Please contact support." 
            });
        }

        if (error.message === 'Invalid credentials') {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.status(500).json({ 
            error: "Login failed"
        });
    }
}

// Controller function to get logged-in user's own data
export async function getUser(req, res) {
    try {
        // req.user is guaranteed to exist because of authenticate middleware
        const user = await userService.getUserByEmail(req.user.email);

        res.status(200).json(user);

    } catch (error) {
        console.error("Get user error:", error);

        if (error.message === 'User not found') {
            return res.status(404).json({ 
                error: "User not found" 
            });
        }

        res.status(500).json({ 
            error: "Failed to retrieve user data" 
        });
    }
}

// Controller function for admin to get any user by email
export async function getUserByEmailAdmin(req, res) {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({ 
                error: "Email is required" 
            });
        }

        // Call service to get user
        const user = await userService.getUserByEmail(email);

        res.status(200).json(user);

    } catch (error) {
        console.error("Get user by email error:", error);

        if (error.message === 'User not found') {
            return res.status(404).json({ 
                error: "User not found" 
            });
        }

        res.status(500).json({ 
            error: "Failed to retrieve user data" 
        });
    }
}

// Controller function to get all users (Admin only)
export async function getAllUsers(req, res) {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);

    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ 
            error: "Failed to retrieve users" 
        });
    }
}


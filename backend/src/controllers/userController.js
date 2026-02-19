import * as userService from '../services/userService.js';

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
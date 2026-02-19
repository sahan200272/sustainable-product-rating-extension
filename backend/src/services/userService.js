import User from '../models/user.js';
import bcrypt from 'bcrypt';

// Service function to register a new user
export async function registerUser(userData) {
    const { email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new User({
        ...userData,
        password: hashedPassword
    });

    await newUser.save();

    // Return user without password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return userResponse;
}

// Service function to login a user
export async function loginUser(credentials) {
    const { email, password } = credentials;

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
        throw new Error('User not found');
    }

    // Check if account is blocked
    if (user.isBlocked) {
        throw new Error('Account is blocked');
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (!isPasswordCorrect) {
        throw new Error('Invalid credentials');
    }

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
}

// Service function to get user by email
export async function getUserByEmail(email) {
    const user = await User.findOne({ email });
    
    if (!user) {
        throw new Error('User not found');
    }

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return userResponse;
}

// Service function to get all users
export async function getAllUsers() {
    const users = await User.find();
    
    // Return users without passwords
    const usersResponse = users.map(user => {
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    });
    
    return usersResponse;
}
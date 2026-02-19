import User from '../models/user.js';
import bcrypt from 'bcrypt';

export async function registerUser(userData) {
    const { email, password} = userData;

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
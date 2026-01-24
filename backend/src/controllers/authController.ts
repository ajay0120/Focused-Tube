import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import logger from '../utils/logger';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        logger.info(`User logged in: ${user.email}`);
        res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            interests: user.interests,
            disinterests: user.disinterests,
            age: user.age,
            onboardingCompleted: user.onboardingCompleted,
            token: generateToken(user._id.toString()),
        });
    } else {
        logger.warn(`Failed login attempt for email: ${email}`);
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    const { name, username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        logger.warn(`Registration failed: User already exists - ${email}`);
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        username,
        email,
        password,
    });

    if (user) {
        logger.info(`New user registered: ${user.email}`);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            interests: user.interests,
            disinterests: user.disinterests,
            age: user.age,
            onboardingCompleted: user.onboardingCompleted,
            token: generateToken(user._id.toString()),
        });
    } else {
        logger.error('Invalid user data during registration');
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: any, res: Response) => {
    const user = await User.findById(req.user._id);

    if (user) {
        logger.info(`User profile requested: ${user.email}`);
        res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            interests: user.interests,
            disinterests: user.disinterests,
            age: user.age,
            onboardingCompleted: user.onboardingCompleted,
        });
    } else {
        logger.error('User not found during profile request');
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: any, res: Response) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        user.interests = req.body.interests || user.interests;
        user.disinterests = req.body.disinterests || user.disinterests;
        user.age = req.body.age || user.age;
        if (req.body.onboardingCompleted !== undefined) {
             user.onboardingCompleted = req.body.onboardingCompleted;
        }

        const updatedUser = await user.save();
        logger.info(`User profile updated: ${updatedUser.email}`);

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            interests: updatedUser.interests,
            disinterests: updatedUser.disinterests,
            age: updatedUser.age,
            onboardingCompleted: updatedUser.onboardingCompleted,
            token: generateToken(updatedUser._id.toString()),
        });
    } else {
        logger.error('User not found during profile update');
        res.status(404).json({ message: 'User not found' });
    }
};
// @desc    Increment blocked content count
// @route   POST /api/users/blocked-count/increment
// @access  Private
export const incrementBlockedCount = async (req: any, res: Response) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.blockedCount = (user.blockedCount || 0) + 1;
        await user.save();
        res.status(200).json({ message: 'Blocked count updated', blockedCount: user.blockedCount });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

import { Request, Response } from 'express';
import User from "../models/User";
import logger from '../utils/logger';
import generateToken from '../utils/generateToken';

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
            distractionsBlocked: user.distractionsBlocked,
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
        user.distractionsBlocked = (user.distractionsBlocked || 0) + 1;
        await user.save();
        res.status(200).json({ message: 'Blocked count updated', blockedCount: user.distractionsBlocked });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
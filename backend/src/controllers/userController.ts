import { Request, Response } from 'express';
import User from "../models/User";
import logger from '../utils/logger';
import generateToken from '../utils/generateToken';
import {
  getNormalizedEmail,
  getOptionalBoolean,
  getOptionalNumber,
  getOptionalTrimmedString,
  getStringArray,
} from '../utils/requestSanitizer';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: any, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    logger.info('User profile requested', { userId: user._id.toString(), email: user.email });
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      mode: user.mode,
      interests: user.interests,
      disinterests: user.disinterests,
      age: user.age,
      onboardingCompleted: user.onboardingCompleted,
      distractionsBlocked: user.distractionsBlocked,
    });
  } else {
    logger.warn('User not found during profile request', { userId: req.user?._id?.toString() });
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: any, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const name = getOptionalTrimmedString(req.body.name);
    const username = getOptionalTrimmedString(req.body.username);
    const email = req.body.email === undefined ? undefined : getNormalizedEmail(req.body.email);
    const password = getOptionalTrimmedString(req.body.password);
    const interests = req.body.interests === undefined ? undefined : getStringArray(req.body.interests);
    const disinterests =
      req.body.disinterests === undefined ? undefined : getStringArray(req.body.disinterests);
    const age = getOptionalNumber(req.body.age);
    const onboardingCompleted = getOptionalBoolean(req.body.onboardingCompleted);

    if (req.body.name !== undefined && !name) {
      res.status(400).json({ message: 'Name must be a non-empty string' });
      return;
    }

    if (req.body.username !== undefined && !username) {
      res.status(400).json({ message: 'Username must be a non-empty string' });
      return;
    }

    if (req.body.email !== undefined && !email) {
      res.status(400).json({ message: 'Email must be a non-empty string' });
      return;
    }

    if (req.body.password !== undefined && !password) {
      res.status(400).json({ message: 'Password must be a non-empty string' });
      return;
    }

    if (req.body.mode !== undefined && req.body.mode !== 'study' && req.body.mode !== 'relax') {
      res.status(400).json({ message: 'Mode must be either study or relax' });
      return;
    }

    if (req.body.interests !== undefined && interests === null) {
      res.status(400).json({ message: 'Interests must be an array of strings' });
      return;
    }

    if (req.body.disinterests !== undefined && disinterests === null) {
      res.status(400).json({ message: 'Disinterests must be an array of strings' });
      return;
    }

    if (age === null) {
      res.status(400).json({ message: 'Age must be a valid number' });
      return;
    }

    if (onboardingCompleted === null) {
      res.status(400).json({ message: 'onboardingCompleted must be a boolean' });
      return;
    }

    if (name) {
      user.name = name;
    }
    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      user.password = password;
    }
    if (req.body.mode !== undefined) {
      user.mode = req.body.mode;
    }
    if (interests) {
      user.interests = interests;
    }
    if (disinterests) {
      user.disinterests = disinterests;
    }
    if (age !== undefined) {
      user.age = age;
    }
    if (onboardingCompleted !== undefined) {
      user.onboardingCompleted = onboardingCompleted;
    }

    const updatedUser = await user.save();
    logger.info('User profile updated', {
      userId: updatedUser._id.toString(),
      email: updatedUser.email,
      updatedFields: Object.keys(req.body),
    });

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      mode: updatedUser.mode,
      interests: updatedUser.interests,
      disinterests: updatedUser.disinterests,
      age: updatedUser.age,
      onboardingCompleted: updatedUser.onboardingCompleted,
      distractionsBlocked: updatedUser.distractionsBlocked,
      token: generateToken(updatedUser._id.toString()),
    });
  } else {
    logger.warn('User not found during profile update', { userId: req.user?._id?.toString() });
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
    logger.info('Blocked content count incremented', {
      userId: user._id.toString(),
      blockedCount: user.distractionsBlocked,
    });
    res.status(200).json({ message: 'Blocked count updated', blockedCount: user.distractionsBlocked });
  } else {
    logger.warn('User not found during blocked count increment', { userId: req.user?._id?.toString() });
    res.status(404).json({ message: 'User not found' });
  }
};

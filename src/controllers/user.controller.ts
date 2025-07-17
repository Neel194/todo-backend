import { Request, Response } from 'express';
import User from '../models/user.model';
import { createUserScehma } from '../validations/user.validation';
import { zodErrorFormatter } from '../utils/zodErrorFormatter';

// get all users
export const getAllUsers = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // fetch all user
        const users = await User.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            users, // if empty then return [] otherwise return all user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong while fetching user',
        });
    }
};

// create user controller
export const createUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    // validate input using zod
    const parsed = createUserScehma.safeParse(req.body);

    if (!parsed.success) {
        const formattedErrors = zodErrorFormatter(parsed.error.issues);

        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors,
        });
    }
    try {
        const { name, email, password, role } = req.body;

        // check if email already exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({
                error: 'User already exists with this email',
            });
            return;
        }

        // create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user',
        });

        // send success response
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// delete user by id
export const deleteUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'user not found',
            });
            return;
        }

        // delete user if found
        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong while deleting user',
        });
    }
};

// update user by id
export const updateUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        // update allowed fields from req.body
        const updatedFields = req.body;

        // update user
        const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
            new: true, // return the updated document
            runValidators: true, // apply mongoose validations
        });

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong while updating user',
        });
    }
};

import { Request, Response } from 'express';
import User from '../models/user.model';
import { createUserScehma } from '../validations/user.validation';

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
        // validation fails, send error with details
        res.status(400).json({ error: parsed.error.issues });
        return;
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

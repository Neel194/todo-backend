import { Request, Response } from 'express';
import User from '../models/user.model';
import { createUserScehma } from '../validations/user.validation';
import { zodErrorFormatter } from '../utils/zodErrorFormatter';
import { sendResponse } from '../utils/sendResponse';

// get all users
export const getAllUsers = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // fetch all user
        const users = await User.find().sort({ createdAt: -1 });

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Users fetched successfully',
            data: users,
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
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

        sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Validation failed',
            errors: formattedErrors,
        });
        return;
    }

    try {
        const { name, email, password, role } = req.body;

        // check if email already exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            sendResponse(res, {
                statusCode: 409,
                success: false,
                message: 'User already exists with this email',
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
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'User created successfully',
            data: user,
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: 'Internal server error',
        });
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
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: 'User not found',
            });
            return;
        }

        // delete user if found
        await user.deleteOne();

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
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
            sendResponse(res, {
                statusCode: 404,
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

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'User updated successfully',
            data: updatedUser,
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: 'Something went wrong while updating user',
        });
    }
};

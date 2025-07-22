import { Request, Response } from 'express';
import User from '../models/user.model';
import { createUserScehma } from '../validations/user.validation';
import { zodErrorFormatter } from '../utils/zodErrorFormatter';
import { sendResponse } from '../utils/sendResponse';
import {
    createUserService,
    getAllUserService,
    deleteUserService,
    updateUserService,
} from '../services/user.service';
import { catchAsync } from '../utils/catchAsync';

// ✅ Get all users
export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await getAllUserService();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Users fetched successfully',
        data: users,
    });
});

// ✅ Create user
export const createUser = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    const user = await createUserService({ name, email, password, role });

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'User created successfully',
        data: user,
    });
});

// ✅ Delete user
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await deleteUserService(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
    });
});

// ✅ Update user
export const updateUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const updatedUser = await updateUserService(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
    });
});

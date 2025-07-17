import { Response } from 'express';

// reusable response utility

export const sendResponse = <T>(
    res: Response,
    {
        statusCode,
        success,
        message,
        data,
        errors,
    }: {
        statusCode: number;
        success: boolean;
        message: string;
        data?: T | null;
        errors?: unknown;
    }
) => {
    res.status(statusCode).json({
        success,
        message,
        data: data ?? null,
        errors: errors ?? null,
    });
};

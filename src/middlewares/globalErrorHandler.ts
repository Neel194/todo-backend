import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { zodErrorFormatter } from '../utils/zodErrorFormatter';
import { sendResponse } from '../utils/sendResponse';

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // handle Zod validation error
    if (err instanceof ZodError) {
        const formattedErrors = zodErrorFormatter(err.issues);

        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Validation error',
            errors: formattedErrors,
        });
    }

    // handle all other errors
    return sendResponse(res, {
        statusCode: err.statusCode || 500,
        success: false,
        message: err.message || 'Internal Server Error',
    });
};

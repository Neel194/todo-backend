import { NextFunction, Request, Response } from 'express';
import { ZodType, ZodError } from 'zod';
import { zodErrorFormatter } from '../utils/zodErrorFormatter';
import { sendResponse } from '../utils/sendResponse';

export const validateRequest = (schema: ZodType<any, any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body); // throws error if invalid
            next(); // ✅ valid → continue to controller
        } catch (error) {
            const formattedErrors =
                error instanceof ZodError
                    ? zodErrorFormatter(error.issues)
                    : [{ message: 'Invalid data format' }];

            sendResponse(res, {
                statusCode: 400,
                success: false,
                message: 'Validation failed',
                errors: formattedErrors,
            });
        }
    };
};

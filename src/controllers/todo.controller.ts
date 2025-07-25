import { Request, Response } from 'express';
import {
    CreateTodoInput,
    createTodoSchema,
} from '../validations/todo.validation';
import { zodErrorFormatter } from '../utils/zodErrorFormatter';
import { sendResponse } from '../utils/sendResponse';
import Todo from '../models/todo.model';
import { catchAsync } from '../utils/catchAsync';

// create todo
export const createTodo = catchAsync(async (req: Request, res: Response) => {
    // validate input using Zod
    const parsed = createTodoSchema.safeParse(req.body);

    if (!parsed.success) {
        const formattedErrors = zodErrorFormatter(parsed.error.issues);

        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Validation failed',
            errors: formattedErrors,
        });
    }

    const todoData: CreateTodoInput = parsed.data;

    // create and save todo
    const todo = await Todo.create(todoData);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Todo created successfully',
        data: todo,
    });
});

// get all todos
export const getAllTodos = catchAsync(async (req: Request, res: Response) => {
    const todos = await Todo.find().sort({ createdAt: -1 });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All todos fetched successfully',
        data: todos,
    });
});

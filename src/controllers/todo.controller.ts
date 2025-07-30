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

// update todo
export const updateTodo = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    // check if todo exists
    const existingTodo = await Todo.findById(id);
    if (!existingTodo) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: 'Todo not found',
        });
    }

    // update fields
    const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, {
        new: true, // return updated doc
        runValidators: true, // ensure schema rules apply
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Todo updated successfully',
        data: updatedTodo,
    });
});

// delete todo
export const deleteTodo = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const todo = await Todo.findById(id);
    if (!todo) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: 'Todo not found',
        });
    }

    await todo.deleteOne();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Todo deleted successfully',
    });
});

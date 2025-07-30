import express from 'express';
import {
    createTodo,
    deleteTodo,
    getAllTodos,
    updateTodo,
} from '../controllers/todo.controller';

const router = express.Router();

// GET /api/todos → fetch all
router.get('/', getAllTodos);

// POST /api/todos → create new todo
router.post('/', createTodo);

// PATCH /api/todos/:id
router.patch('/:id', updateTodo);

// DELETE /api/todos/:id
router.delete('/:id', deleteTodo);
export default router;

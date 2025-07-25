import express from 'express';
import { createTodo, getAllTodos } from '../controllers/todo.controller';

const router = express.Router();

// GET /api/todos → fetch all
router.get('/', getAllTodos);

// POST /api/todos → create new todo
router.post('/', createTodo);

export default router;

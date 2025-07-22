import express from 'express';
import {
    createUser,
    deleteUser,
    getAllUsers,
    updateUser,
} from '../controllers/user.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { createUserScehma } from '../validations/user.validation';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', validateRequest(createUserScehma), createUser); // apply validation
router.delete('/:id', deleteUser);
router.patch('/:id', updateUser);

export default router;

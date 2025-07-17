import express from 'express';
import {
    createUser,
    deleteUser,
    getAllUsers,
    updateUser,
} from '../controllers/user.controller';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.delete('/:id', deleteUser);
router.patch('/:id', updateUser);

export default router;

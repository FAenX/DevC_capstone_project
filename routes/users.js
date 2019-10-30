import express from 'express';
import userControllers from '../controllers/users';

const auth = require('../middleware/auth');

const router = express.Router();


// router.post('/signup', userControllers.signup);

router.get('/', userControllers.viewAllUsers);
router.post('/', userControllers.createUser);
router.get('/:id', userControllers.getUserById);
router.patch('/:id', userControllers.modifyUser);
router.delete('/:id', userControllers.deleteUser);


export default router;

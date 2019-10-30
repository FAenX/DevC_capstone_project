import express from 'express';
import userControllers from '../controllers/users';

const router = express.Router();


// router.post('/signup', userControllers.signup);

router.get('/', userControllers.viewAll);
router.post('/', userControllers.createUser);

export default router;

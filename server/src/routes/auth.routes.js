import {Router} from 'express';
import { getMe, login, logout, signup } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewere/protectRoute.js';

const router = Router();

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)

router.get('/me',protectRoute ,getMe); // protected Route

export default router;
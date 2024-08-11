import express from 'express'
const router = express.Router()
import { registerValidation, loginValidation } from '../validations/auth.js'
import dotenv from 'dotenv';
dotenv.config();

import * as AuthController from '../controllers/AuthController.js'
import verifyToken from '../middleware/auth.middleware.js';

router.post('/register', registerValidation, AuthController.register)
router.post('/login', loginValidation, AuthController.login)
router.get('/me', verifyToken, AuthController.me)

export default router;
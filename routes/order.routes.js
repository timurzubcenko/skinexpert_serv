import express from 'express'
const router = express.Router()
import dotenv from 'dotenv';
dotenv.config();
import verifyToken from '../middleware/auth.middleware.js';
import * as OrderController from '../controllers/OrderController.js'

router.post('/create', verifyToken, OrderController.create)

export default router;
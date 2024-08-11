import express from 'express'
const router = express.Router()
import dotenv from 'dotenv';
dotenv.config();
import verifyToken from '../middleware/admin.middleware.js';
import * as ServiceController from '../controllers/ServiceController.js'

router.post('/create', verifyToken, ServiceController.create)
router.get('/getall', ServiceController.getAll)
router.delete('/delete/:id', verifyToken, ServiceController.remove)

export default router
import express from 'express'
const router = express.Router()
import * as AdminController from '../controllers/AdminController.js'
import verifyToken from '../middleware/admin.middleware.js'

router.post('/register', AdminController.register)
router.post('/login', AdminController.login)
router.get('/me', verifyToken, AdminController.me)

export default router;
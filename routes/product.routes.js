import express from 'express'
const router = express.Router()
import dotenv from 'dotenv';
dotenv.config();
import verifyToken from '../middleware/auth.middleware.js';
import * as ProductsController from '../controllers/ProductsController.js'

router.post('/create', ProductsController.create)
router.get('/all', ProductsController.getAll)
router.delete('/delete/:id', ProductsController.remove)
router.get('/product/:id', ProductsController.getOne)
router.post('/addtocart', verifyToken, ProductsController.addToBag)
router.get('/cart', verifyToken, ProductsController.getBag)
router.delete('/cart/delete/:id', verifyToken, ProductsController.removeCartItem)
router.patch('/cart/change/increase/:id', verifyToken, ProductsController.increase)
router.patch('/cart/change/decrease/:id', verifyToken, ProductsController.decrease)

export default router;
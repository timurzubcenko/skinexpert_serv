import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'
import Admin from '../models/Admin.js';

const verifyToken = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer')) {
        try {
            token = req.headers['authorization'].split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decoded)

            req.user = await Admin.findById(decoded.userId).select('-password')
            next()
        }
        catch (error) {
            res.status(401).json({ message: 'Admin, не авторизован' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Неверный токен авторизации' });
    }
})

export default verifyToken
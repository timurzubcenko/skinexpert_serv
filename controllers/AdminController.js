import jwtToken from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv';
dotenv.config();

import Admin from '../models/Admin.js';

export const register = async (req, res) => {
    try {
        const { login, password, } = req.body

        const isUsed = await Admin.findOne({ login })

        if (isUsed) {
            return res.status(300).json({ msg: 'Admin already registered' })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = new Admin({
            login,
            password: hashedPassword,
        })

        await user.save()

        res.status(201).json({ msg: 'Admin successfully registered' })
    } catch (error) {
        console.error(error)
    }
}

export const login = async (req, res) => {
    try {
        const { login, password } = req.body

        const user = await Admin.findOne({ login })

        if (!user) {
            return res.status(400).json({ message: 'Такого login нет в базе' })
        }
        // console.log(password, user.password)
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Пароли не совпадают' })
        }

        const jwtSecret = process.env.JWT_SECRET

        const token = jwtToken.sign(
            { userId: user.id },
            jwtSecret,
            { expiresIn: '10h' }
        )

        res.json({ token, userId: user.id, login, })

    } catch (error) {
        console.error(error)
    }
}

export const me = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user._id)

        if (!admin) {
            return res.status(404).json({
                message: 'admin не найден'
            })
        }

        res.json(admin)
    } catch (error) {
        console.log(error)
        res.json({
            message: 'Нет доступа'
        })
    }
}
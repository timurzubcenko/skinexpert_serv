import User from '../models/User.js'
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
    try {

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const doc = new User({
            email: req.body.email,
            fullName: req.body.name,
            passwordHash
        })

        const user = await doc.save()

        const token = jwt.sign(
            {
                _id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30d'
            },
        )

        res.json({
            ...user._doc,
            token
        })

    } catch (error) {
        console.log(message)
        res.json({
            message: 'Не удалось зарегестрироваться'
        })
    }
}

export const login = async (req, res) => {
    try {

        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res.status(400).json({ message: 'Неверный логин или пароль' })
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

        res.json({ ...user._doc, token })

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось авторизоваться'
        })
    }
}

export const me = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        res.json(user)
    } catch (error) {
        console.log(error)
        res.json({
            message: 'Нет доступа'
        })
    }
}
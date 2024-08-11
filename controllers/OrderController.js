import dotenv from 'dotenv';
dotenv.config();
import Order from '../models/Order.js';

export const create = async (req, res) => {
    try {

        const doc = Order({
            email: req.user.email,

            name: req.user.fullName,

            surname: req.body.surname,
            number: req.body.phoneNumber,

            products: req.user.products,
            user: req.user._id,

            totalPrice: req.body.totalPrice,
            address: req.body.address,
            index: req.body.index,
        })

        const order = await doc.save()

        res.json(order)

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось создать order'
        })
    }
}
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/User.js';
import Product from '../models/Product.js';

export const create = async (req, res) => {
    try {

        const doc = new Product({
            title: req.body.title,
            desc: req.body.desc,
            img: req.body.img,
            price: req.body.price
        })

        const product = await doc.save()

        res.json(product)

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось создать product'
        })
    }
}

export const getAll = async (req, res) => {
    try {

        const products = await Product.find()

        res.json(products)

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось найти product'
        })
    }
}

export const remove = async (req, res) => {
    try {

        const productId = req.params.id
        const product = await Product.findByIdAndDelete(productId)
        res.json(product)

    } catch (error) {
        console.log(error)
    }
}

export const getOne = async (req, res) => {
    try {

        const productId = req.params.id
        Product.findOne({ _id: productId })
            .then((doc) => {
                res.json(doc)
            })
            .catch((err) => {
                console.log(err)
            })

    } catch (error) {
        console.log(error)
    }
}

export const addToBag = async (req, res) => {
    try {

        const userId = req.user._id
        const doc = req.body

        const userData = await User.findById(userId)

        await User.findByIdAndUpdate(userId, {
            products: [...userData.products, doc]
        })

        res.status(200).json({ message: 'Товар добавлен в корзину', doc })

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось добвать product в корзину'
        })
    }
}

export const getBag = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        res.json(user.products)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const removeCartItem = async (req, res) => {
    try {

        const productId = req.params.id
        const userId = req.user._id

        const user = await User.findById(userId)

        const newProducts = user.products.filter((product) => {
            return String(productId) !== String(product._id)
        })

        await User.findByIdAndUpdate(userId, { products: newProducts })

        res.status(200).json({ message: 'Товар удален из корзины' })

    } catch (error) {
        console.log(message)
        res.status(500).json({ error: 'Server error' });
    }
}

export const increase = async (req, res) => {
    try {

        const productId = req.params.id
        const userId = req.user._id

        const user = await User.findById(userId)
        const product = await Product.findById(productId)

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        const productIndex = user.products.findIndex(product => product._id == productId)

        if (productIndex === -1) {
            return res.status(404).json({ message: "Продукт не найден" });
        }

        user.products[productIndex].amount += 1
        user.products[productIndex].price = user.products[productIndex].amount * product.price

        await user.markModified('products');
        await user.save();

        res.status(200).json(user);

    } catch (error) {
        console.log(error)
    }
}

export const decrease = async (req, res) => {
    try {

        const productId = req.params.id
        const userId = req.user._id

        const user = await User.findById(userId)
        const product = await Product.findById(productId)

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        const productIndex = user.products.findIndex(product => product._id == productId)

        if (productIndex === -1) {
            return res.status(404).json({ message: "Продукт не найден" });
        }

        if (user.products[productIndex].amount > 1) {
            user.products[productIndex].amount -= 1
        }

        user.products[productIndex].price = user.products[productIndex].amount * product.price

        await user.markModified('products');
        await user.save();

        res.status(200).json(user);

    } catch (error) {
        console.log(error)
    }
}
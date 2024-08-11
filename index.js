import express from "express";
import connectDB from "./config/db.js"
import multer from "multer";
import cors from 'cors'

connectDB()
const app = express()
const PORT = 8000

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})
const upload = multer({ storage })

app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ extended: false }))
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
    res.send("Server listening on port 5000");
})

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

import products from './routes/product.routes.js'
app.use('/api/product', products)

import authUser from './routes/auth.routes.js'
app.use('/api/auth', authUser)

import auth from './routes/auth_admin.routes.js'
app.use('/api/authadmin', auth)

import order from './routes/order.routes.js'
app.use('/api/order', order)

import service from './routes/service.routes.js'
app.use('/api/service', service)

app.listen(PORT, () => { console.log('App listen on port: ' + PORT) })
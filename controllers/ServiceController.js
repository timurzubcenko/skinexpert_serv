import Service from "../models/Service.js";

export const create = async (req, res) => {
    try {

        const doc = Service({
            name: req.body.name,
            time: req.body.time,
            desc: req.body.desc,
            img: req.body.img,
            price: req.body.price
        })

        const service = await doc.save()

        res.json(service)

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось создать product'
        })
    }
}

export const getAll = async (req, res) => {
    try {

        const services = await Service.find()
        res.json(services)

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось найти процедуру'
        })
    }
}

export const remove = async (req, res) => {
    try {

        const serviceId = req.params.id

        const deletedService = await Service.findByIdAndDelete(serviceId)

        res.json(deletedService)

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось найти процедуру'
        })
    }
}
import Service from "../models/Service.js";

export const create = async (req, res) => {
    try {

        const doc = Service({
            name: req.body.name,
            time: req.body.time,
            desc: req.body.desc,
            img: req.body.img,
            price: req.body.price,
            courseProcedures: req.body.courseProcedures,
            coursePrice: req.body.coursePrice,
            position: req.body.position,
            isActive: req.body.isActive
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

        const services = await Service.find({ isActive: { $ne: false } })
            .sort({ position: 1, createdAt: 1, _id: 1 })
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

        const deletedService = await Service.findByIdAndUpdate(
            serviceId,
            { isActive: false },
            { new: true }
        )

        res.json(deletedService)

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось найти процедуру'
        })
    }
}

const Model = require("../models/Registration")

module.exports = {
    async register(req, res) {
        try {
            const { name, email, nik, phone, address } = req.body
            if (!name || !email || !nik || !phone || !address) {
                return res.status(400).send('Mohon lengkapi form dengan benar!')
            }

            const { status, messages } = await Model.register({ name, email, nik, phone, address })

            return res.status(status).send(messages)
        } catch (error) {
            console.error(error);
            return res.status(500).send('Terjadi kesalahan pada server')
        }
    },
    async get(req, res) {
        try {
            const { status, data, messages } = await Model.get()

            if (status !== 200) {
                return res.status(status).send(messages)
            }
            return res.status(status).json(data)
        } catch (error) {
            console.error(error);
            return res.status(500).send('Terjadi kesalahan pada server')
        }
    },

}
const Auth = require("../models/Auth")

module.exports = {
    async login(req, res) {
        try {
            const { username, password } = req.body

            const { status, data, messages } = await Auth.login({ username, password })

            if (status !== 200) {
                return res.status(status).send(messages)
            }

            req.session.user_id = data.user_id
            req.session.save()
            return res.status(status).send(messages)

        } catch (error) {
            console.error(error)
            return res.status(500).send('Terjadi kesalahan saat proses login!')
        }
    },
    logout(req, res) {
        req.session.destroy()
        return res.status(200).send('Logged out')
    },
}
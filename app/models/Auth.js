const asyncQuery = require('../helpers/asyncQuery')
const bcrypt = require('bcrypt')

module.exports = {
    async login({ username, password }) {
        try {
            if (username && password) {
                const users = await asyncQuery('SELECT * FROM users WHERE username = ?', [username])
                if (users.length === 0) {
                    return { status: 404, messages: 'Tidak dapat menemukan akun dengan username tersebut' }
                }

                const user = users[0]
                const match = await bcrypt.compare(password, user.password)

                if (match) {
                    return { status: 200, messages: 'Login sukses', data: { user_id: user.user_id } }
                } else {
                    return { status: 400, messages: 'Password tidak cocok' }
                }
            } else {
                const users = await asyncQuery('SELECT * FROM users WHERE username = ?', [username])
                if (users.length === 0) {
                    return { status: 400, messages: 'Tidak dapat menemukan akun dengan username tersebut' }
                }

                return { status: 202, messages: 'Username ditemukan' }
            }
        } catch (error) {
            console.error(error)
            return { status: 500, messages: 'Terjadi kesalahan saat proses login!' }
        }
    }
}
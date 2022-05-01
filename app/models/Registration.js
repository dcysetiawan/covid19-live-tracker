const asyncQuery = require('../helpers/asyncQuery');

module.exports = {
    async register(data) {
        try {
            const store = await asyncQuery('INSERT INTO registration SET ?', [data])
            if (store.affectedRows) {
                return { status: 200, messages: 'Terimakasih telah mendaftar :)' };
            }

            return { status: 400, messages: 'Terjadi kesalahan saat proses pendaftaran!' }

        } catch (error) {
            return { status: 400, messages: error.sqlMessage || 'Terjadi kesalahan saat proses pendaftaran!' }
        }
    },
    async get() {
        try {
            const data = await asyncQuery('SELECT * FROM registration')
            return { status: 200, data };
        } catch (error) {
            return { status: 400, messages: error.sqlMessage || 'Terjadi kesalahan saat proses pendaftaran!' }
        }
    }
}
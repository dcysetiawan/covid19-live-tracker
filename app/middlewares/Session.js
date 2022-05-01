const asyncQuery = require("../helpers/asyncQuery")

module.exports = async (req, res, next) => {
    if (req.session.user_id) {
        req.user_id = req.session.user_id

        const user = await asyncQuery('SELECT * FROM users WHERE user_id = ?', [req.session.user_id])
        if (user.length < 1) {
            return res.redirect('/staff/login')
        }

        req.user_data = user[0]
        return next()
    }

    return res.redirect('/staff/login')
}
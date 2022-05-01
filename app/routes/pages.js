const Session = require('../middlewares/Session')

module.exports = (app, router) => {
    app.get('/', (req, res) => {
        res.render('main', {
            title: 'Covid-19 Live Tracker',
            path: req.route.path
        })
    })

    app.get('/staff/login', (req, res) => {
        res.render('login', {
            title: 'Covid-19 Live Tracker | Staff Login',
            path: req.route.path
        })
    })

    app.get('/staff', [Session], (req, res) => {
        res.render('staff', {
            title: 'Covid-19 Live Tracker | Staff Dashboard',
            path: req.route.path,
            user_data: req.user_data
        })
    })
}
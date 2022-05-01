const { default: axios } = require('axios');
const APIMiddleware = require('../middlewares/API');
const Registration = require('../controllers/Registration');
const Auth = require('../controllers/Auth');

module.exports = (app, router) => {
    app.use('/api', router)

    router.get('/hospitals', async (req, res) => {
        const { status, data } = await axios.get('https://dekontaminasi.com/api/id/covid19/hospitals')
        res.status(status).json(data)
    })

    router.get('/data/update', async (req, res) => {
        const { status, data } = await axios.get('https://data.covid19.go.id/public/api/update.json')
        res.status(status).json(data)
    })

    router.get('/data/prov', async (req, res) => {
        const { status, data } = await axios.get('https://data.covid19.go.id/public/api/prov.json')
        res.status(status).json(data)
    })

    router.get('/data/vaksin', async (req, res) => {
        const { status, data } = await axios.get('https://vaksincovid19-api.vercel.app/api/vaksin')
        res.status(status).json(data)
    })

    router.post('/registration', Registration.register)


    // Staff API
    router.post('/staff/login', Auth.login)
    router.post('/logout', Auth.logout)

    router.get('/registration', [APIMiddleware], Registration.get)
}
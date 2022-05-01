const express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    app = express(),
    path = require('path'),
    moment = require('moment'),
    MySQLStore = require('express-mysql-session')(session),
    cors = require('cors');

app.use(cors())

// Save all secret to .env
require('dotenv').config({})

// Ejs here
app.set('views', path.join(__dirname, '/app/views'))
app.set('view engine', 'ejs')

// Trust first proxy
app.set('trust proxy', 1)

// Express session here
app.use(session({
    store: new MySQLStore({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        clearExpired: true,
        checkExpirationInterval: 600000,
        expiration: 2628000000,
        createDatabaseTable: true,
        connectionLimit: 1,
        endConnectionOnClose: true,
        charset: 'utf8mb4_bin',
        schema: {
            tableName: 'sessions',
            columnNames: {
                session_id: 'session_id',
                expires: 'expires',
                data: 'data'
            }
        }
    }),
    secret: 'mySecretKey',
    name: '_user',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        expires: new Date(1000 * 60 * 60 * 24 * 30),
        maxAge: 2628000000
    },
}))

// Cookie parser here
app.use(cookieParser())

// Body parser here
app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({ extended: false }))

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Import connection
require('./app/config/db')

// Pages routes
require('./app/routes/pages')(app, express.Router())

// API routes
require('./app/api')(app, express.Router())

// 404 fallback page
app.use((req, res, next) => {
    return res.status(404).render('fallback', { code: 404, message: 'Page Not Found' })
})

if (process.env.NODE_ENV == 'production') {
    // 500 fallback page
    app.use((err, req, res, next) => {
        return res.status(500).render('fallback', { code: 500, message: 'Internal Server Error' })
    })
}

// Listen to port
const port = process.env.PORT || 5000
const server = app.listen(port, async () => {
    console.log(`Server is running on port ${server.address().port}`)
})
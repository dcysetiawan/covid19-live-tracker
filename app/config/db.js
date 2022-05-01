// Import mysql package
const mysql = require("mysql");

// Create a connection to the database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Open the MySQL connection
connection.connect(error => {
    if (error) return console.error("Failed to connect to the database. " + error)
});

module.exports = connection;
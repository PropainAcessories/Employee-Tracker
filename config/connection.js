require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'employee_db',
    },
    console.log('Connected to Employee Database.')
);

module.exports = db;

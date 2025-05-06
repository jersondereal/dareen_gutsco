require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: {
        rejectUnauthorized: false
    },
    authPlugins: {
        mysql_native_password: () => () => Buffer.from([0])
    }
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed. Error details:', {
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState,
            sqlMessage: err.sqlMessage,
            message: err.message,
            stack: err.stack
        });
        return;
    }
    console.log('Connected to database successfully.');
});

// Handle connection errors
db.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Database connection was closed. Reconnecting...');
        db.connect();
    } else if (err.code === 'ECONNREFUSED') {
        console.error('Connection refused. Please check if the database server is running and accessible.');
    } else if (err.code === 'ETIMEDOUT') {
        console.error('Connection timed out. Please check your network connection and firewall settings.');
    } else {
        throw err;
    }
});

module.exports = db;
const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host: "sql211.infinityfree.com",
    user: "if0_38903994",
    password: "Rb2gnefCfN",
    database: "if0_38903994_dareen_gutsco",
    port: "3306",
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

module.exports = db;

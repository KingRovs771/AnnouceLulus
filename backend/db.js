// backend-kelulusan/db.js
const mysql = require('mysql2/promise');
const config = require('./config'); // Import konfigurasi pusat

const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    waitForConnections: true,
    connectionLimit: config.db.connectionLimit,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log(`Connected to MySQL database "${config.db.database}" pool in ${config.env} environment!`);
        connection.release(); // Lepaskan koneksi kembali ke pool
    })
    .catch(err => {
        console.error(`Error connecting to MySQL database in ${config.env} environment:`, err.message);
        console.error('Please ensure the MySQL server is running and the database specified in your .env file exists and is accessible.');
        process.exit(1); // Keluar dari aplikasi jika koneksi gagal
    });

module.exports = pool;
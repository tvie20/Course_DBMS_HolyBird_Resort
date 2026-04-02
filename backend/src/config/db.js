require('dotenv').config();
const sql = require('mssql');
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    port: parseInt(process.env.DB_PORT), // <--- THÊM DÒNG NÀY VÀO
    database: process.env.DB_NAME,
    options: {
        encrypt: true, 
        trustServerCertificate: true ,
        requestTimeout: 300000
    }
};

const connectDB = async () => {
    try {
        let pool = await sql.connect(config);
        return pool;
    } catch (err) {
        console.error("❌ Kết nối thất bại:", err);
        throw err;
    }
};

module.exports = { connectDB, sql };
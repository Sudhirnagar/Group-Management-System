// db.js
const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Sudhir@2003',  // correct password
    database: 'project',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function queryDatabase(queryString, params) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(queryString, params);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        return { status: 500 };
    } finally {
        if (connection) connection.release();
    }
}

module.exports = queryDatabase;

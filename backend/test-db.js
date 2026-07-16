const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('trying to connect with these values:');
  console.log('host:', process.env.DB_HOST);
  console.log('port:', process.env.DB_PORT);
  console.log('user:', process.env.DB_USER);
  console.log('database:', process.env.DB_NAME);
  console.log('ssl:', process.env.DB_SSL);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      connectTimeout: 20000
    });

    console.log('connected successfully!');
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('test query result:', rows);
    await connection.end();
  } catch (err) {
    console.log('connection failed with error:');
    console.log(err);
  }
}

testConnection();
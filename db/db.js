/**
 * Configuration for mySQL db
 */
const mysql = require ('mysql2/promise')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'ST0jac!ngh12!94',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

module.exports = pool;
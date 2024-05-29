const pool = require('../db/db');


/**
 * Check if tables: logs are created, if not create
 */
const createTableLogs = async () => {
   
  const createLogsTable = `
    CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    error VARCHAR(255) NOT NULL ,
    date date NOT NULL ,
    message VARCHAR(255) NOT NULL
    );
  `;

  const connection = await pool.getConnection();

    try {
        await connection.query(createLogsTable);
    } catch (error) {
        console.error('Error on creating the tables:', error);
    } finally {
        connection.release();
    }
};

/**
 * 
 * @param {String} error 
 * @param {*} date 
 * @param {String} message 
 * @returns 
 *  Insert new log in the db
 */
const insertLog = async (error, date, message) => {
  const connection = await pool.getConnection();
  try {
      const [result] = await connection.execute(
          'INSERT INTO logs (error, date, message) VALUES (?, ?, ?) ', 
          [error, date, message]
      );
      return result.insertId;
  } catch (error) {
      console.error('Error inserting the logs:', error);
  } finally {
      connection.release();
  }
};

module.exports = {
createTableLogs, 
insertLog
};
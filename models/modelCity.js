const pool = require('./../db/db');

/**
 * Check if db is created, if not create the DB
 */
const createDB = async () => {
  const createDB = `
  CREATE DATABASE IF NOT EXISTS italian_cities
  `;
  const connection = await pool.getConnection();
  try {
      await connection.query(createDB);
  } catch (error) {
      console.error('Error creating the Database:', error);
  } finally {
      connection.release();
  }
};

/**
 * Check if tables: regions, provinces anc cities are created, if not create
 */
const createTables = async () => {
  const useDB = `
    USE italian_cities;
    `;
   
  const createRegionsTable = `
    CREATE TABLE IF NOT EXISTS regions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      DESC_REGIONE VARCHAR(255) NOT NULL UNIQUE,
      COD_REGIONE VARCHAR(2) NOT NULL UNIQUE
    );
  `;

  const createProvincesTable = `
    CREATE TABLE IF NOT EXISTS provinces (
      id INT AUTO_INCREMENT PRIMARY KEY,
      SIGLA_PROVINCIA VARCHAR(2) NOT NULL UNIQUE,
      DENOMINAZIONE VARCHAR(255) NOT NULL,
      region_id INT,
      FOREIGN KEY (region_id) REFERENCES regions(id)
    );
  `;

  const createCitiesTable = `
    CREATE TABLE IF NOT EXISTS cities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      COD_COMUNE VARCHAR(255) NOT NULL UNIQUE,
      DENOMINAZIONE VARCHAR(255) NOT NULL,
      SEZIONE VARCHAR(255) NOT NULL,
      province_id INT,
      FOREIGN KEY (province_id) REFERENCES provinces(id)
    );
  `;

  const connection = await pool.getConnection();

    try {
        await connection.query(useDB);
        await connection.query(createRegionsTable);
        await connection.query(createProvincesTable);
        await connection.query(createCitiesTable);
    } catch (error) {
        console.error('Error on creating the tables:', error);
    } finally {
        connection.release();
    }
};

/**
 * 
 * @param {String} desc_region 
 * @param {String} cod_region 
 * @returns 
 * Method insert or update data to the regions table
 */
const insertOrUpdateRegion = async (desc_region, cod_region) => {
  const connection = await pool.getConnection();
  try {
      const [result] = await connection.execute(
          'INSERT INTO regions (DESC_REGIONE, COD_REGIONE) VALUES (?, ?) ON DUPLICATE KEY UPDATE DESC_REGIONE = VALUES(DESC_REGIONE)', 
          [desc_region, cod_region]
      );
      return result.insertId || (await connection.execute('SELECT id FROM regions WHERE DESC_REGIONE = ?', [desc_region]))[0][0].id;
  } catch (error) {
      console.error('Error inserting or update regions:', error);
  } finally {
      connection.release();
  }
};

/**
 * 
 * @param {String} sig_prrovinces 
 * @param {String} denomin 
 * @param {*} regionId 
 * @returns 
 * Method insert or update data in the provinces table
 */
const insertOrUpdateProvince = async (sig_prrovinces, denomin, regionId) => {
  const connection = await pool.getConnection();
  try {
      const [result] = await connection.execute(
          'INSERT INTO provinces (SIGLA_PROVINCIA, DENOMINAZIONE, region_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE DENOMINAZIONE = VALUES(DENOMINAZIONE)', 
          [sig_prrovinces, denomin, regionId]
      );
      return result.insertId || (await connection.execute('SELECT id FROM provinces WHERE DENOMINAZIONE = ?', [denomin]))[0][0].id;
  } catch (error) {
      console.error('Error inserting or update provinces:', error);
  } finally {
      connection.release();
  }
};

/**
 * 
 * @param {*} cities 
 * @param {*} provinceId 
 * Method to bulk insert or update in the cities table
 */
const bulkInsertOrUpdateCities = async (cities, provinceId) => {
  const connection = await pool.getConnection();
  try {
      const bulkValues = cities.COD_COMUNE.map((code, index) => [code, cities.DENOMINAZIONE[index], cities.SEZIONE[index], provinceId]);

      if (bulkValues.length > 0) {
          const placeholders = bulkValues.map(() => '(?, ?, ?, ?)').join(', ');
          const sql = `
              INSERT INTO cities (DENOMINAZIONE, COD_COMUNE, SEZIONE, province_id) 
              VALUES ${placeholders}
              ON DUPLICATE KEY UPDATE 
              DENOMINAZIONE = VALUES(DENOMINAZIONE), 
              COD_COMUNE = VALUES(COD_COMUNE),
              SEZIONE = VALUES(SEZIONE),
              province_id = VALUES(province_id)
          `;

          await connection.execute(sql, bulkValues.flat());
      }
  } catch (error) {
      console.error('Error bulk insert or update cities:', error);
  } finally {
      connection.release();
  }
};

const getCityData = async (req, res) => {
  const cityOrCode = (req.query.comune).toUpperCase();

  try {
    const [rows] = await pool.query(
      `SELECT r.DESC_REGIONE , p.SIGLA_PROVINCIA , p.DENOMINAZIONE , c.COD_COMUNE , c.DENOMINAZIONE , c.SEZIONE 
      FROM regions r
      JOIN provinces p ON  r.id= p.region_id 
      JOIN cities c ON p.id = c.province_id 
       WHERE c.COD_COMUNE LIKE ? OR c.DENOMINAZIONE LIKE ?`,
      [`%${cityOrCode}%`, `%${cityOrCode}%`]
    );

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createDB, 
  createTables,
  insertOrUpdateRegion,
  insertOrUpdateProvince,
  bulkInsertOrUpdateCities,
  getCityData
  };
const axios = require('axios');
const {
  createDB,
  createTables,
  insertOrUpdateRegion,
  insertOrUpdateProvince,
  bulkInsertOrUpdateCities
} = require('./../models/modelCity');
const {
    createTableLogs,
    insertLog
  } = require('./../models/modelLog');
const endpoints = require('./../configs/config');


/**
 * Method to insert or update the data inside the tables regions, provinces and cities
 */
const insertOrUpdateData = async () => {
  try {
    
    // From the endpoint get all the regions
    const regions = await axios.get(endpoints.getRegions);
    const region = regions.data
    console.log(`Number regions processed: ${region.DESC_REGIONE.length}`)

    for (let i = 0; i<region.DESC_REGIONE.length; i++){

        console.log(`Region processed: ${region.DESC_REGIONE[i]}`)
        // Insert one by one the region inside the DB
        const regionId = await insertOrUpdateRegion(region.DESC_REGIONE[i], region.COD_REGIONE[i])
        // Using the DESC_REGIONE we get the provincies inside the region
        const provinceResponse = await axios.get(endpoints.getProvinces(region.DESC_REGIONE[i]));
        
        const province = provinceResponse.data;
        console.log(`Number provinces processed: ${province.DENOMINAZIONE.length}`)
        
        for (let y = 0;y<province.DENOMINAZIONE.length; y++){

            console.log(`Province processed: ${province.SIGLA_PROVINCIA[y]}`)
            // Insert one by one the province inside the db
            const provinceId = await insertOrUpdateProvince(province.SIGLA_PROVINCIA[y],province.DENOMINAZIONE[y], regionId);
            // Using the SIGLA_PRIVINCIA we get the cities inside the province
            const citiesResponse = await axios.get(endpoints.getCities(province.SIGLA_PROVINCIA[y]));
            const city = citiesResponse.data;
            // Insert using the bulk all the cities
            console.log(`Number cities processed ${city.DENOMINAZIONE.length}`)

            // Add delay for cities
            const delay = 1000; //1 secondo dovrebbero bastare
            await new Promise(resolve => setTimeout(resolve, delay));

            await bulkInsertOrUpdateCities(city, provinceId);
        }

        // Add delay for provincies
        const provinceDelay = 2000; 
        await new Promise(resolve => setTimeout(resolve, provinceDelay));
        
    }
} catch (error) {
    console.error('Error during insert or updating the data:', error);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
    insertLog(error, formattedDate, "Error during insert or updating the data")
}
}


const citiesData = async () => {
    await createDB();
    await createTables();
    await createTableLogs();
    await insertOrUpdateData();
}

module.exports = { citiesData, insertOrUpdateData };
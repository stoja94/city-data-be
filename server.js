const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const { scheduleJob } = require('./jobs/jobCities');
const { citiesData } = require('./cities/city');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

/**
 * Env port or 5000
 */
const PORT = process.env.PORT || 5000;

async function initializeServer() {
  try {
    console.log('Initializing city data...');
    /**
     * Initialization of the db with the data 
     */
    await citiesData();
    console.log('City data initialized successfully.');
    
    /**
     * Initialization of cronjob to update the data
     */
    console.log('Scheduling job to update data...');
    scheduleJob(); 
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1); // Exit the process with failure
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

initializeServer();
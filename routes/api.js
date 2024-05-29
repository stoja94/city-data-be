const express = require('express');
const { getCityData } = require('./../models/modelCity');

const router = express.Router();

router.get('/search', getCityData);

module.exports = router;
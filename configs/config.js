/**
 * Central configurations
 */

const BASE_URL = 'https://wms.cartografia.agenziaentrate.gov.it/inspire/ajax/ajax.php';

/**
 * Functions to build the complete URLS
 */
const endpoints = {
    getRegions: `${BASE_URL}?op=getRegioni&tkn=undefined`,
    getProvinces: (region) => `${BASE_URL}?op=getProvince&reg=${region}`,
    getCities: (province) => `${BASE_URL}?op=getComuniSez&prov=${province}`,
};

module.exports = endpoints;
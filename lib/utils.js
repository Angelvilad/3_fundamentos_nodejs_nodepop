'use strict';

// Función que determina si la url desde la que se hizo la petición es la del API
module.exports.isAPI = function isAPI(req) {
    return req.originalUrl.indexOf('/apiv') === 0;
}

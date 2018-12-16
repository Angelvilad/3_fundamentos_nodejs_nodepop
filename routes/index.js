var express = require('express');
var router = express.Router();

var Anuncio = require('../models/Anuncio')

/**
 * GET /
 */
router.get('/', async (req, res, next) => {
  try{
    
    // Defino variables con los filtros por registros del documento, pasados en la querystring
    const nombre = req.query.nombre;
    const venta = req.query.venta;
    const precio = req.query.precio;
    const tags = req.query.tags;

    // Defino variables de opciones de listado, pasados en la querystring
    const limit = parseInt(req.query.limit) || 8;
    const skip = parseInt(req.query.skip);
    const sort = req. query.sort;
    const page = parseInt(req.query.page);

    // Defino filtro vacío
    const filtro = {};
    
    // Comprueba si hay nombre y lo añado a filtro
    if (nombre) {
      filtro.nombre = new RegExp('^' + req.query.nombre, "i"); //convierto nombre de la query a exp reg (que empiece por)
      //filtro.nombre = nombre;
    }

    // Comprueba si hay venta y lo añado a filtro
    if (venta) {
      filtro.venta = venta;
    }

    // Comprueba si hay precio. Si el valor es solo un numero, si es un rango de 2 num, si es un num + "-" o si es "-" + num
    if (precio) {
      let precioRango = precio.split('-');
      precioRango = precioRango.map(parseFloat);
      
      if (precioRango.length === 1) {
        filtro.precio = parseFloat(precioRango[0]);
      } else if (!isNaN(precioRango[0]) && !isNaN(precioRango[1])) {
        filtro.precio = {$gte: precioRango[0], $lte: precioRango[1]};
      } else if (!isNaN(precioRango[0])) {
        filtro.precio = {$gte: precioRango[0]}
      } else if (!isNaN(precioRango[1])) {
        filtro.precio = {$lte: precioRango[1]}
      }
    }

    // Compruebo si hay tags (uno o varios separados por espacios en la query) se convierte a array
    // y se busca en todos los documentos que incluya alguno de los valores del array en el registro tag 
    if (tags) {
      filtro.tags = {$in : tags.split(' ')};
    }
    
    const listaAnuncios = await Anuncio.listar(filtro, limit, skip, sort, page);
    
    res.render('index', {listaAnuncios: listaAnuncios});

  
  } catch (err) {
    next(err);
    return;
  }
});

module.exports = router;

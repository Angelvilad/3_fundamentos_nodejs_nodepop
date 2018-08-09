'use strict';

const express = require('express');
const router = express.Router();
const createError = require('http-errors');

const Anuncio = require('../../models/Anuncio');

/**
 * GET /
 * Devuelve array de objetos en formato JSON de los anuncios segun criterios en la query string
 * Estos criterios pueden ser filtros por:
 * -nombre: busca anuncios que comiencen por el texto especificado
 * -venta: busca anuncios de venta o compra, segun valor booleano especificado (true=venta,false=compra)
 * -precio: busca por precio, coincidencia exacta 1 solo valor (n), rango de precios (2 valores n-n),
 *  precio min (n-) o precio maximo (-n)
 * -tags: busca anuncios por lista de tags especificados, separados por un espacio
 * 
 * Se puede especificar el modo de obtener la lista (en orden, paginada, indicando que campos mostrar/omitir):
 * -skip: comienza a listar a partir del siguiente al valor especificado
 * -limit: numero de anuncios que se van a listar
 * -sort: ordena por criterio especificado en ascendente (descendente con el valor en negativo),
 *  por cualquiera de los registros del documento
 * -fields: muesta/omite los campos indicados
 * 
 */
router.get('/', async (req, res, next) => {
    try{

      // Defino variables con los filtros por registros del documento, pasados en la querystring
      const nombre = req.query.nombre;
      const venta = req.query.venta;
      const precio = req.query.precio;
      const tags = req.query.tags;
  
      // Defino variables de opciones de listado, pasados en la querystring
      const limit = parseInt(req.query.limit) || 2;
      const skip = parseInt(req.query.skip);
      const sort = req.query.sort;
      const fields = req.query.fields;
      const page = parseInt(req.query.page);
      
  
      // Defino filtro vacío
      const filtro = {};
      
      // Comprueba si hay nombre y lo añado a filtro
      if (nombre) {
        filtro.nombre = new RegExp('^' + req.query.nombre, "i"); //convierto nombre de la query a exp reg (que empiece por)
        //filtro.nombre = nombre;
        console.log(nombre);
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
      
      const listaAnuncios = await Anuncio.listar(filtro, limit, skip, sort, page, fields);
      
      res.json({succes: true, result: listaAnuncios});
  
    
    } catch (err) {
      next(err);
      return;
    }
  });

  /**
   * GET /TAGS
   * Devuelve array con los diferentes tags de los anuncios
   */
  router.get('/tags', async (req, res, next) => {
    try{
        const tags = await Anuncio.distinct('tags');
        res.json({ success: true, result: tags});
    } catch (err) {
        next(err);
        return;
    }
});

/**
 * GET /:id
 * Devuelve un anuncio indicado por parametreo identificador
 */
router.get('/:id', async (req,res,next) => {
    try {
        const _id = req.params.id;
        const anuncio = await Anuncio.findById(_id).exec();
        if (!anuncio) {
            next(createError(404));
            return;
        }

        res.json({ success: true, result: anuncio});

    } catch (err) {
        next(err);
        return;
    }
});

/**
 * POST /
 * Crea un anuncio en la coleccion
 */
router.post('/', async (req, res, next) => {
    try {
        const datosAnuncio = req.body;

        // crear anuncio en memoria
        const anuncio = new Anuncio(datosAnuncio);

        //guardarlo en la base de datos
        const anuncioGuardado = await anuncio.save();

        res.json({ succes: true, result: anuncioGuardado });

    } catch(err) {
        next(err);
        return;
    }
});

/**
 * DELETE /:id
 * Borra anuncio indicado por parametro indentificador
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const _id = req.params.id;
        await Anuncio.remove({ _id : _id }).exec();
        res.json({ result: true});

    } catch (err) {
        next(err);
        return;
    }
});

/**
 * PUT /:id
 * Actualiza anuncio indicado por parametro identificador, con los parametros establecidos en el body
 */
router.put('/:id', async (req, res, next) => {
    try {
        const _id = req.params.id;
        const datosAnuncio = req.body;

        const anuncioActualizado = await Anuncio.findByIdAndUpdate(_id, datosAnuncio, { new: true} ).exec();
        res.json({ succes: true, result: anuncioActualizado });
    } catch (err) {
        next(err);
        return;
    }
});

module.exports = router;
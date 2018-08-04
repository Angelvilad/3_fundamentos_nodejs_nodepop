'use strict';

const express = require('express');
const router = express.Router();

const Anuncio = require('../../models/Anuncio');

router.get('/', async (req, res, next) => {
    try {
        const listaAnuncios = await Anuncio.find().exec();
        res.send( { succes: true, result: listaAnuncios } );
    } catch (err) {
        next(err);
        return; 
    }
});

/*const anuncio = new Anuncio( {
    nombre: 'Angelito',
    edad: 39,
    venta: true,
    precio: 5000,
    foto: 'fotoguapa.jpg',
    tags: ['chulo', 'molon', 'esto va ok!!']
} );*/

/**
 * haciendo un save de un "documento" con callback
 */
/*anuncio.save((err, anuncioGuardado) => {
    console.log({ succes: true, result: anuncioGuardado});
})*/

/**
 * Haciendo un save de un "documento" con una promesa
 */
/*anuncio.save().then(function (anuncioGuardado){
    console.log({ succes: true, result: anuncioGuardado});
})*/

/**
 *  Haciendo un save de un "documento con async/await"
 */
/*async function guardaAnuncio() {
    const anuncioGuardado = await anuncio.save();
    console.log({ success: true, result: anuncioGuardado });
};

guardaAnuncio();*/

module.exports = router;
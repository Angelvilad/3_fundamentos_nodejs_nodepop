'use strict'

var mongoose = require('mongoose');

// definir un esquema
const anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String],
    urlFoto: String
});

// crear el modelo con ese esquema
const Anuncio = mongoose.model('Anuncio', anuncioSchema);


// crear un método estatico
anuncioSchema.statics.listar = function(filtro, limit, skip, fields, sort) {
    const query = Anuncio.find(filtro);// VOY POR AQUI
}

// y aunque no haga falta, lo exportamos
module.exports = Anuncio;
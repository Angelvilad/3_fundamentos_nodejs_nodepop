'use strict'

var mongoose = require('mongoose');

// definir un esquema
const anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    tags: [String],
    urlFoto: String,
    urlThumbnail: String
});

// crear un método estatico
anuncioSchema.statics.listar = function(filtro, limit, skip,sort,page, fields) {
    const query = Anuncio.find(filtro);
    query.limit(limit);
    if (page){
        query.skip(limit * page);
    } else {
        query.skip(skip);
    }
    query.sort(sort);
    query.select(fields);
    return query.exec(); //devolvemos promesa devuelta
}

// crear el modelo con ese esquema
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

// y aunque no haga falta, lo exportamos
module.exports = Anuncio;
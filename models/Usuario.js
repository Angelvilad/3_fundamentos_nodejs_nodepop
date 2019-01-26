'use strict';

const mongoose= require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = mongoose.Schema({
    name: { type: String, index: true },
    email: { type: String, unique: true, index: true },
    password: String
});

usuarioSchema.statics.hashPassword = function(plainPassword) {
    return bcrypt.hash(plainPassword, 10);
}

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;


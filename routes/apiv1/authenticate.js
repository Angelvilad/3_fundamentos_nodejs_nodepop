'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../../models/Usuario');

/**
 * POST /
 * Recibe email y password en el body de la petición para hacer auntentificación: devuelve token en caso de éxito o por el contrario un error
 */
router.post('/', async (req, res, next) => {
    try {
        // recoger parámetros del cuerpo de la petición
        const email = req.body.email;
        const password = req.body.password;

        // buscar el usuario
        const usuario = await Usuario.findOne({ email: email});

        if(!usuario || !await bcrypt.compare(password, usuario.password)) {
            const err = new Error('Invalid credentials');
            next(err);
            return;
        }

        // usuario encontrado y password ok
        // no meter instancias de mongoose en el token!
        jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, {
            expiresIn: '2d'
        }, (err, token) => {
            if (err) {
                next(err);
                return;
            }
            res.json({ succes: true, token: token});
        });
        
    } catch (err) {
        next(err);
        return;
    }
});

module.exports = router;
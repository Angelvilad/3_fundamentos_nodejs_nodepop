var express = require('express');
var router = express.Router();

var Anuncio = require('../models/Anuncio')

/* GET home page. */
router.get('/', async (req, res, next) => {
  try{

    const listaAnuncios = await Anuncio.find().exec();
    res.render('index', {listaAnuncios: listaAnuncios});

  } catch (err) {
    next(err);
    return;
  }
});

module.exports = router;

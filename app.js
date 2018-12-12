var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { isAPI } = require('./lib/utils'); //esto se pone asi porque como require devuelve un objeto, en este caso con una propiedad, directamente le asigno una variable, sino para referirme a la propiedad tendria que hacer isAPI.isAPi

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html'); //cambio template de la vista a html
app.engine('html', require('ejs').__express); //cambio template de la vista a html

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 *  Para servir ficheros estaticos
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Conectar a la base de datos y registrar los modelos
 */
require('./lib/connectMongoose');
require('./models/Anuncio');

/**
 *  Rutas de mi API
 */
app.use('/apiv1/authenticate', require('./routes/apiv1/authenticate'));
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));

/**
 * Configuramos y usamos multiidioma en express
 */
const i18n = require('./lib/i18nConfigure')();
app.use(i18n.init);

/**
 * rutas de mi aplicacion web
 */
app.use('/',      require('./routes/index'));
app.use('/lang',  require('./routes/lang'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  // Gestiona error de validación (no utilizado en este proyecto)
  if (err.array) {
    err.status = 422;
    const errorInfo = err.array({ onlyFirstError: true})[0];
    err.message = isAPI(req) ?
    { message: 'Not valid', errors: err.mapped() }
    : `Not valid - ${errorInfo.param} ${errorInfo.msg}`;
  }
    
  res.status(err.status || 500); //ponemos status de respuesta con la del error correspondiente o error 500

  if (isAPI(req)) {
    res.json({ succes: false, error: err.message});
    return;
  }
  
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

module.exports = app;

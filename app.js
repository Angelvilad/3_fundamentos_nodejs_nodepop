var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index'); Estas variables de ruta las crea express pero en el curso se hacen
//var usersRouter = require('./routes/users'); de otra manera.

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
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));

/**
 * rutas de mi aplicacion web
 */
app.use('/', require('./routes/index'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler OJO AQUI SE CAMBIA BASTANTE EN LAS CLASES !!!!!!!!!!!
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

'use strict';

const path = require('path');

const i18n = require('i18n');

module.exports = function() {
    i18n.configure({
        locales: ['en', 'es'],
        directory: path.join(__dirname, '..', 'locales'),
        defaultLocale: 'en', // locale por defecto (propiedad sólo para express)
        //autoReload: true, da problemas con nodemon??
        syncFiles: true,
        cookie: 'nodepop-lang' // indica que use el locale que indica la cookie
    });

    i18n.setLocale('en');// locale por defecto para scripts

    return i18n;
}
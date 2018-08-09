'use strict';

require('dotenv').config();
const readline = require('readline');

const conn = require('./lib/connectMongoose');
const Anuncio = require('./models/Anuncio');
const anuncios = require('./initial_data/anuncios.json').anuncios;

conn.once('open', async () => {
    try {
        const response = await askUser(`Estas seguro de borrar los contenidos de la base de datos ${conn.name}? (yes/no) - (y/n): `);
        
        if (response.toLowerCase() === 'yes' | response.toLowerCase() === 'y') {
            
            await initAnuncios(anuncios);

            conn.close();

        } else if (response.toLowerCase() === 'no' | response.toLowerCase() === 'n') {
            
            console.log('Proceso abortado por el usuario');
            process.exit();
        
        } else {
            
            console.log ('Las respuestas admitidas son: "yes", "y", "no", "n"');
            process.exit();
        }
    } catch (err) {
        console.log('Hubo un error', err);
    }
});

/**
 * Pregunta al usuario por consola y devuleve una promesa con la respuesta.
 * @param {*} question 
 */
function askUser(question) {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
           input: process.stdin,
           output: process.stdout 
        });

        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function initAnuncios(anuncios) {
    // elimina documentos actuales
        const deleted = await Anuncio.deleteMany();
        console.log(`Eliminados ${deleted.n} anuncios`);

    // carga nuevos documentos
       const inserted = await Anuncio.insertMany(anuncios);
       console.log(`Insertados ${inserted.length} anuncios`);
}
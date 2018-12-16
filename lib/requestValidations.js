'use strict'

module.exports.validityTags = function( valor ) {
    const tagsAllowed = ['lifestyle', 'work', 'motor', 'mobile'];
    const array = valor.split(',');

    array.forEach( tag => {
        const tagTrimmed = tag.trim();
        if( tagsAllowed.indexOf(tagTrimmed) === -1) {
            throw new Error('El campo Tags solo debe contener una o mas de las siguientes etiquetas (separadas por comas): lifestyle, work, motor,mobile');
        }
    })
    return true;
}
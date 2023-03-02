const fs = require("fs");
const {
  getLinks,
  isPathValid,
  isExtensionMd,
  getLinkStatus,
  isPathAbsolute,
  convertToAbsolute,
} = require('../src/functions.js');

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    // Identifica si la ruta existe
    if (fs.existsSync(path)) {
    } else {
      reject(new Error ('Path does not exist.'));
      return; // Sale de la función
    }
    const isPathAbsolute = convertToAbsolute(path);
    if (!isExtensionMd(isPathAbsolute)) {
      reject(new Error('The provided path does not have a .md extension.'));
      return;
    }
    getLinks(isPathAbsolute).then((arrayLinks) => { // Invoca la función getLinks con la ruta absoluta y devuelve una promesa
      if (arrayLinks.length === 0) { // Si el array de links obtenido es de longitud 0, significa que no hay links en el archivo
        reject(new Error('Path does not have links.')); // Rechaza la promesa con un error indicando que no hay links en el archivo
        return; 
      }
      if (options === { validate: false }) { // Si no pide validar, resuelve la promesa con el array de links obtenido
        resolve(arrayLinks);
        return; 
      }
      getLinkStatus(arrayLinks).then((response) => { // Si las opciones no son { validate: false }, invoca la función getLinkStatus con el array de links y devuelve una promesa
        resolve(response); // Resuelve la promesa con la respuesta obtenida
      });
    });
  
  });
  };

module.exports = {
  mdLinks
};
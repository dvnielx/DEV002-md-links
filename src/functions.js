const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Verifies if route exists
const isPathValid = (route) => fs.existsSync(route);

// Verifies if path is absolute
const isPathAbsolute = (absoluteRoute) => path.isAbsolute(absoluteRoute);

// Converts relative route into absolute
const convertToAbsolute = (route) => (isPathAbsolute(route) ? route : path.resolve(route));

// Looks if the extension of the route is .md 
const isExtensionMd = (route) => path.extname(route) === '.md';

// Function to get the links. It returns a promise.
const getLinks = (route) => new Promise((resolve, reject) => {
  if (!isPathValid(route)) {
    return reject(new Error('Path is invalid.'));
  }

  if (!isExtensionMd(route)) {
    return reject(new Error('File does not have .md extension'));
  }
  // if the route & extension are valid, an empty array is created. the links found will be saved there.
  const links = []; // it returns an array with the info the user wants to receive
  readFiles(route)
    .then((data) => {
      const urlLinks = /\[(.+?)\]\((https?:\/\/[^\s]+)\)/g; // busca y extrae los enlaces de hipertexto en un texto en formato md.
      let match = urlLinks.exec(data);
      while (match !== null) { // when a link is found, an object with these properties will be created
        links.push({
          href: match[2], // ruta a analizar o command line arguments adicionales 
          text: match[1], // ruta del archivo js que se está ejecutando
          file: route,
        });
        match = urlLinks.exec(data);  // objects found will be added to an array 
      }
      resolve(links);
    })
    .catch((error) => reject(error));
});

// Reads the file. This promise executes in cli.js
const readFiles = (route) => new Promise((resolve, reject) => {
  if (!isPathValid(route)) {
    reject(new Error('Path is invalid'));
  }
  fs.readFile(route, 'utf-8', (error, data) => { // codificación para leer el archivo como texto // callbacl
    if (error) {
      reject(error); // el cb comprueba si hay algún error durante la lectura del archivo. 
    } else {
      resolve(data);
    }
  });
});

const getLinkStatus = (urls) => Promise.all(urls.map((link) => axios.get(link.href)
  // utiliza la librería Axios para hacer una petición HTTP a cada una de las URLs que se le pasan como argumento
  // axios.get devuelve una promesa que resuelve a un objeto con información de la respuesta HTTP, incluyendo el status code

  .then((respuesta) => ({ ...link, status: respuesta.status, message: 'ok' })) // si es exitosa devuelve un objeto con estas propiedades


  .catch((error) => {
    let errorStatus;
    if (error.response) {
      errorStatus = error.response.status;
    } else if (error.request) {
      errorStatus = 500;
    } else {
      errorStatus = 400;
    }
    // console.log('errorStatus', errorStatus);
    return {...link, status: errorStatus, message: 'fail' };
  })));

// *Functions to obtain "unique" and "broken" links*

// Esta función recibe un array de objetos que representan los links encontrados en los archivos markdown
const linksStats = (array) => `${array.length}`;

// Esta función recibe el mismo array de objetos de la función anterior y utiliza un Set para eliminar los links duplicados. Retorna la cantidad de links únicos encontrados.
const uniqueLinks = (array) => {
  const unique = new Set(array.map((link) => link.href)); // crea un conjunto (Set) de valores únicos obtenidos al mapear y extraer la propiedad href de los objetos en el array.
  return `${unique.size}`;
};

// Esta función recibe el mismo array de objetos de la función anterior y filtra aquellos links que tienen un status de 'Fail' o que estén fuera del rango de 199 a 400. Retorna la cantidad de links rotos encontrados.
const brokenLinks = (array) => { // los códigos de estado HTTP entre 200 y 399 indican que una solicitud HTTP fue procesada correctamente y se recibió una respuesta satisfactoria del servidor
  const broken = array.filter((link) => link.status === 'Fail' || link.status > 400 || link.status < 199);
  return `${broken.length}`;
};

module.exports = {
  getLinks,
  readFiles,
  linksStats,
  uniqueLinks,
  brokenLinks,
  isPathValid,
  isExtensionMd,
  getLinkStatus,
  isPathAbsolute,
  convertToAbsolute,
};

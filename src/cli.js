#!/usr/bin/env nodo
const { mdLinks } = require('../src/index.js');
const { linksStats, uniqueLinks, brokenLinks } = require('../src/functions.js');

const route = process.argv[2];
const options = {
  // process.argv devuelve un array con todos los argumentos que se pasaron al script al momento de ser ejecutado
  validate: process.argv.includes('--validate') || process.argv.includes('--v'),
  stats: process.argv.includes('--stats') || process.argv.includes('--s'),
};

if (route === undefined) {
  console.log(`Welcome, you! 
  Please enter the path you want to analyze and add the following arguments if needed:                                                                   
   --validate: to validate all the links found, either if they work or not.
   --stats: to get basic statistics of each of the links found (total, unique & broken links).                                 
   --validate --stats: in order to obtain statistics that requiere to be validated.`)
};

if (
  (options.validate && options.stats) || (options.stats && options.validate)
) {
  mdLinks(route, options)
    .then((arrayLinks) => {
      console.log(
        `\n                                      
         Stats & links validation`
      );
      console.log(
        `\n
        ${'Total links:'} ${linksStats(arrayLinks)}`,
      );
      console.log(
        `\n
        ${'Unique links:'} ${uniqueLinks(arrayLinks)}`,
      );
      console.log(
        `\n
        ${'Broken links:'} ${brokenLinks(arrayLinks)}\n`,
      );
    })
    .catch((error) => {
      console.log(error);
    });
} else if (options.validate === true) {
  mdLinks(route, options)
    .then((arrayLinks) => {
      console.log(
        `\n                                      
      Links validation`
      );
      arrayLinks.forEach((link) => {
        console.log(`
        ${'href    :'} ${link.href} 
        ${'message :'} ${link.message} 
        ${'status  :'} ${link.status} 
        ${'text    :'} ${link.text}`);
      });
      
    })
    .catch((error) => {
      console.log(error);
    });
} else if (options.stats && !options.validate) {
  mdLinks(route, options)
    .then((arrayLinks) => {
      console.log(
        `\n                                      
       Links stats`,
      );
      console.log(
        `\n
      ${'Total links  :'} ${linksStats(arrayLinks)}`,
      );
      console.log(
        `\n
      ${'Unique links :'} ${uniqueLinks(arrayLinks)}\n`,
      );
    })
    .catch((error) => {
      console.log(error);
    });
} else if (!options.validate && !options.stats && route !== undefined) {
  mdLinks(route, options)
    .then((arrayLinks) => {
      console.log(
        `\n                                                     
       These links were found:`,
      );
      arrayLinks.forEach((link) => {
        console.log(`
      ${'href    :'} ${link.href} 
      ${'path    :'} ${link.file} 
      ${'text    :'} ${link.text}`);
      });
      console.log(
        `     
    After entering your path you can add the following to obtain more info: \n 
    ${'--validate :'
          } to validate all the links found, either if they work or not. \n
    ${'--stats    :'
          } to get basic statistics of each of the links found (total, unique & broken links). \n                                 
    ${'--validate --stats :'
          } in order to obtain statistics that requiere to be validated. \n`,
      );
    })
    .catch((error) => {
      console.log(error);
    });
};
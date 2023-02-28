#!/usr/bin/env nodo
const { mdLinks } = require('../src/index.js');
const { linksStats, uniqueLinks, brokenLinks } = require('../src/functions.js');

const route = process.argv[2];
const options = {
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


const { mdLinks } = require('../src/index.js');
const axios = require('axios');
const {
  readFiles,
  isPathValid,
  isExtensionMd,
  getLinkStatus,
  isPathAbsolute,
  convertToAbsolute,
} = require('../src/functions.js');

describe('mdLinks', () => {

  test('should reject with an error when the path does not exist', () => {
    const path = 'fake/path.md';
    return expect(mdLinks(path)).rejects.toThrow('Path does not exist.');
  });
  test('should reject with an error when the path does not have a .md extension', () => {
    const path = 'README.txt';
    return expect(mdLinks(path)).rejects.toThrow('The provided path does not have a .md extension.');
  });

  test('should reject with an error when the path does not have links', () => {
    const path = 'test/test_files/test.md';
    return expect(mdLinks(path)).rejects.toThrow('Path does not have links.');
  });
});

// Test for isPathValid function

describe('isPathValid', () => {
  it('should return true if path exists', () => {
    expect(isPathValid('../src/md_files/files_1/file1.md')).toBe(true);
    console.log(isPathValid)
  });

  it('should return false if path does not exist', () => {
    expect(isPathValid('./invalid/path')).toBe(false);
  });
});

// Test for isPathAbsolute function

describe('isPathAbsolute', () => {
  it('should return true if path is absolute', () => {
    expect(isPathAbsolute('/Users/username/Desktop/lab/file.md')).toBe(true);
  });

  it('should return false if path is not absolute', () => {
    expect(isPathAbsolute('../src/md_files/files_1/file1.md')).toBe(false);
  });
});

// Test for convertToAbsolute function

describe('convertToAbsolute', () => {
  const path = require('path');

    it('should return absolute path if input is already absolute', () => {
    expect(convertToAbsolute('/User/Documents/README.md')).toBe('/User/Documents/README.md');
  });

    it('should return absolute path if input is relative path', () => {
    expect(convertToAbsolute('README.md')).toBe(path.resolve('README.md'));
  });
});

describe('isExtensionMd', () => {
  const path = require('path');
  test('should return true for a .md file', () => {
    const filePath = path.join(__dirname, 'example.md');
    expect(isExtensionMd(filePath)).toBe(true);
  });

  test('should return false for a non-.md file', () => {
    const filePath = path.join(__dirname, 'example.txt');
    expect(isExtensionMd(filePath)).toBe(false);
  });
});

//  test for getLinkstatus function 

// Mock de la respuesta exitosa de axios
const mockAxiosResponseOk = Promise.resolve({
  status: 200
});

// Mock de la respuesta fallida de axios
const mockAxiosResponseFail = Promise.reject({
  response: {
    status: 500
  }
});

describe('getLinkStatus', () => {
  it('debe retornar el estado de la URL si la petición es exitosa', () => {
    const urls = [
      { href: 'https://www.google.com', text: 'Google' },
      { href: 'https://www.wikipedia.org', text: 'Wikipedia' }
    ];

    return getLinkStatus(urls)
      .then((results) => {
        expect(results).toEqual([
          { href: 'https://www.google.com', text: 'Google', status: 200, message: 'ok' },
          { href: 'https://www.wikipedia.org', text: 'Wikipedia', status: 200, message: 'ok' }
        ]);
      });
  });

  it('debe retornar el estado de la URL y mensaje fail si la petición falla', () => {
    const urls = [
      { href: 'https://www.google.com', text: 'Google' },
      { href: 'https://www.invalid-url.com', text: 'Invalid' }
    ];

    return getLinkStatus(urls)
      .then((results) => {
        expect(results).toEqual([
          { href: 'https://www.google.com', text: 'Google', status: 200, message: 'ok' },
          { href: 'https://www.invalid-url.com', text: 'Invalid', status: 500, message: 'fail' }
        ]);
      });
  });

  it('debe manejar errores en las URLs', (done) => {
    const urls = [
      { href: 'https://www.google.com', text: 'Google' },
      { href: 'invalid-url', text: 'Invalid' },
    ];
  
    getLinkStatus(urls)
      .then((results) => {
        expect(results).toEqual([
          { href: 'https://www.google.com', text: 'Google', status: 200, message: 'ok' },
          { href: 'invalid-url', text: 'Invalid', status: 500, message: 'fail' },
        ]);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
  
});
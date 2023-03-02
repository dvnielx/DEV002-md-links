const { mdLinks } = require('../src/index.js');
const {
  getLinks,
  getFiles,
  readFiles,
  isPathValid,
  isExtensionMd,
  getLinkStatus,
  isPathAbsolute,
  convertToAbsolute,
} = require('../src/functions.js');

describe('mdLinks', () => {

  it('should...', () => {
    console.log('FIX ME!');
  });

  it('should reject path if it does not exist', () => {
    return mdLinks('desktop/lab/doesnotexist.md').catch((error) => {
      expect(error).toBe("Path does not exist");
    })
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
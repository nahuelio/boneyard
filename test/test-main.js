var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  // dynamically load all test files
  deps: allTestFiles,

  paths: {
      'libs': 'libs',
      'core': 'com/spinal/core',
      'mvc': 'com/spinal/mvc',
      'ui': 'com/spinal/ui',
      'util': 'com/spinal/util'
  },

  shim: {
      'libs/bootstrap': ['libs/jquery', 'libs/modernizr'],
      'libs/underscore': ['libs/bootstrap'],
      'libs/backbone': ['libs/underscore']
  },

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});

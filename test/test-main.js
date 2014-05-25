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
        'libs': 'src/libs',
        'core': 'src/com/spinal/core',
        'mvc': 'src/com/spinal/mvc',
        'ui': 'src/com/spinal/ui',
        'util': 'src/com/spinal/util',
        /** Hack Backbone requirejs **/
        'underscore': 'src/libs/underscore',
        'jquery': 'src/libs/jquery'
    },

    shim: {
        'libs/bootstrap': ['jquery', 'libs/modernizr']
    },

    /** Config file to be included once the framework compiles succesufuly**/
    /**
    paths: {
        'libs': 'target/libs',
        'spinal-core': 'target/spinal-core',
        'spinal-mvc': 'target/spinal-mvc',
        'spinal-ui': 'target/spinal-ui',
        'spinal-util': 'target/spinal-util',
    },

    /**bundles: {
        'libs': ['libs/backbone'],
        'spinal-core': ['core/spinal'],
        'spinal-mvc': ['mvc/controller', 'mvc/service'],
        'spinal-ui': ['ui/view', 'ui/container'],
        'spinal-util': ['util/adt/collection', 'util/adt/iterator', 'util/adt/queue'],
    },**/

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});

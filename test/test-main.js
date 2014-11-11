var allTestFiles = [];
//var TEST_REGEXP = /(spec|test)\.js$/i;
var TEST_REGEXP = /(test)\.js$/i;

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
        /** Rebase to point to specs folder **/
        'specs': 'test/com/spinal/ioc/specs',
        'templates': 'test/com/spinal/ioc/tpls',
        'libs': 'src/libs',
        'core': 'src/com/spinal/core',
        'ioc': 'src/com/spinal/ioc',
        'aop': 'src/com/spinal/aop',
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
        'spinal-ioc': 'target/spinal-ioc',
        'spinal-aop': 'target/spinal-aop',
        'spinal-mvc': 'target/spinal-mvc',
        'spinal-ui': 'target/spinal-ui',
        'spinal-util': 'target/spinal-util',
    },

    /**bundles: {
        'libs': ['libs/backbone'],
        'spinal-core': ['core/spinal'],
        'spinal-ioc': ['ioc/ioc'],
        'spinal-aop': ['aop/aop'],
        'spinal-mvc': ['mvc/controller', 'mvc/service'],
        'spinal-ui': ['ui/view', 'ui/container'],
        'spinal-util': ['util/adt/collection', 'util/adt/iterator', 'util/adt/queue']
    },**/

    // we have to kickoff jasmine, as it is asynchronous
    callback: function() {
        require.onError = function(err) { };
        window.__karma__.start();
    }
});

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
        'libs': 'src/libs',
        'text': 'src/libs/text',
        'core': 'src/com/boneyard/core',
        'ioc': 'src/com/boneyard/ioc',
        'ui': 'src/com/boneyard/ui',
        'util': 'src/com/boneyard/util',

        /** Configurable Resources by end-developer **/
        'specs': 'test/com/boneyard/ioc/specs',

        /** Hack Backbone requirejs **/
        'underscore': 'src/libs/underscore',
        'jquery': 'src/libs/jquery',
        'sinon': 'node_modules/sinon/pkg/sinon'
    },

    shim: {
        'libs/bootstrap': ['jquery', 'sinon']
    },

    // we have to kickoff jasmine, as it is asynchronous
    callback: function() {
        require.onError = function(err) { console.log(err) };
        // Add an initial div element
        $('body').append('<div class="global"></div>');
        window.__karma__.start();
    }
});

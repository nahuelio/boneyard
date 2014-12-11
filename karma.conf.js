// Karma configuration
// Generated on Mon May 12 2014 16:36:27 GMT-0700 (PDT)

module.exports = function(config) {

    var _ = require('underscore'),
        cfg = require('./tools/default-build-config'),
        Sass = require('./tools/utils/sass'),
        HTML = require('./tools/utils/html'),
        Logger = require('./tools/utils/logger');

    Logger.mute = true;

    // External Resources Setup
    cfg.templates.spinal.target = cfg.themes.bootstrap.target = 'test';

    // Compilation for testing
    Sass.init(cfg.themes);
    HTML.init(cfg.templates);

    Logger.mute = false;

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'expect', 'requirejs'],


        // list of files / patterns to load in the browser
        files: [
            'test/test-main.js',
            { pattern: 'src/**/*.js', included: false },
            { pattern: 'test/**/*.js', included: false },
            { pattern: 'test/**/*.css', included: false }
        ],


        // list of files to exclude
        exclude: ['src/main.js', 'src/libs/require.js'],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/*/!(libs)/**/*.js': ['coverage']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec', 'html', 'coverage'],

        htmlReporter: {
            outputFile: 'coverage/unit-test-results.html'
        },

        // optionally, configure the reporter
        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false

    });
};

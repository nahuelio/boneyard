// Karma configuration
module.exports = function(config) {

    var _ = require('underscore'),
        cfg = require('./tools/default-build-config'),
        Sass = require('./tools/utils/sass'),
        Logger = require('./tools/utils/logger');

    Logger.mute = true;
    Sass.init(cfg.themes);
    Logger.mute = false;

    config.set({

        basePath: './',

        frameworks: ['mocha', 'expect', 'requirejs'],

        files: [
            'test/test-main.js',
            { pattern: 'node_modules/sinon/pkg/**/*.js', included: false},
            { pattern: 'src/**/*.js', included: false },
            { pattern: 'test/**/*.js', included: false },
            { pattern: 'test/**/*.css', included: false },
            { pattern: 'test/**/*.json', included: false }
        ],

        exclude: ['src/main.js', 'src/libs/require.js'],

        preprocessors: {
            'src/*/!(libs)/**/*.js': ['coverage'],
            '!node_modules/sinon/pkg/**/*.*': ['coverage']
        },

        reporters: ['nyan', 'coverage', 'coveralls'],

        coverageReporter: {
            reporters: [
                { type: 'html', dir: 'coverage/' },
                { type: 'lcov', dir: 'coverage/' }
            ]
        },

        port: 9876,

        colors: true,

        logLevel: config.LOG_ERROR,

        autoWatch: true,

        browsers: ['PhantomJS'],

        singleRun: false

    });
};

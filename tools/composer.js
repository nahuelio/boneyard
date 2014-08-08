/**
*  Spinal Composer Tool
*  @author Patricio Ferreira <3dimentionar@gmail.com>
**/

var fs = require('fs'),
    path = require('path'),
    connect = require('connect'),
    watch = require('watch'),
    _ = require('underscore'),
	_s = require('underscore.string'),
	colors = require('colors'),
	Utils = require('./util');

var Composer = {

    defaults: {
        configPath: './custom-config-example.json'
    },

    // Source code
    source: './src',

    // Config
    configPath: null,
    config: {},

    // Composer temporal target folder
    target: '/composer-app',

    // Autowatch Server
    port: 9393,

    // Extra Options
    clear: true,
    verbose: false,

    /**
    *   Composer main excecution
    */
    exec: function(opts) {
        this.parse(opts);
        this.output();
        //this.loadConfig();
        //this.createTarget();
        //this.spinUpAutoWatch();
    },

    /**
    *   Parse Composer arguments
    */
    parse: function(opts) {
        if(opts.source) this.source = opts.source;
        if(opts.config) this.configPath = opts.config;
        if(!_.isUndefined(opts.clear_on_exit)) this.clear = opts.clear_on_exit;
        if(!_.isUndefined(opts.verbose)) this.verbose = opts.verbose;
    },

    /**
    *   Output Composer Settings to the command-line
    */
    output: function() {
        Utils.log('\nSpinal Composer Tool'.yellow);
        Utils.log('\nSettings:'.magenta);
        Utils.log(('\n  Source Path: ' + this.source +
            '\n  Local Folder: ' + this.target +
            '\n  Clear on Exit: ' + ((this.clear) ? 'Activated' : 'Deactivated') +
            '\n  Verbose: ' + ((this.verbose) ? 'Activated' : 'Deactivated') + '\n').magenta);
    },

    loadConfig: function() {
        try {
            if(!this.configPath) {
                Utils.log('\nPath to the config file not specify'.yellow);
                this.configPath = resolve(this.src, this.defaults.configPath);
                Utils.log(('\nLoading Default Config file [' + this.configPath + ']').green);
            } else {
                Utils.log(('\nLoading Config file [' + resolve(this.configPath) + ']').green);
            }
            this.config = require(this.configPath);
        } catch(ex) {
            console.error(ex.message);
            process.exit();
        }
    },

    /**
    *   Create Temporal Target folder
    */
    createTarget: function() {
        Utils.log('\nGenerating Composer Environment'.green);
        // TODO: Create Target folder... with templates to use spinal[core-util-ioc] as a base.
    },

    /**
    *   Spin Up Auto watch server
    */
    spinUpAutoWatch: function() {
        Utils.log('\nSpinning Up Server...'.green);
        watch.createMonitor(this.src, { ignoreDotFiles: true, ignoreUnreadableDir: true }, _.bind(this.onFileChange, this));
        connect().use(connect.static(__dirname + this.target)).listen(this.port);
        Utils.log(('\nServer listening on port ' + this.port + '...').magenta);
    },

    /**
    *   Watch monitor handler
    */
    onFileChange: function(monitor) {
        monitor.on("created", function (f, stat) {
            Utils.log(('\nFile Created [' + f + ']').magenta);
            // TODO: Fire emitter to the browser to reload
        })
        monitor.on("changed", function (f, curr, prev) {
            Utils.log(('\nFile Modified [' + f + ']').magenta);
            // TODO: Fire emitter to the browser to reload
        })
        monitor.on("removed", function (f, stat) {
            Utils.log(('\nFile Removed [' + f + ']').magenta);
            // TODO: Fire emitter to the browser to reload
        })
    }

};

module.exports = Composer;

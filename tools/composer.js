/**
*  Spinal Composer Tool
*  @author Patricio Ferreira <3dimentionar@gmail.com>
**/

var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
	_s = require('underscore.string'),
	colors = require('colors'),
	Utils = require('./util');

var Composer = {

    source: './src',

    target: './target',

    clear: true,

    verbose: false,

    exec: function(opts) {
        this.parse(opts);
        this.output();
    },

    parse: function(opts) {
        if(opts.source) this.source = opts.source;
        if(!_.isUndefined(opts.clear_on_exit)) this.clear = opts.clear_on_exit;
        if(!_.isUndefined(opts.verbose)) this.verbose = opts.verbose;
    },

    output: function() {
        Utils.log('\nSpinal Composer Tool'.yellow);
        Utils.log('\nSettings:'.magenta);
        Utils.log(('\n  Source Path: ' + this.source +
            '\n  Local Folder: ' + this.target +
            '\n  Clear on Exit: ' + ((this.clear) ? 'Activated' : 'Deactivated') +
            '\n  Verbose: ' + ((this.verbose) ? 'Activated' : 'Deactivated') + '\n').magenta);
    }

};

module.exports = Composer;

/**
*	Logger utility
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
var _ = require('underscore'),
	colors = require('colors');

var Logger = {

	/**
	*	Table colors
	*	@public
	*	@property colors
	*	@type Object
	**/
	colors: {
		LOG: 'cyan',
		DEBUG: 'green',
		WARN: 'yellow',
		ERROR: 'red'
	},

	/**
	*	Logs the message into the STDOUT
	*	@private
	*	@method _out
	*	@param msg {String} message to display
	*	@param [opts] {Object} extra options
	**/
	_out: function(msg, opts) {
		if(opts.nl) msg = ('\n' + msg);
		console.log(msg[opts.color]);
	},

	/**
	*	Logs log level
	*	@public
	*	@method log
	*	@param msg {String} message to display
	*	@param [opts] {Object} extra options
	**/
	log: function(msg, opts) {
		opts || (opts = {});
		this._out(msg, _.extend(opts, { color: this.colors.LOG }));
	},

	/**
	*	Logs debug level
	*	@public
	*	@method debug
	*	@param msg {String} message to display
	*	@param [opts] {Object} extra options
	**/
	debug: function(msg, opts) {
		opts || (opts = {});
		this._out(msg, _.extend(opts, { color: this.colors.DEBUG }));
	},

	/**
	*	Logs warn level
	*	@public
	*	@method warn
	*	@param msg {String} message to display
	*	@param [opts] {Object} extra options
	**/
	warn: function(msg, opts) {
		opts || (opts = {});
		this._out(msg, _.extend(opts, { color: this.colors.WARN }));
	},

	/**
	*	Logs error level
	*	@public
	*	@method error
	*	@param msg {String} message to display
	*	@param [opts] {Object} extra options
	**/
	error: function(msg, opts) {
		opts || (opts = {});
		this._out(msg, _.extend(opts, { color: this.colors.ERROR }));
	}

};

module.exports = Logger;

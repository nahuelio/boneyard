/**
*	@module com/spinal/util/error
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	Extend functionality of Spinal Core to create custom exceptions (Errors)
	*	@namespace com.spinal.util.error
	*	@class com.spinal.util.error.SpinalException
	*	[ENHANCEMENT]: Add support for {{mustache}} in exception messages
	**/
	var SpinalException = Spinal.namespace('com.spinal.util.error.SpinalException', function(type, message) {
		this.name = (this.constructor.NAME) ? this.constructor.NAME : 'SpinalException';
		this.type = (!_.isUndefined(this.constructor.TYPES[type])) ? type : 'Generic';
		this.message = (message || this.getMessage(this.type));
		this.initialize.apply(this, arguments);
		return this;
	});

	Spinal.extend(SpinalException.prototype, new Error(), {

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.error.SpinalException}
		**/
		initialize: function() {
			return this;
		},

		/**
		*	@public
		*	@method matches
		*	@param types {Array} collection of exception types
		*	@return Boolean
		**/
		matches: function(types) {
			if(_.isEmpty(_.pick(this.constructor.TYPES, types))) return false;
			return _.contains(types, this.type);
		},

		/**
		*	@public
		*	@method getMessage
		*	@param type {String} exception type
		*	@return String
		**/
		getMessage: function(type) {
			// FIXME: see notes above.
			return (!this.constructor.TYPES[type]) ? 'Unknown Exception Message' : this.constructor.TYPES[type];
		}

	});

	/**
	*	@static
	*	@property NAME
	*	@type String
	**/
	SpinalException.NAME = 'SpinalException';

	/**
	*	@static
	*	@property TYPES
	*	@type Object
	**/
	SpinalException.TYPES = {
		Generic: 'Generic Exception'
	};

	/**
	*	@static
	*	@method inherit
	*	@return Function
	**/
	SpinalException.inherit = Spinal._inherit;

	return SpinalException;

});

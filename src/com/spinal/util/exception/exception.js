/**
*	@module com.spinal.util.exception
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	Extend functionality of Spinal Core to create custom exceptions (Errors)
	*	@namespace com.spinal.util.exception
	*	@class com.spinal.util.exception.SpinalException
	**/
	var SpinalException = Spinal.namespace('com.spinal.util.exception.SpinalException', function(type) {
		this.initialize.apply(this, arguments);
		return this;
	});

	Spinal.extend(SpinalException.prototype, new Error(), {

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param type {String} exception type
		*	@param type {Object} key/value pairs to be used to template the message
		*	@return {com.spinal.util.exception.SpinalException}
		**/
		initialize: function(type, tpl) {
			this.name = (this.constructor.NAME) ? this.constructor.NAME : 'SpinalException';
			this.type = (!_.isUndefined(this.constructor.TYPES[type])) ? type : 'Generic';
			this.message = this.getMessage(this.type, tpl);
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
		*	@param tpl {Object} key/value pairs to be used to template the message
		*	@return String
		**/
		getMessage: function(type, tpl) {
			return SpinalException.getMessage.apply(this, arguments);
		}

	});

	/**
	*	@static
	*	@property NAME
	*	@type String
	**/
	SpinalException.NAME = 'SpinalException';

	/**
	*	__Type List__
	*
	*		Generic
	*	@static
	*	@property TYPES
	*	@type Object
	**/
	SpinalException.TYPES = {
		Generic: 'Generic Exception',
		StaticClass: 'Class cannot be instanciated. All methods and variable members are static.'
	};

	/**
	*	@static
	*	@method getMessage
	*	@param type {String} exception type
	*	@param tpl {Object} key/value pairs to be used to template the message
	*	@return String
	**/
	SpinalException.getMessage = function(type, tpl) {
		var ctx = (this instanceof SpinalException) ? this.constructor : this;
		return (type && ctx.TYPES[type]) ?
			_.template(ctx.TYPES[type], (!_.isUndefined(tpl) ? tpl : {})) :
			'Unknown Exception Message';
	},

	/**
	*	@static
	*	@method inherit
	*	@return Function
	**/
	SpinalException.inherit = Spinal._inherit;

	return SpinalException;

});

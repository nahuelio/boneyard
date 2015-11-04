/**
*	@module com.boneyard.util.exception
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/boneyard'], function(Boneyard) {

	/**
	*	Class BoneyardException
	*	@namespace com.boneyard.util.exception
	*	@class com.boneyard.util.exception.BoneyardException
	*	@extends Error
	*
	*	@requires com.boneyard.core.Boneyard
	**/
	var BoneyardException = Boneyard.namespace('com.boneyard.util.exception.BoneyardException', function(type) {
		this.initialize.apply(this, arguments);
		return this;
	});

	Boneyard.extend(BoneyardException.prototype, new Error(), {

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param type {String} exception type
		*	@param type {Object} key/value pairs to be used to template the message
		*	@return com.boneyard.util.exception.BoneyardException
		**/
		initialize: function(type, tpl) {
			this.name = (this.constructor.NAME) ? this.constructor.NAME : 'BoneyardException';
			this.type = (!_.isUndefined(this.constructor.TYPES[type])) ? type : 'Generic';
			this.message = this.getMessage(this.type, tpl);
			return this;
		},

		/**
		*	@public
		*	@method getMessage
		*	@param type {String} exception type
		*	@param tpl {Object} key/value pairs to be used to template the message
		*	@return String
		**/
		getMessage: function(type, tpl) {
			return BoneyardException.getMessage.apply(this, arguments);
		}

	});

	/**
	*	@static
	*	@property NAME
	*	@type String
	**/
	BoneyardException.NAME = 'BoneyardException';

	/**
	*	__Type List__
	*
	*		Generic
	*	@static
	*	@property TYPES
	*	@type Object
	**/
	BoneyardException.TYPES = {
		Generic: _.template('Generic Exception'),
		StaticClass: _.template('Class cannot be instanciated. All methods and variable members are static.')
	};

	/**
	*	@static
	*	@method getMessage
	*	@param type {String} exception type
	*	@param tpl {Object} key/value pairs to be used to template the message
	*	@return String
	**/
	BoneyardException.getMessage = function(type, tpl) {
		var ctx = (this instanceof BoneyardException) ? this.constructor : this;
		return (type && ctx.TYPES[type]) ?
			ctx.TYPES[type]((!_.isUndefined(tpl) ? tpl : {})) :
			'Unknown Exception Message';
	},

	/**
	*	@static
	*	@method inherit
	*	@return Function
	**/
	BoneyardException.inherit = Boneyard._inherit;

	return BoneyardException;

});

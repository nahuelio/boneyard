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
		this.type = this.getType(type);
		if(!this.type) this.type = this.getType('Generic');
		this.message = (message || this.type.message); // see notes above.
		if(this.initialize) this.initialize.apply(this, arguments);
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
		*	@method getMessage
		*	@param type {String} exception type
		*	@return String
		**/
		getType: function(type) {
			return _.find(SpinalException.TYPES, function(t) { return (t.name === t); });
		}

	});

	/**
	*	@static
	*	@property TYPES
	*	@type Array
	**/
	SpinalException.TYPES = [
		{ name: 'Generic', message: 'Generic Exception' }
	];

	/**
	*	@static
	*	@method inherit
	*	@return Function
	**/
	SpinalException.inherit = Spinal._inherit;

	return SpinalException;

});

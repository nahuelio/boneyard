/**
*	@module com.spinal.util.StringUtil
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	StringUtils class provides a bunch of string utilities.
	*	@namespace com.spinal.util
	*	@class com.spinal.util.StringUtils
	*	@extends com.spinal.core.SpinalClass
	**/
	var StringUtils = Spinal.namespace('com.spinal.util.StringUtils', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.StringUtils}
		**/
		initialize: function() {
			throw new Error(this.toString() + ' cannot be instanciate it. All methods are declare as static.');
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'StringUtils',

		/**
		*	Returns a UUID (Universally Unique Identifier)
		*	@static
		*	@method uuid
		*	@return String
		**/
		uuid: function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0,
					v = (c === 'x') ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}

	}));

	return StringUtils;

});

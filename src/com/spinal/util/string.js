/**
*	@module com.spinal.util
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/exception/exception'], function(Spinal, SpinalException) {

	/**
	*	StringUtil class provides a bunch of string utilities.
	*	@namespace com.spinal.util
	*	@class com.spinal.util.StringUtil
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.util.exception.Exception
	**/
	var StringUtil = Spinal.namespace('com.spinal.util.StringUtil', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.StringUtil}
		**/
		initialize: function() {
			throw new SpinalException('StaticClass');
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'StringUtil',

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

	return StringUtil;

});

/**
*	@module com.spinal.util
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/exception/exception'], function(Spinal, SpinalException) {

	/**
	*	ObjectUtil Class
	*	@namespace com.spinal.util
	*	@class com.spinal.util.ObjectUtil
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.util.exception.Exception
	**/
	var ObjectUtil = Spinal.namespace('com.spinal.util.ObjectUtil', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.spinal.util.ObjectUtil
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
		NAME: 'ObjectUtil',

		/**
		*	Returns true if the value is an object, otherwise returns false
		*	@public
		*	@method isRealObject
		*	@param value {Object} value to be evaluated
		*	@return Boolean
		**/
		isRealObject: function(value) {
			return (_.defined(value) &&
				!_.isArray(value) &&
				!_.isString(value) &&
				!_.isNumber(value) &&
				!_.isBoolean(value) &&
				!_.isFunction(value) &&
				!_.isRegExp(value) &&
				!_.isDate(value) &&
				!_.isArguments(value));
		},

		/**
		*	Check if a given object is an instance of a Backbone class
		*	@public
		*	@method isBackbone
		*	@param value {Object} value to be evaluated
		*	@return Boolean
		**/
		isBackbone: function(value) {
			return (value instanceof Backbone.Model ||
				value instanceof Backbone.Collection ||
				value instanceof Backbone.View ||
				value instanceof Backbone.Router);
		},

		/**
		*	Perform a query using a string (dot notation) on the obj passed as parameter.
		*	If the input doesn't match, it returns null.
		*	@static
		*	@method search
		*	@param query {String} query in dot notation format
		*	@param obj {Object} JSON object ref
		*	@return Object
		**/
		search: function(query, obj) {
			if(!query || !obj || query === '') return null;
			if(_.isEmpty(obj)) return obj;
			var q = query.split("."), o = obj;
		    for (var i = 0; i < q.length; i++) {
				if(!o[q[i]]) { o = ''; break; }
				o = o[q[i]];
			}
		    return o;
		},

		/**
		*	Transforms an object into an array, creating on each key-value pair a separate object on the resulting
		*	array
		*	@static
		*	@method objToArr
		*	@param obj {Object} JSON object ref
		*	@return Array
		**/
		objToArr: function(obj) {
			return _.reduce(obj, function(arr, v, k) {
				var o = {}; o[k] = v; arr.push(o);
				return arr;
			}, []);
		}

	}));

	return ObjectUtil;

});

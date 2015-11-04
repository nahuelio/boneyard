/**
*	@module com.boneyard.util
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/boneyard',
		'util/exception/exception'], function(Boneyard, BoneyardException) {

	/**
	*	Class StringUtil
	*	@namespace com.boneyard.util
	*	@class com.boneyard.util.StringUtil
	*	@extends com.boneyard.core.Boneyard.Class
	*
	*	@requires com.boneyard.core.Boneyard
	*	@requires com.boneyard.util.exception.BoneyardException
	**/
	var StringUtil = Boneyard.namespace('com.boneyard.util.StringUtil', Boneyard.Class.inherit({

		/**
		*	Initialize
		*	@public
		*	@throws BoneyardException
		*	@method initialize
		**/
		initialize: function() {
			throw new BoneyardException('StaticClass');
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
		},

		/**
		*	Convert a JSON object into a query string format
		*	@static
		*	@method create
		*	@param o {Object} object to be converted
		*	@param [ignoreQMark] {Boolean} optional to skip question mark as part of the query string
		*	@param [separator] {String} separator used to split key-value pairs ('&' by default)
		**/
		createQueryString: function(o, noQMark, separator) {
			var pairs = [], i, len;
			_.each(o, function(v, k) {
				if(_.isArray(v)) {
					for(i = 0, len = v.length; i < len; i++)
						pairs.push(k + '=' + encodeURIComponent(decodeURIComponent(v[i])));
				} else {
					pairs.push(k + '=' + encodeURIComponent(decodeURIComponent(v)));
				}
			}, this);
			return ((noQMark || _.isEmpty(o)) ? '' : '?') + pairs.join((separator) ? separator : '&');
		},

		/**
		*	Convert a String in dot notation format into a JSON object
		*	@static
		*	@method strToJSON
		*	@param expr {String} dot notation
		*	@retur Object
		**/
		strToJSON: function(expr) {
			if(!expr || !_.isString(expr) || expr === '') return {};
			var p = {}, o = p, ps = expr.split('.');
			for(var i = 0; i < ps.length; i++) {
				p[ps[i]] = {}; p = p[ps[i]];
				if(i === (ps.length-1)) delete p;
			}
			return o;
		},

		/**
		*	Escapes Regular expression from value passed by parameter
		*	@static
		*	@method escapeRegex
		*	@param value {String} string to evaluate
		*	@return String;
		**/
		escapeRegex: function(value) {
			if(!_.isString(value)) return '';
			return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
		},

		/**
		*	Prefixes props keys in props input object with a '_' to match the private members convention
		*	and returns the object
		*	@static
		*	@method toPrivate
		*	@param props {Object} Object to convert keys from
		*	@return Object
		**/
		toPrivate: function(props) {
			var o = _.clone(props);
			_.each(props, function(v, k) { o['_' + k] = v; delete o[k]; });
			return o;
		}

	}));

	return StringUtil;

});

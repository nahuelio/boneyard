// ~~bundles

/**
*	SpinalJS UI Framework
*	@module com.spinal.core
*	@requires Backbone
*	@author Patricio Ferrerira <3dimentionar@gmail.com>
**/
define(['libs/backbone'], function() {

	/**
	*	Spinal Core
	*	@namespace com.spinal.core
	*	@class Spinal
	*	@main Spinal
	**/
	return (function(root) {

		var exports = root.Spinal = {};

		/**
		*	@static
		*	@property __VERSION__
		*	@type String
		**/
		exports.__VERSION__ = '<%= __VERSION__ %>';

		/**
		*	Namespacing Strategy
		*	@static
		*	@method namespace
		*	@param path {String} namespace path
		*	@param constructor {Function} constructor function
		*	@return Function
		**/
		var namespace = exports.namespace = function(path, constructor) {
			if(!path || !_.isString(path) || !constructor)
				throw new Error('Spinal.namespace requires a namespace (in dot notation) and a function (or object)');
			var parts = path.split('.'), part = exports;
			var obj, name, ps = parts.length;
			for(var i = 0; i < ps; i++) {
				obj = part; name = parts[i];
				part = (part[name]) ? part[name] : (part[name] = {});
			}
			return (constructor) ? (obj[name] = constructor) : part;
		};

		/**
		*	Validate if obj is an instance of the Browser's Windows Object.
		*	@private
		*	@method _isWindow
		*	@param obj {Object} object to evaluate
		*	@return Boolean
		**/
		var _isWindow = function(obj) {
			return obj && obj.document && obj.location && obj.alert && obj.setInterval;
		};

		/**
		*	Creates object through Object.create or polyfill for IE <= 8
		*	@private
		*	@param proto{Object} - The object representing the prototype of the new object to create
		*	@return Object
		**/
		var _createObject = (function() {
			function Constructor() {};
			if(typeof Object.create === "function") return Object.create;
			return function(proto) {
				Constructor.prototype = proto;
				return new Constructor();
			};
		}());

		/**
		*	Creates a deep copy of source by extracting his properties (preserving protoype chain) and copying to
		*	the destination object if it's specified.
		*	Thanks to the angular Team to provide it!
		*	AngularJS Original implementation: https://github.com/angular/angular.js/blob/master/src/Angular.js#L760
		*	AngularJS MIT License: https://github.com/angular/angular.js/blob/master/LICENSE
		*
		*	@private
		*	@method _deepCopy
		*	@param source {Object} source object to create the copy with
		*	@param destination {Object} destination object
		*	@return Object
		**/
		var _deepCopy = function (source, destination, existing) {
			if (_isWindow(source)) throw new Error("Making copies of Window or Scope instances is not supported.");
			if(!destination) {
				destination = source;
				if(source) {
					if(_.isArray(source)) {
						destination = _deepCopy(source, []);
					} else if(_.isDate(source)) {
						destination = new Date(source.getTime());
					} else if(_.isRegExp(source)) {
						destination = new RegExp(source.source);
					} else if(_.isObject(source) && !_.isFunction(source)) {
						if(!existing) {
							destination = _deepCopy(source, _createObject(Object.getPrototypeOf(source)));
						} else {
							source = _.omit(source, _.keys(existing));
							destination = _.extend(existing, _deepCopy(source, _createObject(Object.getPrototypeOf(source))));
						}
					}
				}
			} else {
				if(source === destination) throw new Error("Can't copy! Source and destination are identical.");
				if(_.isArray(source)) {
					destination.length = 0;
					for(var i = 0; i < source.length; i++) destination.push(_deepCopy(source[i]));
				} else {
					for(var key in source) {
						if(!destination.hasOwnProperty(key)) {
							destination[key] = _deepCopy(source[key]);
						} else if(_.isObject(source[key]) && !_.isDate(source[key]) &&
							!_.isRegExp(source[key]) && !_.isFunction(source[key]) &&
							!_.isArray(source[key])) {
								destination[key] = _deepCopy(source[key], null, destination[key]);
						}
					}
				}
			}
			return destination;
		};

		/**
		*	Spinal Deep Copy strategy for inheritance.
		*	@static
		*	@method extend
		*	@return Object
		**/
		var extend = exports.extend = function(o) {
			var args = Array.prototype.slice.call(arguments, 1);
			for(var i = 0; i < args.length; i++) {
				if(args[i]) _deepCopy(args[i], o);
			}
			return o;
		};

		/**
		*	Inheritance Strategy
		*	@private
		*	@method _inherit
		*	@return Function
		**/
		var _inherit = exports._inherit = function(proto, protoStatic) {
			protoStatic || (protoStatic = {});
			var Parent = this;

			Child = (proto && _.has(proto, 'constructor')) ? proto.constructor : function() {
				return Parent.apply(this, arguments);
			};

			var F = function() { this.constructor = Child; };
			F.prototype = Parent.prototype;
			Child.prototype = new F;
			if(proto) {
				extend(Child.prototype, proto);
				extend(Child, protoStatic, _.omit(Parent, 'inherit', '__super__'));
			}

			Child.inherit = _inherit;
			Child.__super__ = Parent.prototype;
			return Child;
		};

		// If Backbone exists, expose new inherit method to Backbone Classes
		if(Backbone) {
			Backbone.View.inherit = Backbone.Collection.inherit =
			Backbone.Model.inherit = Backbone.Router.inherit = _inherit;
		}

		/**
		*	Provides a generic Class with a generic interface to set and get properties
		*	@class com.spinal.core.SpinalClass
		**/
		var SpinalClass = exports.SpinalClass = namespace('com.spinal.core.SpinalClass', function() {
			this.initialize.apply(this, arguments);
		});

		extend(SpinalClass.prototype, Backbone.Events, {

			/**
			*	Default initialize
			*	@public
			*	@method initialize
			*	@return {com.spinal.core.SpinalClass}
			**/
			initialize: function() { return this; },

			/**
			*	Invoke a method of this class specified by 'methodName' and pass each
			*	individual object in the array specified by args as an argument.
			*	This method will return an array of objects as a result of any method call.
			*	@public
			*	@method invoke
			*	@param methodName {String} method name of this class
			*	@param args {Array} array of elements to be passed to the method
			*	@return Array
			**/
			invoke: function(methodName, args) {
				if(!methodName || !args || !_.isString(methodName) || !_.isArray(args)) return [];
				return _.map(args, function(v) { return (this[methodName]) ? this[methodName](v) : null; }, this);
			},

			/**
			*	Proxifies the list of instance methods/properties into the target specified in the first parameter.
			*	<h5>Usages:</h5>
			*		source.proxify(target, 'method1', 'property1', 'methodN');
			*		target.method1(); // executes method1 declared in source.
			*		target.property1; // access property1 declared in source.
			*		target.methodN(); // executes methodN declared in source.
			*	@public
			*	@method proxify
			*	@param t {Object} target instance to apply
			*	@return Object
			**/
			proxify: function(t) {
				if(!t) return this;
				var members = Array.prototype.slice.call(arguments, 1);
				_.each(members, function(m) {
					if(!_.defined(this[m])) return;
					t[m] = (_.isFunction(this[m])) ? _.bind(this[m], this) : this[m];
			}, this);
				return this;
			},

			/**
			*	Serializes the Class instance into a plain javascript object.
			*	@public
			*	@method toJSON
			*	@return Object
			**/
			toJSON: function() {
				return JSON.parse(JSON.stringify(_.omit(this, _.functions(this))));
			},

			/**
			*	Default toString implementation
			*	@public
			*	@method toString
			*	@return String
			**/
			toString: function() {
				return '[object ' + ((this.constructor.NAME) ? this.constructor.NAME : 'SpinalClass') + ']';
			}
		});

		/**
		*	@static
		*	@method inherit
		*	@return Function
		**/
		SpinalClass.inherit = _inherit;

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		SpinalClass.NAME = 'SpinalClass';

		/** Underscore Mixin Utilities **/

		_.mixin({
			/**
			*	Check if defined given a value passed by parameter
			**/
			defined: function(value) { return !(_.isNull(value) || _.isUndefined(value)); }
		});

		return exports;

	}(window));

});

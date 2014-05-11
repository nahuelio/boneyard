/**
*	SpinalJS UI Framework
*	@module com/spinal/core
*	@author Patricio Ferrerira <3dimentionar@gmail.com>
**/
define(['libs/backbone'], function() {

	/**
	*	Spinal Core
	*	@namespace com.spinal.core
	*	@class Spinal
	*	@main Spinal
	**/
	(function (root, factory) {
		'use strict';
		// Support AMD, CommonJS/Node.js, Rhino and Brower,
		if (typeof define === 'function' && define.amd) {
			define(['exports'], factory);
		} else if(typeof exports !== 'undefined') {
			return factory(exports, root);
		} else {
			return factory((root.Spinal = {}), root);
		}
	}(this, function(exports, root) {
		
		/**
		*	@static
		*	@property __VERSION__
		*	@type String
		**/
		exports.__VERSION__ = '<%= version %>';
		
		// Expose Backbone hard dependency into Spinal Namespace
		exports.Backbone = root.Backbone;
		
		
		// SpinalJS Expose Third Party Libraries into Spinal Namespace when available.
		if(root.Modernizr) exports.Modernizr = Modernizr;
		
		/**
		*	Namespacing Strategy
		*	@static
		*	@method namespace
		*	@return Function
		**/
		var namespace = exports.namespace = function(path, constructor) {
			var parts = path.split('.'), parent = exports, pl, i;
			if (parts[0] == "spinal") parts = parts.slice(1);
			pl = parts.length;
			for (var i = 0; i < pl; i++) {
				if (typeof parent[parts[i]] == 'undefined') parent[parts[i]] = {};
				if(i == (pl-1)) parent[parts[i]] = constructor;
				parent = parent[parts[i]];
			}
			return parent;
		};
		
		/**
		*	JSON Serialization Strategy
		*	@private
		*	@method _serialize
		*	@return Any
		**/
		var _serialize = function(k, v) {
			if(this[k] instanceof Date) return this[k].toJSON();
			if(this[k] === undefined) return null;
			if(this[k] instanceof Function) return v.toString();
			return v;
		};
		
		var	dateiso = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/;
		
		/**
		*	JSON Deserialization Strategy
		*	@private
		*	@method _deserialize
		*	@return Any
		**/
		var _deserialize = function(k, v) {
			if(dateiso.test(v)) return new Date(v);
			if(v && v.substring && v.substring(0, 8) === 'function') return eval('(' + v + ')');
			return v;
		};
		
		/**
		*	Parse first level of properties
		*	@private
		*	@method _parse
		**/
		var _parse = function(from) {
			var sd = JSON.parse(JSON.stringify(from, _serialize), _deserialize);
			for(var p in from) {
				if(!this.hasOwnProperty(p)) this[p] = sd[p];
			}
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
				if(args[i]) _parse.call(o, args[i]);
			}
			return o;
		};
		
		/**
		*	Filters inheritance Constructor function properties.
		*	@private
		*	@method _filter
		*	@return Object
		**/
		var _filter = function(func) {
			var obj = {};
			for(var p in func) {
				if(p == 'inherit' || p == '__super__') continue;
				obj[p] = func[p];
			}
			return obj
		};
		
		/**
		*	Inheritance Strategy
		*	@private
		*	@method _inherit
		*	@return Function
		**/
		var _inherit = exports._inherit = function(proto, protoStatic) {
			protoStatic || (protoStatic = {});
			var Parent = this, Child = function() { return Parent.apply(this, arguments); };
			
			var F = function() { this.constructor = Child; };
			F.prototype = Parent.prototype;
			Child.prototype = new F;
			if(proto) {
				extend(Child.prototype, proto);
				extend(Child, protoStatic, _filter(Parent));
			}
			
			Child.inherit = _inherit;
			Child.__super__ = Parent.prototype;
			return Child;
		};
		
		// If Backbone exists, inject new Inherit method
		if(exports.Backbone) Backbone.View.inherit = _inherit;
		
		/**
		*	Provides a generic Class with a generic interface to set and get properties
		*	@class com.spinal.core.Class
		**/
		var Class = exports.Class = namespace('com.spinal.core.Class', function(attrs) {
			attrs || (attrs = {});
			this.set(attrs);
			this.initialize.apply(this, arguments);
		});
		
		extend(Class.prototype, {
			/**
			*	Default initialize
			*	@public
			*	@method initialize
			*	@return Class
			**/
			initialize: function() { return this; },
			
			/**
			*	Default Getter
			*	@public
			*	@method get
			*	@return Object
			**/
			get: function(p) { return this[p]; },
			
			/**
			*	Default Setter
			*	@public
			*	@method set
			**/
			set: function(p, v) {
				if(!p) throw new Error('set() requires 1 arguments (object or a key).');
				(p && p === Object(p)) ?
					extend.apply(this, [this, p]) :
				this[p] = v;
				return this;
			}
		});
		
		/**
		*	@static
		*	@method inherit
		*	@return Function
		**/
		Class.inherit = _inherit;
		
		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		Class.NAME = 'SpinalClass';
		
	}));
	
	return exports;
	
});
/**
*  Spinal UI Framework
*  @author Patricio Ferrerira <3dimentionar@gmail.com>
**/
"use strict";

(function(exports) {
	
	var	dateiso = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/;
	
	/**
	*	Namespacing Strategy
	**/
	exports.namespace = function(path, constructor) {
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
	**/
	var _serialize = function(k, v) {
		if(this[k] instanceof Date) return this[k].toJSON();
		if(this[k] === undefined) return null;
		if(this[k] instanceof Function) return v.toString();
		return v;
	};
	
	/**
	*	JSON Deserialization Strategy
	**/
	var _deserialize = function(k, v) {
		if(dateiso.test(v)) return new Date(v);
		if(v && v.substring && v.substring(0, 8) === 'function') return eval('(' + v + ')');
		return v;
	};
	
	/**
	*	Parse first level of properties
	**/
	var _parse = function(from) {
		var sd = JSON.parse(JSON.stringify(from, _serialize), _deserialize);
		for(var p in from) {
			if(!this.hasOwnProperty(p)) this[p] = sd[p];
		}
	};
		
	/**
	*	Spinal Deep Copy strategy for inheritance.
	*	Unsupported types: RegExp.
	*	@BECHMARK See how performance diagnostic we get with this.
	**/
	exports._extend = function(o) {
		var args = Array.prototype.slice.call(arguments, 1);
		for(var i = 0; i < args.length; i++) {
			if(args[i]) _parse.call(o, args[i]);
		}
		return o;
	};
	
	/** Generic Class Constructor & Interfaces **/
	
	/**
	*	Basic Constructor Function
	**/
	var _constructor = function(attrs) {
		attrs || (attrs = {});
		this.attributes = {};
		this.set(attrs);
		this.initialize.apply(this, arguments);
	};
	
	/**
	*	Basic Spinal Interface for Classes.
	**/
	var _interface = {
		initialize: function() { return this; },
		get: function(p) { return this.atributes[p]; },
		set: function(p, v) {
			if(!p) throw new Error('set() requires 1 arguments (object or a key).');
			if(p && p === Object(p)) {
				exports._extend.call(this.attributes, p);
			} else {
				this.attributes[p] = v;
			}
			return this;
		}
	};
	
	/**
	*	Inheritance Strategy
	*	FIXME (Not working right).
	**/
    exports.inherit = function(proto, protoStatic) {
        var Parent = this, Child = function() { return Parent.apply(this, arguments); };
		
		if(protoStatic) exports._extend(Child, Parent, protoStatic);
        var F = function() { this.constructor = Child; };
        F.prototype = Parent.prototype;
        Child.prototype = new F();
		Child.inherit = exports.inherit;
      	if(proto) exports._extend(Child.prototype, proto);
		
        Child.__super__ = Parent.prototype;
        return Child;
    };
	
	// Default Generic Class
	// See if we can reuse Backbone.Events
	exports.Generic = _constructor;
	exports._extend(exports.Generic.prototype, _interface);
	exports.Generic.inherit = exports.inherit;
			
	exports.__VERSION__ = '<%= version %>';
	
}(typeof exports === 'undefined' ? (window.Spinal = {}) : exports));
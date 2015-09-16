/**
*	@module com.spinal.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/annotation'], function(Annotation) {

	/**
	*	Class Bone
	*	@namespace com.spinal.ioc.engine.annotation
	*	@class com.spinal.ioc.engine.annotation.Bone
	*	@extends com.spinal.ioc.engine.annotation.Annotation
	*
	*	@requires com.spinal.util.StringUtil
	**/
	var	Bone = Spinal.namespace('com.spinal.ioc.engine.annotation.Bone', Annotation.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param [attrs] {Object} attributes
		*	@return com.spinal.ioc.engine.annotation.Bone
		**/
		initialize: function(attrs) {
			return Bone.__super__.initialize.call(this, { _id: _.keys(attrs)[0], _value: _.values(attrs)[0] });
		},

		/**
		*	Retrieves bone's id
		*	@public
		*	@method getId
		*	@return Object
		**/
		getId: function() {
			return this._id;
		},

		/**
		*	Retrieves bone's metadata
		*	@public
		*	@method getValue
		*	@return Object
		**/
		getValue: function() {
			return this._value;
		},

		/**
		*	Retrieves annotation module path
		*	@public
		*	@method getId
		*	@return String
		**/
		getModule: function() {
			return this.getValue().$module;
		},

		/**
		*	Retrieves annotation module params if exists, otherwise returns bone
		*	@public
		*	@method getParams
		*	@return String
		**/
		getParams: function() {
			return (this.getValue().$params) ? this.getValue().$params : this.getValue();
		},

		/**
		*	Determines and retrieves this bone either, as a module instance or the bone itself.
		*	@public
		*	@method get
		*	@return Object
		**/
		get: function() {
			return (this.isModule() && this.isCreated()) ? this._$created : this;
		},

		/**
		*	Checks if this annotation is a module
		*	@static
		*	@method isModule
		*	@param bone {Object} current bone to be evaluated
		*	@return Boolean
		**/
		isModule: function() {
			return _.defined(this.getModule());
		},

		/**
		*	Checks if this annotation was succesfully created
		*	@static
		*	@method isCreated
		*	@return Boolean
		**/
		isCreated: function() {
			return _.defined(this._$created);
		},

		/**
		*	Returns true if this bone is a object or array and not a module, otherwise returns false
		*	@public
		*	@method isNativeObject
		*	@return Boolean
		**/
		isNativeObject: function() {
			return ((_.isObject(this.getValue()) || _.isArray(this.getValue())) && !this.isModule());
		},

		/**
		*	Check if this annotation is an instance of a Backbone class
		*	@public
		*	@method isNative
		*	@return Boolean
		**/
		isNative: function() {
			return (this.getValue() instanceof Backbone.Model ||
				this.getValue() instanceof Backbone.Collection ||
				this.getValue() instanceof Backbone.View ||
				this.getValue() instanceof Backbone.Router);
		},

		/**
		*	Returns true if expression matches a bone nomenclature
		*	@public
		*	@override
		*	@method isAnnotation
		*	@param expr {String} expression to be evaluated
		*	@return Boolean
		**/
		isAnnotation: function(expr) {
			return (Bone.__super__.isAnnotation.apply(this, arguments) &&
				(expr.indexOf(Bone.TYPE.bone) !== -1) || (expr.indexOf(Bone.TYPE.ref) !== -1)));
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Bone',

		/**
		*	@static
		*	@property TYPE
		*	@type Object
		**/
		TYPE: {
			bone: 'bone!',
			ref: 'bone-ref!'
		}

	}));

	return Bone;

});

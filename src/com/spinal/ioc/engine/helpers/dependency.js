/**
*	@module com.spinal.ioc.engine.helpers
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/exception/ioc/dependency',
	'util/object'], function(DependencyException, ObjectUtil) {

	/**
	*	Class Dependency
	*	@namespace com.spinal.ioc.engine.helpers
	*	@class com.spinal.ioc.engine.helpers.Dependency
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.util.exception.ioc.DependencyException
	**/
	var Dependency = Spinal.namespace('com.spinal.ioc.engine.helpers.Dependency', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param attrs {Object} attributes
		*	@return com.spinal.ioc.engine.helpers.Dependency
		**/
		initialize: function(attrs) {
			attrs || (attrs = {});
			this.valid(attrs);
			Dependency.__super__.initialize.apply(this, arguments);
			return _.extend(this, attrs, { resolved: false });
		},

		/**
		*	Validate constructor parameters
		*	@public
		*	@throws Error
		*	@method valid
		*	@param attrs {Object} attributes
		**/
		valid: function(attrs) {
			if(!_.defined(attrs.target) || (!ObjectUtil.isRealObject(attrs.target) && !_.isArray(attrs.target)))
				throw new DependencyException('TargetRequired');
			if(!_.defined(attrs.property)) throw new DependencyException('PropertyRequired');
			if(!attrs.target[attrs.property]) throw new DependencyException('UndefinedTargetProperty');
			if(!attrs.bone) throw new DependencyException('UndefinedBoneReference');
		},

		/**
		*	Retrieves engine
		*	@public
		*	@method getEngine
		*	@return com.spinal.ioc.engine.Engine
		**/
		getEngine: function() {
			return this.bone.getEngine();
		},

		/**
		*	Default Resolve strategy
		*	@public
		*	@method resolve
		*	@param injector {com.spinal.ioc.engine.helpers.Injector} injector reference
		*	@return com.spinal.ioc.engine.helpers.Dependency
		**/
		resolve: function(injector) {
			if(this.isResolved()) return this;
			return this.canResolve() ? injector.inject(this) : injector.hold(this);
		},

		/**
		*	Returns true if this dependency can be resolved
		*	@public
		*	@method canResolve
		*	@return Boolean
		**/
		canResolve: function() {
			var m = this.getCompound();
			if(_.isObject(m)) return true;
			var bone = this.getEngine().bone(m);
			return (_.defined(bone) && (!bone.isModule() || bone.isCreated()));
		},

		/**
		*	Retrieves dependency
		*	@public
		*	@method get
		*	@return Object
		**/
		get: function() {
			if(!(m = this.getCompound())) return null;
			var bone = this.getEngine().bone(_.isObject(m) ? m.id : m);
			return (bone && _.isObject(m)) ? bone.bone()[m.method] : bone.bone();
		},

		/**
		*	Extracts dependency id from dependency expression
		*	@public
		*	@method getId
		*	@return String
		**/
		getId: function() {
			var expr = this.getExpression(), boneExpr = this.bone.getBoneExpression(), pos = expr.indexOf(boneExpr);
			return (pos === 0) ? expr.substring((pos + boneExpr.length), expr.length) : null;
		},

		/**
		*	Extracts Compound Dependency from dependency expression if exist
		*	@public
		*	@method getCompound
		*	@return Object
		**/
		getCompound: function() {
			if(!(id = this.getId())) return null;
			var compound = id.split('.');
			return (compound.length === 2) ? { id: compound[0], method: compound[1] } : id;
		},

		/**
		*	Retrieves dependency expression
		*	@public
		*	@method getExpression
		*	@return String
		**/
		getExpression: function() {
			return this.expression;
		},

		/**
		*	Retrieves dependency target
		*	@public
		*	@method getTarget
		*	@return Object
		**/
		getTarget: function() {
			return this.target;
		},

		/**
		*	Retrieves dependency target property
		*	@public
		*	@method getProperty
		*	@return String
		**/
		getProperty: function() {
			return this.property;
		},

		/**
		*	Returns true if this dependency was resolved, otherwise false
		*	@public
		*	@method isResolved
		*	@return Boolean
		**/
		isResolved: function() {
			return this.resolved;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Dependency'

	}));

	return Dependency;

});

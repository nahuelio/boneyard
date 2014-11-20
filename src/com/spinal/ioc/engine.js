/**
*	@module com.spinal.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
		'util/adt/collection',
		'util/exception/context'], function(Context, Collection, ContextException) {

	/**
	*	Bone Engine Class
	*	@namespace com.spinal.ioc
	*	@class com.spinal.ioc.Engine
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.Context
	*	@requires com.spinal.util.adt.Collection
	*	@requires com.spinal.util.exception.ContextException
	**/
	var Engine = Spinal.namespace('com.spinal.ioc.Engine', Spinal.SpinalClass.inherit({

		/**
		*	Main Spec root reference
		*	@public
		*	@property root
		*	@type {Object}
		**/
		root: {},

		/**
		*	List of specs
		*	@public
		*	@property specs
		*	@type {com.spinal.util.adt.Collection}
		**/
		specs: null,

		/**
		*	Async Module Factory
		*	@public
		*	@property factory
		*	@type {com.spinal.util.AsyncFactory}
		**/
		factory: null,

		/**
		*	Supported annotations
		*	@public
		*	@property annotations,
		*	@type Object
		**/
		annotations: {
			_id: 'id',
			_specs: 'specs',
			_ready: 'ready'
		},

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param root {Object} reference to the spec root
		*	@param factory {com.spinal.util.factories.AsyncFactory} factory reference
		*	@return {com.spinal.ioc.Engine}
		**/
		initialize: function(factory) {
			if(!factory) throw new ContextException('FactoryNotDeclared', { clazz: Engine.NAME });
			this.factory = factory;
			this.specs = new Collection([]);
			// FIXME: Improve a little bit this
			this.__id = (Engine.PREFIX + this.annotations._id);
			this.__specs = (Engine.PREFIX + this.annotations._specs);
			this.__ready = (Engine.PREFIX + this.annotations._ready);
			return this;
		},

		/**
		*	Performs validations against a given spec
		*	@private
		*	@method _valid
		*	@param spec {Object} spec reference
		*	@return Boolean
		**/
		_valid: function(spec) {
			if(!_.isObject(spec)) throw new ContextException('InvalidSpecFormat');
			if(!spec[this.__id]) throw new ContextException('SpecIdRequired');
		},

		/**
		*	Merges a new spec into the root and adds it into the specs collection
		*	Additionally, if there is any $ready annotation in the new spec, this method will merge it.
		*	@private
		*	@method _addSpec
		*	@param spec {Object} spec reference
		**/
		_addSpec: function(spec) {
			_.extend(this.root, _.omit(spec, this.__id, this.__specs, this.__ready));
			if(this.specs.add(spec[this.__id]) && spec[this.__ready]) {
				if(_.isUndefined(this.root[this.__ready])) this.root[this.__ready] = [];
				this.root[this.__ready] = _.union(this.root[this.__ready], spec[this.__ready]);
			}
		},

		/**
		*	Build specs into a single object unit suitable for querying by this class
		*	This method is also responsible to build composite spec trees by merging them
		*	into a single object to speed up querying and reducing the amount of nesting loops.
		*	@public
		*	@method build
		*	@param spec {Object} spec
		*	@return {com.spinal.ioc.Engine}
		**/
		build: function(spec) {
			this._valid(spec);
			if(!this.specs.contains(spec[this.__id])) this._addSpec(spec);
			if(spec[this.__specs]) this.invoke('build', spec[this.__specs]);
			return this;
		},

		/**
		*	Checks if any of the actions declared in the ready annotation were completed.
		*	If $ready annotation is not defined or it's not an array, it returns true.
		*	@public
		*	@method ready
		*	@return Boolean
		**/
		ready: function() {
			return (this.root.$ready &&
				_.isArray(this.root.$ready) &&
				_.every(_.pluck(this.root.$ready, '_$ready')));
		},

		/**
		*	Perform a look up of bones by a predicate passed as parameter.
		*	If a bone is specified as a extra argument, it will narrow the search down to the specific bone context.
		*	@public
		*	@method getBonesBy
		*	@param finder {Function} predicate evaluation
		*	@return Array
		**/
		getBonesBy: function(finder) {
			if(!this.root) return [];
			return _.compact(_.map(this.root, function(b, id) { return (finder(b, id)) ? this.getBone(id) : null; }, this));
		},

		/**
		*	Perform a bone look up by id.
		*	If the bone is a module and it was already created, this method will return the instance of the bone.
		*	@public
		*	@method getBone
		*	@param id {String} bone id
		*	@return Object
		**/
		getBone: function(id) {
			return (this.root && this.root[id]) ?
				((this.isCreated(this.root[id])) ? this.root[id]._$created : this.root[id]) : null;
		},

		/**
		*	Perform a look up of bones by className passed as parameter.
		*	In order to use this method, the context must be completly initialized.
		*	@public
		*	@method findBonesByType
		*	@param type {String} bone type
		*	@return Array
		**/
		getBonesByClass: function(className) {
			return this.getBonesBy(_.bind(function(b, id) {
				return (this.isModule(b) && this.isCreated(b) && b._$created.constructor.NAME === className);
			}, this));
		},

		/**
		*	Perform a look up of bones by type passed as parameter.
		*	In order to use this method, the context must be completly initialized.
		*	@public
		*	@method getBonesByType
		*	@param type {String} bone type
		*	@return Array
		**/
		getBonesByType: function(type) {
			return this.getBonesBy(_.bind(function(b, id) {
				return (this.isModule(b) && this.isCreated(b)) ? (this.getBone(id) instanceof type) : (b instanceof type);
			}, this));
		},

		/**
		*	Checks if the bone defined was declared as a module.
		*	@public
		*	@method isModule
		*	@param bone {Object} current bone to be evaluated
		*	@return Boolean
		**/
		isModule: function(bone) {
			return (bone && bone.$module);
		},

		/**
		*	Checks if the bone was succesufuly created
		*	@public
		*	@method isCreated
		*	@param bone {Object} current bone to be evaluated
		*	@return Boolean
		**/
		isCreated: function(bone) {
			return (bone && bone._$created);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Engine',

		/**
		*	@static
		*	@property PREFIX
		*	@type String
		**/
		PREFIX: '$'

	}));

	return Engine;

});

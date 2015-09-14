/**
*	@module com.spinal.ioc.engine.helpers
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/query',
	'util/adt/collection',
	'util/exception/ioc/spec'], function(Query, Collection, SpecException) {

	/**
	*	Class Specs
	*	@namespace com.spinal.ioc.engine.helpers
	*	@class com.spinal.ioc.engine.helpers.Specs
	*	@extends com.spinal.util.adt.Collection
	*
	*	@requires com.spinal.ioc.engine.helpers.query
	*	@requires com.spinal.util.adt.Collection
	*	@requires com.spinal.util.exception.ioc.SpecException
	**/
	var Specs = Spinal.namespace('com.spinal.ioc.engine.helpers.Specs', Collection.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return com.spinal.ioc.engine.helpers.Specs
		**/
		initialize: function() {
			this.proxy();
			return Specs.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Proxifies Query methods into this collection
		*	@public
		*	@method proxy
		*	@return com.spinal.ioc.engine.helpers.Specs
		**/
		proxy: function() {
			this.proxify(Query.new(),
				'getSpec', 'getAllSpecs', 'getAllBones',
				'getBone', 'getBonesByClass', 'getBonesByType',
				'getPlugins', 'isModule', 'isCreated', 'isNative');
			return this;
		},

		/**
		*	Validate spec being added into this Collection
		*	@private
		*	@override
		*	@method _valid
		*	@param spec {Object} spec metadata
		*	@return Boolean
		**/
		_valid: function(spec) {
			if(Specs.__super__._valid.apply(this, arguments)) throw new SpecException('SpecNotDefined');
			if(!_.isObject(spec)) throw new SpecException('InvalidSpecFormat');
			if(!spec.$id) throw new SpecException('RequiredSpecId');
			return true;
		},

		/**
		*	Add an spec element and returns it
		*	@public
		*	@override
		*	@method add
		*	@param spec {Object} spec
		*	@param opts {Object} extra options
		*	@optional
		*	@return Object
		**/
		add: function(spec, opts) {
			// Resolve $ready????
			return Specs.__super__.add.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Specs'

	}));

	return Specs;

});

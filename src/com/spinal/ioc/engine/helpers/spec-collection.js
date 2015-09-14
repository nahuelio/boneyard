/**
*	@module com.spinal.ioc.engine.helpers
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/adt/collection',
	'util/exception/ioc/spec'], function(Collection, SpecException) {

	/**
	*	Class SpecCollection
	*	@namespace com.spinal.ioc.engine.helpers
	*	@class com.spinal.ioc.engine.helpers.SpecCollection
	*	@extends com.spinal.util.adt.Collection
	*
	*	@requires com.spinal.util.adt.Collection
	**/
	var SpecCollection = Spinal.namespace('com.spinal.ioc.engine.helpers.SpecCollection', Collection.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return com.spinal.ioc.engine.helpers.SpecCollection
		**/
		initialize: function() {
			return SpecCollection.__super__.initialize.apply(this, arguments);
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
			if(SpecCollection.__super__._valid.apply(this, arguments)) throw new SpecException('SpecNotDefined');
			if(!_.isObject(spec)) throw new SpecException('InvalidSpecFormat');
			if(!spec.$id) throw new SpecException('RequiredSpecId');
			return true;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'SpecCollection'

	}));

	return SpecCollection;

});

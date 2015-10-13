/**
*	@module com.spinal.ioc.engine.helpers
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/bone',
	'util/adt/collection'], function(Bone, Collection) {

	/**
	*	Class TSort
	*	@namespace com.spinal.ioc.engine.helpers
	*	@class com.spinal.ioc.engine.helpers.TSort
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.SpinalClass
	*	@requires com.spinal.util.adt.collection
	**/
	var TSort = Spinal.namespace('com.spinal.ioc.engine.helpers.TSort', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.spinal.ioc.engine.helpers.TSort
		**/
		initialize: function() {
			this.bones = new Collection([], { interface: Bone });
			return TSort.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Resets topological sort collection
		*	@public
		*	@method reset
		*	@return com.spinal.ioc.engine.helpers.TSort
		**/
		reset: function() {
			this.bones.reset();
			return this;
		},

		/**
		*	Adds dependency bones into topological dependency graph
		*	@public
		*	@method add
		*	@param bones {Array} list of bones
		*	@return com.spinal.ioc.engine.helpers.TSort
		**/
		add: function(bones) {
			this.bones.addAll(bones);
			return this;
		},

		/**
		*	Sorts and returns collection of bones based on topological dependency graph.
		*	@public
		*	@method sort
		*	@return Array
		**/
		sort: function() {
			var out = [], marks = {};
			this.bones.each(function(bone) {
				if(!marks[bone.getId()]) out.push(this.visit(marks, bone));
			}, this);
			return out;
		},

		/**
		*	Determine if the dependency graph has circular dependencies.
		*	If so, this method will throw an error, otherwise will resolve sorting by return the bone
		*	This method uses recursion.
		*	@public
		*	@throws Error
		*	@method visit
		*	@param marks {Array} marks reference
		*	@param node {Object} node reference
		*	@return Object
		**/
		visit: function(marks, bone) {
			// CONTINUE HERE...
			if(marks[bone.getId()] === TSort.TYPE.VOLATILE)
				throw new Error('Circular dependency detected. It\'s not possible to derive a topological sort.');
			if(marks[bone.getId()]) return;
			if(bone.getDependencies) {
				marks[bone.getId()] = TSort.TYPE.VOLATILE;
				bone.getDependencies().each(_.bind(this.visit, this, marks));
			} else {
				return bone.getId();
			}
			marks[bone.getId()] = TSort.TYPE.PERMANENT;
			return bone.getId();
		}

	}, {

		/**
		*	Class Name
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'TSort',

		/**
		*	Comment
		**/
		TYPE: {
			VOLATILE: 'volatile',
			PERMANENT: 'permanent'
		}

	}));

	return TSort;

});

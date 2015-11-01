/**
*	@module com.spinal.ioc.engine.helpers
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	Class TSort
	*	@namespace com.spinal.ioc.engine.helpers
	*	@class com.spinal.ioc.engine.helpers.TSort
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.SpinalClass
	**/
	var TSort = Spinal.namespace('com.spinal.ioc.engine.helpers.TSort', Spinal.SpinalClass.inherit({

		/**
		*	Graph nodes
		*	@public
		*	@property nodes
		*	@type Object
		**/
		nodes: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.spinal.ioc.engine.helpers.TSort
		**/
		initialize: function() {
			this.reset();
			return TSort.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Resets topological sort collection
		*	@public
		*	@method reset
		*	@return com.spinal.ioc.engine.helpers.TSort
		**/
		reset: function() {
			this.nodes = {};
			return this;
		},

		/**
		*	Default Add handler
		*	@public
		*	@method onAdd
		*	@param nodes {Array} list of nodes
		**/
		onAdd: function(nodes) {
			nodes.forEach(function(node) { if(!this.nodes[node]) return this.nodes[node] = []; }, this);
		},

		/**
		*	Clean up duplicated dependencies except for the first one and return it.
		*	@public
		*	@method clean
		*	@param nodes {Array} dependency graph reference
		*	@return Array
		**/
		clean: function(nodes) {
			return [_.first(nodes)].concat(_.unique(nodes.slice(1)));
		},

		/**
		*	Adds dependency nodes into topological dependency graph
		*	@public
		*	@method add
		*	@param nodes {Array} list of nodes
		*	@return com.spinal.ioc.engine.helpers.TSort
		**/
		add: function(nodes) {
			nodes || (nodes = []);
			nodes = this.clean(nodes);
			this.onAdd(nodes);
			for(var i = 1; i < nodes.length; i++)
				this.nodes[nodes[i]].push(nodes[i - 1]);
			return this;
		},

		/**
		*	Sorts and returns collection of nodes based on topological dependency graph.
		*	@public
		*	@method sort
		*	@return Array
		**/
		sort: function() {
			var out = [], marks = {};
			_.each(this.nodes, function(value, key) {
				if(!marks[key]) this.visit(out, marks, key);
			}, this);
			return out.reverse();
		},

		/**
		*	Determine if the dependency graph has circular dependencies.
		*	If so, this method will throw an error, otherwise will resolve sorting and returning each node.
		*	This method uses recursion.
		*	@public
		*	@throws Error
		*	@method visit
		*	@param marks {Array} marks reference
		*	@param node {Object} node reference
		*	@return Object
		**/
		visit: function(out, marks, key) {
			if(marks[key] === TSort.TYPE.VOLATILE) {
				throw new Error('Circular dependency detected. It\'s not possible to derive a topological sort.');
			} else if(marks[key]) {
				return;
			}
			marks[key] = TSort.TYPE.VOLATILE;
			this.nodes[key].forEach(_.bind(this.visit, this, out, marks));
			marks[key] = TSort.TYPE.PERMANENT;
			return out.push(key);
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
		*	TSort Types
		*	@static
		*	@property TYPE
		*	@type Object
		**/
		TYPE: {
			VOLATILE: 'volatile',
			PERMANENT: 'permanent'
		}

	}));

	return TSort;

});

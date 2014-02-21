/**
*	Spinal View Class
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@namespace {Spinal.ui.View}
*	@class View
*	@classdesc Define a generic interface that represents a view
*	@depends {Backbone.View}
**/

Spinal.namespace('spinal.ui.View', Spinal.inherit({
	
	/**
	*	Initialize
	*	@public
	*	@method initialize
	*	@returns {Spinal.ui.View}
	**/
	initialize: function() { return this; }
	
}, {
	
	/**
	*	Class Name
	*	@static
	*	@var {String} NAME
	**/
	NAME: 'Spinal.View',
	
	/**
	*	Events
	*	@static
	*	@var {String} EVENTS
	**/
	EVENTS: {}
	
}));
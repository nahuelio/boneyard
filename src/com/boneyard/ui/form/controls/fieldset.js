/**
*	@module com.boneyard.ui.form.controls
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container'], function(Container) {

	/**
	*	Class Fieldset
	*	@namespace com.boneyard.ui.form.controls
	*	@class com.boneyard.ui.form.controls.Fieldset
	*	@extends com.boneyard.ui.Container
	*
	*	@requires com.boneyard.ui.Container
	**/
	var Fieldset = Boneyard.namespace('com.boneyard.ui.form.controls.Fieldset', Container.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-fieldset',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'fieldset'

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Fieldset'

	}));

	return Fieldset;

});

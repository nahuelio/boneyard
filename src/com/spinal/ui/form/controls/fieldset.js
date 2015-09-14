/**
*	@module com.spinal.ui.form.controls
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container'], function(Container) {

	/**
	*	Fieldset Class
	*	@namespace com.spinal.ui.form.controls
	*	@class com.spinal.ui.form.controls.Fieldset
	*	@extends com.spinal.ui.Container
	*
	*	@requires com.spinal.ui.Container
	**/
	var Fieldset = Spinal.namespace('com.spinal.ui.form.controls.Fieldset', Container.inherit({

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

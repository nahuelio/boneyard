/**
*	@module com.spinal.ui.form.controls
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/form/controls/input'], function(Input) {

	/**
	*	Hidden Class
	*	@namespace com.spinal.ui.form.controls
	*	@class com.spinal.ui.form.controls.Hidden
	*	@extends com.spinal.ui.form.controls.Input
	*
	*	@requires com.spinal.ui.form.controls.Input
	**/
	var UIHidden = Spinal.namespace('com.spinal.ui.form.controls.Hidden', Input.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-hidden',

		/**
		*	Input's default type
		*	@private
		*	@property _type
		*	@type String
		**/
		_type: Input.TYPES.hidden

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'UIHidden'

	}));

	return UIHidden;

});

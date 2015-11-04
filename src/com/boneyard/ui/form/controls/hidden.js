/**
*	@module com.boneyard.ui.form.controls
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/form/controls/input'], function(Input) {

	/**
	*	Class Hidden
	*	@namespace com.boneyard.ui.form.controls
	*	@class com.boneyard.ui.form.controls.Hidden
	*	@extends com.boneyard.ui.form.controls.Input
	*
	*	@requires com.boneyard.ui.form.controls.Input
	**/
	var UIHidden = Boneyard.namespace('com.boneyard.ui.form.controls.Hidden', Input.inherit({

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

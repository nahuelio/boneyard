/**
*	@module com.spinal.ui.form.controls
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/form/controls/input'], function(Input) {

	/**
	*	Textarea Class
	*	@namespace com.spinal.ui.form.controls
	*	@class com.spinal.ui.form.controls.Textarea
	*	@extends com.spinal.ui.form.controls.Input
	*
	*	@requires com.spinal.ui.form.controls.Input
	**/
	var UITextarea = Spinal.namespace('com.spinal.ui.form.controls.Textarea', Input.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-textarea',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'textarea',

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param opts {Object} view options
		*	@return {com.spinal.ui.form.controls.Textarea}
		**/
		initialize: function(opts) {
			delete this._type;
			UITextarea.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Render Textarea
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.form.controls.Textarea}
		**/
		render: function(opts) {
			UITextarea.__super__.render.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'UITextarea'

	}));

	return UITextarea;

});

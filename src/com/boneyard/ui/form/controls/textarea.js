/**
*	@module com.boneyard.ui.form.controls
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/form/controls/input'], function(Input) {

	/**
	*	Class Textarea
	*	@namespace com.boneyard.ui.form.controls
	*	@class com.boneyard.ui.form.controls.Textarea
	*	@extends com.boneyard.ui.form.controls.Input
	*
	*	@requires com.boneyard.ui.form.controls.Input
	**/
	var UITextarea = Boneyard.namespace('com.boneyard.ui.form.controls.Textarea', Input.inherit({

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
		*	@return com.boneyard.ui.form.controls.Textarea
		**/
		initialize: function(opts) {
			delete this._type;
			UITextarea.__super__.initialize.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Textarea'

	}));

	return UITextarea;

});

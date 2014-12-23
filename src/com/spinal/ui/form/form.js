/**
*	@module com.spinal.ui.form
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container'], function(Container) {

	/**
	*	Form Class
	*	@namespace com.spinal.ui.form
	*	@class com.spinal.ui.form.Form
	*	@extends com.spinal.ui.Container
	*
	*	@requires com.spinal.ui.Container
	**/
	var UIForm = Spinal.namespace('com.spinal.ui.form.Form', View.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-form',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'form',

		/**
		*	Form's action
		*	@private
		*	@property _action
		*	@type String
		**/
		_action: '#',

		/**
		*	Form's method
		*	@private
		*	@property _method
		*	@type String
		**/
		_method: '',

		/**
		*	Form's encoding type
		*	@private
		*	@property _enctype
		*	@type String
		**/
		_enctype: '',

		/**
		*	Form's validator
		*	@private
		*	@property _validator
		*	@type {com.spinal.util.Validator}
		**/
		_validator: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param options {Object} view options
		*	@return {com.spinal.ui.form.Form}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			_.extend(this, StringUtil.toPrivate(_.pick(opts, 'action', 'method', 'enctype', 'validator')));
			UIForm.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Validates Form current state
		*	@public
		*	@method validate
		*	@return Boolean
		**/
		validate: function() {
			return (this._validator) ? this._validator.validate() : true;
		},

		/**
		*	Render Form
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.form.Form}
		**/
		render: function(opts) {
			UIForm.__super__.render.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'UIForm',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event validate
			**/
			validate: 'com:spinal:ui:form:validate'
		}

	}));

	return UIForm;

});

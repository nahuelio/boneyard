/**
*	@module com.boneyard.ui.basic
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/basic/paragraph'], function(Paragraph) {

	/**
	*	Class Span
	*	@namespace com.boneyard.ui.basic
	*	@class com.boneyard.ui.basic.Span
	*	@extends com.boneyard.ui.basic.Paragraph
	*
	*	@requires com.boneyard.ui.basic.Paragraph
	**/
	var UISpan = Boneyard.namespace('com.boneyard.ui.basic.Span', Paragraph.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-span',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'span'

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Span'

	}));

	return UISpan;

});

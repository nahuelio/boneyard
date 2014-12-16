/**
*	@module com.spinal.ui.table
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container'], function(Container) {

	/**
	*	TableElement Class
	*	@namespace com.spinal.ui.basic
	*	@class com.spinal.ui.table.TableElement
	*	@extends com.spinal.ui.Container
	*
	*	@requires com.spinal.ui.Container
	**/
	var UITableElement = Spinal.namespace('com.spinal.ui.table.TableElement', Container.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-table-t',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 't',

		/**
		*	TableElement's default section type
		*	@private
		*	@property _t
		*	@type String
		**/
		_t: 'd',

		/**
		*	Constructor
		*	@method constructor
		*	@param [options] {Object} View Options
		**/
		constructor: function(options) {
			options || (options = {});
			if(options.t) this._t = options.t;
			this.tagName = (this.tagName + this._t);
			this.className = (this.className + this._t);
			UITableElement.__super__.constructor.apply(this, arguments);
		},

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param opts {Object} view options
		*	@return {com.spinal.ui.table.TableElement}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			UITableElement.__super__.initialize.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'TableElement'

	}));

	return UITableElement;

});

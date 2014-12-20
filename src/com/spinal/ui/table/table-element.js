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
		className: 'ui-table-',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: '',

		/**
		*	TableElement's default section type
		*	@private
		*	@property _t
		*	@type String
		**/
		_t: '',

		/**
		*	Constructor
		*	@method constructor
		*	@param [options] {Object} View Options
		**/
		constructor: function(options) {
			options || (options = {});
			if(!options.el) {
				this._t = (options.t) ? options.t : UITableElement.TYPES.row;
				this.tagName = this._t;
			}
			this.className = (!options.el) ? (this.className + this._t) : '';
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
		NAME: 'TableElement',

		/**
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			head: 'th',
			row: 'td',
			column: 'tr'
		}

	}));

	return UITableElement;

});

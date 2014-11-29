//	SpinalJS Util@0.0.1 (c) 2014 Patricio Ferreira <3dimentionar@gmail.com>, 3dimention.com
//	SpinalJS may be freely distributed under the MIT license.
//	For all details and documentation: http://3dimention.github.io/spinal
/**
*	@module com.spinal.util.exception
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('util/exception/exception',['core/spinal'], function(Spinal) {

	/**
	*	Extend functionality of Spinal Core to create custom exceptions (Errors)
	*	@namespace com.spinal.util.exception
	*	@class com.spinal.util.exception.SpinalException
	**/
	var SpinalException = Spinal.namespace('com.spinal.util.exception.SpinalException', function(type) {
		this.initialize.apply(this, arguments);
		return this;
	});

	Spinal.extend(SpinalException.prototype, new Error(), {

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param type {String} exception type
		*	@param type {Object} key/value pairs to be used to template the message
		*	@return {com.spinal.util.exception.SpinalException}
		**/
		initialize: function(type, tpl) {
			this.name = (this.constructor.NAME) ? this.constructor.NAME : 'SpinalException';
			this.type = (!_.isUndefined(this.constructor.TYPES[type])) ? type : 'Generic';
			this.message = this.getMessage(this.type, tpl);
			return this;
		},

		/**
		*	@public
		*	@method getMessage
		*	@param type {String} exception type
		*	@param tpl {Object} key/value pairs to be used to template the message
		*	@return String
		**/
		getMessage: function(type, tpl) {
			return SpinalException.getMessage.apply(this, arguments);
		}

	});

	/**
	*	@static
	*	@property NAME
	*	@type String
	**/
	SpinalException.NAME = 'SpinalException';

	/**
	*	__Type List__
	*
	*		Generic
	*	@static
	*	@property TYPES
	*	@type Object
	**/
	SpinalException.TYPES = {
		Generic: _.template('Generic Exception'),
		StaticClass: _.template('Class cannot be instanciated. All methods and variable members are static.')
	};

	/**
	*	@static
	*	@method getMessage
	*	@param type {String} exception type
	*	@param tpl {Object} key/value pairs to be used to template the message
	*	@return String
	**/
	SpinalException.getMessage = function(type, tpl) {
		var ctx = (this instanceof SpinalException) ? this.constructor : this;
		return (type && ctx.TYPES[type]) ?
			ctx.TYPES[type]((!_.isUndefined(tpl) ? tpl : {})) :
			'Unknown Exception Message';
	},

	/**
	*	@static
	*	@method inherit
	*	@return Function
	**/
	SpinalException.inherit = Spinal._inherit;

	return SpinalException;

});

/**
*	@module com.spinal.util
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('util/string',['core/spinal',
		'util/exception/exception'], function(Spinal, SpinalException) {

	/**
	*	StringUtil class provides a bunch of string utilities.
	*	@namespace com.spinal.util
	*	@class com.spinal.util.StringUtil
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.util.exception.Exception
	**/
	var StringUtil = Spinal.namespace('com.spinal.util.StringUtil', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.StringUtil}
		**/
		initialize: function() {
			throw new SpinalException('StaticClass');
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'StringUtil',

		/**
		*	Returns a UUID (Universally Unique Identifier)
		*	@static
		*	@method uuid
		*	@return String
		**/
		uuid: function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0,
					v = (c === 'x') ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		},

		/**
		*	Convert a String in dot notation format into a JSON object
		*	@static
		*	@method strToJSON
		*	@param expr {String} dot notation
		*	@retur Object
		**/
		strToJSON: function(expr) {
			if(!expr || !_.isString(expr) || expr === '') return {};
			var p = {}, o = p, ps = expr.split('.');
			for(var i = 0; i < ps.length; i++) {
				p[ps[i]] = {}; p = p[ps[i]];
				if(i === (ps.length-1)) delete p;
			}
			return o;
		},

		/**
		*	Perform a query using a string (dot notation) on the obj passed as parameter.
		*	If the input doesn't match, it returns null.
		*	@static
		*	@method search
		*	@param query {String} query in dot notation format
		*	@param obj {Object} JSON object ref
		*	@return Object
		**/
		search: function(query, obj) {
			if(!query || !obj || query === '') return null;
			if(_.isEmpty(obj)) return obj;
			var q = query.split("."), o = obj;
		    for (var i = 0; i < q.length; i++) {
				if(!o[q[i]]) break;
				o = o[q[i]];
			}
		    return o;
		}

	}));

	return StringUtil;

});

/**
*	@module com.spinal.util
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('util/schema',['core/spinal'], function(Spinal) {

	/**
	*	Define a Generic Schema definition structure to validate and parse model data
	*	@namespace com.spinal.util
	*	@class com.spinal.util.Schema
	*	@extends Backbone.Model
	**/
	var Schema = Spinal.namespace('com.spinal.util.Schema', Backbone.Model.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.mvc.Model}
		**/
		initialize: function() {
			return Schema.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Schema Set checks schema data types before taking the properties
		*	@public
		*	@method parse
		*	@param key {Object} Key String or Object (hashmap) to be set as properties.
		*	@param value {Object} Value to be set for the key property specified in p
		*	@return Object
		**/
		parse: function(key, value) {
			var attrs = {};
			if(_.isString(key)) attrs[key] = value;
			if(_.isObject(key)) attrs = key;
			_.each(attrs, _.bind(function(v, k) {
				var m = ('_' + attrs[k]); attrs[v] = (attrs[k] && this[m]) ? this[m](v) : v;
			}, this));
			return attrs;
		},

		/**
		*	Boolean data type parser
		*	@private
		*	@method _boolean
		*	@param value {Object} value to be transform
		*	@return Boolean
		**/
		_boolean: function(value) {
			return (value === 'true') ? true : (value === 'false') ? false : value;
		},

		/**
		*	Integer data type parser
		*	@private
		*	@method _int
		*	@param value {Object} value to be transform
		*	@return Number
		**/
		_int: function(value) {
			return parseInt(value, 10);
		},

		/**
		*	Float data type parser
		*	@private
		*	@method _float
		*	@param value {Object} value to be transform
		*	@return Number
		**/
		_float: function(value) {
			return parseFloat(value);
		},

		/**
		*	String data type parser
		*	@private
		*	@method _string
		*	@param value {Object} value to be transform
		*	@return String
		**/
		_string: function(value) {
			return value.toString();
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Schema'

	}));

	return Schema;

});

/**
*	@module com.spinal.util.http
*	@author Patricio Ferreira | https://github.com/kuakman
**/
define('util/http/ajax-http',['core/spinal'], function(Spinal) {

	/**
	*	HTTP Ajax based Controller Class
	*	Defines a Basic HTTP Controller structure to make ajax request calls
	*	This interface supports the following HTTP methods: GET, POST, PUT AND DELETE.
	*	Content Types: XML, JSON AND HTML.
	*
	*	@namespace com.spinal.util
	*	@class com.spinal.util.http.AjaxHttp
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	**/
	var AjaxHttp = app.namespace('com.spinal.util.http.AjaxHttp', Spinal.SpinalClass.inherit({

		/**
		*	Enpoint path
		*	@public
		*	@property endpoint
		*	@type String
		**/
		endpoint: '/',

		/**
		*	Service
		*	@public
		*	@property service
		*	@type {com.spinal.core.Spinal}
		**/
		service: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.http.AjaxHttp}
		**/
		initialize: function() {
			if(!this.endpoint) throw new Error(this.toString() + ' requires an endpoint path');
			if(!this.service) throw new Error(this.toString() + ' requires a service instance');
			this.call = _.compose(this.call, this.before);
			return this;
		},

		/**
		*	Handle Options
		*	@public
		*	@method handle
		*	@param req {Object} request data reference
		*	@param [opts] {Object} options
		*	@return Object
		**/
		_handle: function(req, opts) {
			if(opts.after) req.__after__ = opts.after;
			if(opts.modelOpts) req.modelOpts = opts.modelOpts;
			return opts;
		},

		/**
		*	Performs a HTTP Request over ajax using method GET
		*	@private
		*	@method	_get
		*	@param req {Object} request data reference
		*/
		_get: function(req) {
			$.ajax(_.extend({
				url: (this.endpoint + req.action + Backbone.Util.createQueryString(req.params)),
				type: Controller.VERBS.GET,
				success: _.bind(this._success, this, req),
				error: _.bind(this._fail, this, req)
			}, req.opts));
		},

		/**
		*	Performs a HTTP Request over ajax using method POST
		*	@private
		*	@method _post
		*	@param req {Object} request data reference
		**/
		_post: function(req) {
			$.ajax(_.extend({
				url: (this.endpoint + req.action),
				type: Controller.VERBS.POST,
				data: req.params,
				success: _.bind(this._success, this, req),
				error: _.bind(this._fail, this, req)
			}, req.opts));
		},

		/**
		*	Performs a HTTP Request over ajax using method PUT
		*	@private
		*	@method _put
		*	@param req {Object} request data reference
		**/
		_put: function(req) {
			$.ajax(_.extend({
				url: (this.endpoint + req.action),
				type: Controller.VERBS.PUT,
				data: req.params,
				success: _.bind(this._success, this, req),
				error: _.bind(this._fail, this, req)
			}, req.opts));
		},

		/**
		*	Performs a HTTP Request over ajax using method DELETE
		*	@private
		*	@method _delete
		*	@param req {Object} request data reference
		**/
		_delete: function(req) {
			$.ajax(_.extend({
				url: (this.endpoint + req.action),
				type: Controller.VERBS.DELETE,
				data: req.params,
				success: _.bind(this._success, this, req),
				error: _.bind(this._fail, this, req)
			}, req.opts));
		},

		/**
		*	Default Success Ajax Handler
		*	@public
		*	@method success
		*	@param req {Object} request data reference
		*	@param res {Object} response reference
		*	@param textStatus {String} request status
		*	@param jqXHR {Object} Ajax Request object reference
		*	@return com.spinal.util.http.AjaxHttp
		**/
		_success: function(req, res, textStatus, jqXHR) {
			if(req.success) req.success.call(this.service, arguments);
			if(!req.skipSuccess) this.trigger(Controller.EVENTS.success, arguments);
			if(req.fireSuccess && _.isString(req.fireSuccess)) Backbone.trigger(req.fireSuccess, arguments);
			if(req.__after__) req.__after__(arguments);
			return this;
		},

		/**
		*	Default Fail Ajax Handler
		*	@public
		*	@method fail
		*	@param req {Object} request data reference
		*	@param res {Object} response reference
		*	@param textStatus {String} request status
		*	@param jqXHR {Object} Ajax Request object reference
		*	@return com.spinal.util.http.AjaxHttp
		**/
		_fail: function(req, res, textStatus, jqXHR) {
			if(req.fail) req.fail.call(this.service, arguments);
			if(!req.skipFail) this.trigger(Controller.EVENTS.fail, arguments);
			if(req.fireFail && _.isString(req.fireFail)) Backbone.trigger(req.fireFail, arguments);
			if(req.__after__) req.__after__(arguments);
			return this;
		},

		/**
		*	Before Execute Hook
		*	@public
		*	@method before
		*	@param req {Object} request data reference
		*	@param [opts] {Object} optional data
		*	@return Object
		**/
		before: function(req, opts) {
			opts || (opts = {});
			if(!req) return null;
			if(!req.action) return null;
			this._handle(req, opts);
			if(req.progress) req.progress(arguments);
			if(!req.skipProgress) this.trigger(Controller.EVENTS.progress, req, opts);
			return req;
		},

		/**
		*	Make Ajax Request Call
		*	@public
		*	@method call
		*	@param req {Object} request data reference
		*	@return com.spinal.util.http.AjaxHttp
		**/
		call: function(req) {
			if(req && req.method && req.action) {
				if(!req.params) req.params = {};
				if(_.contains(_.values(Controller.VERBS), req.method)) this['_' + req.method](req);
			}
			return this;
		}

	}, {

		/**
		*	Class Name
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'AjaxHttp',

		/**
		*	Http Verbs
		*	@static
		*	@property VERBS
		*	@type Object
		**/
		VERBS: {
			GET: 'get',
			POST: 'post',
			PUT: 'put',
			DELETE: 'delete'
		},

		/**
		*	Http Content types
		*	@static
		*	@property CONTENT_TYPES
		*	@type Object
		**/
		CONTENT_TYPES: {
			json: 'application/json',
			xml: 'application/xml',
			html: 'text/html'
		},

		/**
		*	Events
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event progress
			**/
			progress: 'com:spinal:util:http:progress',
			/**
			*	@event success
			**/
			success: 'com:spinal:util:http:success',
			/**
			*	@event fail
			**/
			fail: 'com:spinal:util:http:fail'
		}

	}));

	return AjaxHttp;

});

/**
*	@module com.spinal.util.exception
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('util/exception/factory',['core/spinal',
		'util/exception/exception'], function(Spinal, Exception) {

	/**
	*	Factory Exception Type
	*	@namespace com.spinal.util.exception
	*	@class com.spinal.util.exception.FactoryException
	*	@extends com.spinal.util.exception.Exception
	**/
	var FactoryException = Spinal.namespace('com.spinal.util.exception.FactoryException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.exception.FactoryException}
		**/
		initialize: function() {
			return FactoryException.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'FactoryException',

		/**
		*	__Type List__
		*
		*		Generic (inherited from com.spinal.util.exception.Exception)
		*		UnregisteredFactory
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			UnregisteredFactory: _.template('Factory <%= id %> not found. Unable to use factory method to instanciate class.')
		}

	}));

	return FactoryException;

});

/**
*	@module com.spinal.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('util/adt/iterator',['core/spinal'], function(Spinal) {

	/**
	*	Define a generic interface to communicate with a service in the cloud.
	*	@namespace com.spinal.util.adt
	*	@class com.spinal.util.adt.Iterator
	*	@extends com.spinal.core.SpinalClass
	**/
	var Iterator = Spinal.namespace('com.spinal.util.adt.Iterator', Spinal.com.spinal.core.SpinalClass.inherit({

		/**
		*	Internal Array
		*	@public
		*	@property collection
		*	@type Array
		**/
		collection: [],

		/**
		*	Cursor that points to an index inside the collection.
		*	@public
		*	@property _cur
		*	@type Number
		**/
		_cur: 0,

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.util.adt.Iterator}
		**/
		initialize: function() {
			return Iterator.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Set a new collection of elements
		*	@public
		*	@method set
		*	@param attrs {Object} attribu
		*	@return {com.spinal.util.adt.Iterator}
		**/
		set: function(arr) {
			if(!_.isArray(arr)) throw new Error(this.toString() + ' requires an array in order to be instanciate it.');
			return Iterator.__super__.set.apply(this, [{ collection: arr }]);
		},

		/**
		*	Returns true if there is still an element in the list at the current cursor position.
		*	@public
		*	@method hasNext
		*	@return Boolean
		**/
		hasNext: function() {
			return (this._cur <= (this.collection.length-1));
		},

		/**
		*	Returns the current element in the collection and move the cursor position 1 step forward.
		*	@public
		*	@method next
		*	@return Object
		**/
		next: function() {
			return (this._cur <= this.collection.length-1) ? this.collection[this._cur++] : null;
		},

		/**
		*	Reset the cursor to the beginning to the index 0.
		*	@public
		*	@chainable
		*	@method rewind
		*	@return {com.spinal.util.adt.Iterator}
		**/
		rewind: function() {
			this._cur = 0;
			return this;
		},

		/**
		*	Removes from the underlying collection the last element returned by this iterator
		*	@public
		*	@method remove
		*	@return Object
		**/
		remove: function() {
			if(this.collection.length > 0) {
				var removed = this.collection.splice(this._cur, 1)[0];
				this.trigger(Iterator.EVENTS.removed, { removed: removed, iterator: this });
			}
			return removed;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Iterator',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event removed
			**/
			removed: 'com:spinal:util:adt:iterator:removed'
		}

	}));

	return Iterator;

});

/**
*	@module com.spinal.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('util/adt/collection',['core/spinal', 'util/adt/iterator'], function(Spinal, Iterator) {

	/**
	*	Define a generic interface of a Collection
	*	@namespace com.spinal.util.adt
	*	@class com.spinal.util.adt.Collection
	*	@extends com.spinal.core.SpinalClass
	**/
	var Collection = Spinal.namespace('com.spinal.util.adt.Collection', Spinal.com.spinal.core.SpinalClass.inherit({

		/**
		*	Internal Array
		*	@public
		*	@property collection
		*	@type Array
		**/
		collection: null,

		/**
		*	Interface reference, usually a constructor function that identifies
		*	the types of object that this collection can contain.
		*	@private
		*	@property interface
		*	@type Function
		**/
		_interface: null,

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param initial {Array} initial elements in the collection.
		*	@param opts {Object} Additional options.
		*	@return {com.spinal.util.adt.Collection}
		**/
		initialize: function(initial, opts) {
			this.collection = [];
			Collection.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Validate that the element is an Object.
		*	@private
		*	@method _valid
		*	@param element {Object} element to be evaluated.
		*	@return Boolean
		**/
		_valid: function(element) {
			if(!element) return false;
			return true;
		},

		/**
		*	Set a new collection of elements
		*	@public
		*	@method set
		*	@param arr {Array} new collection to be replaced
		*	@return Boolean
		**/
		set: function(arr, opts) {
			opts || (opts = {});
			if(!this._valid(arr) || !_.isArray(arr)) return false;
			this.reset({ silent: true });
			if(opts.interface) this._interface = opts.interface;
			if(!_.isNull(this._interface)) {
				this.collection = _.compact(_.map(arr, function(ele) {
					if(ele) return new this._interface(ele);
				}, this));
			} else {
				this.collection = arr.slice(0); // build new array from array (clone method).
			}
			return true;
		},

		/**
		*	Returns the element in the index specified as parameter. If it's not found, returns null.
		*	@public
		*	@method get
		*	@param ix {Number} index
		*	@return Object
		**/
		get: function(ix) {
			if(ix < this.size()) return this.collection[ix];
			return null;
		},

		/**
		*	Add an object element and returns it
		*	@public
		*	@method add
		*	@param element {Object} element
		*	@param opts {Object} extra options
		*	@optional
		*	@return Object
		**/
		add: function(element, opts) {
			opts || (opts = {});
			if(!this._valid(element)) return null;
			if(!_.isNull(this._interface)) {
				element = new this._interface(element);
				this.collection.push(element);
			} else {
				this.collection.push(element);
			}
			if(!opts.silent) this.trigger(Collection.EVENTS.added, { added: element, collection: this });
			return element;
		},

		/**
		*	Add collection of elements to the current collection of elements.
		*	@public
		*	@method addAll
		*	@param elements {Array} Array of elements (Objects)
		*	@param opts {Object} extra options
		*	@optional
		*	@return Boolean
		**/
		addAll: function(elements, opts) {
			opts || (opts = {});
			if(!this._valid(elements) || !_.isArray(elements)) return false;
			elements = _.compact(_.map(elements, function(ele) {
				if(!_.isUndefined(ele)) return (!_.isNull(this._interface)) ? new this._interface(ele) : ele;
			}, this));
			this.collection = this.collection.concat(elements);
			if(!opts.silent) this.trigger(Collection.EVENTS.addedAll, { addedAll: elements, collection: this });
			return true;
		},

		/**
		*	Invoke a method specified by parameter on every the elements inside the collection
		*	@public
		*	@method invoke
		*	@param methodName {String} Method Name to invoke in every element in the collection
		*	@return Array
		**/
		invoke: function(methodName) {
			var args = _.flatten(Array.prototype.slice.call(arguments, 1));
			return _.invoke(this.collection, methodName, args);
		},

		/**
		*	Iterate over all the elements inside the collection by using func as the predicate.
		*	@public
		*	@method each
		*	@param func {Function} predicate function used to iterate over the elements.
		*	@return Function
		**/
		each: function(func) {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(this.collection);
			return _.each.apply(this, args);
		},

		/**
		*	Produces a new array of values by mapping each value in list through a transformation function (predicate)
		*	@public
		*	@method map
		*	@param func {Function} predicate function used to iterate over the elements.
		*	@return Array
		**/
		map: function(func) {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(this.collection);
			return _.map.apply(this, args);
		},

		/**
		*	Returns true if this collection contains the specified element.
		*	@public
		*	@method contains
		*	@param element {Object} element to evaluate
		*	@return Boolean
		**/
		contains: function(element) {
			if(!this._valid(element)) return false;
			var result = false, col = (this._interface && this._interface.prototype.toJSON) ?
				this.invoke('toJSON') : this.collection;
			for(var i = 0; i < col.length; i++)
				if(_.isEqual(col[i], element)) { result = true; break; }
			return result;
		},

		/**
		*	Returns true if this collection contains all elements of the collection specified as parameter
		*	@public
		*	@method containsAll
		*	@param elements {Array} collection of elements to evaluate
		*	@return Boolean
		**/
		containsAll: function(elements) {
			if(!elements) return false;
			return _.every(_.map(elements, function(e) { return this.contains(e); }, this));
		},

		/**
		*	Returns an iterator over the elements of this collection.
		*	@public
		*	@method iterator
		*	@return {com.spinal.util.adt.Iterator}
		**/
		iterator: function() {
			return new Iterator(_.clone(this.collection));
		},

		/**
		*	Remove an existent element
		*	@public
		*	@method remove
		*	@param ix {Number} index
		*	@param opts {Object} extra options
		*	@optional
		*	@return Object
		**/
		remove: function(ix, opts) {
			opts || (opts = {});
			if(!_.isUndefined(ix) && _.isNumber(ix) && ix >= 0 && ix < this.size()) {
				var rmArr = this.collection.splice(ix, 1);
				if(!opts.silent) this.trigger(Collection.EVENTS.removed, { removed: rmArr[0], collection: this });
				return rmArr[0];
			}
			return null;
		},

		/**
		*	Remove element/s that match the evaluation in finder
		*	@public
		*	@method removeBy
		*	@param finder {Function} matcher function
		*	@param opts {Object} extra options
		*	@optional
		*	@return {Array}
		**/
		removeBy: function(finder, opts) {
			opts || (opts = {});
			var len = this.size();
			for(var i = 0, removed = []; i < len; i++) {
				if(this.collection[i] && finder(this.collection[i])) {
					removed.push(this.remove(i, opts));
					i--; len--;
				}
			}
			return removed;
		},

		/**
		*	Removes all collection's elements that are also strictly contained in the collection specified by parameter.
		*	@public
		*	@method removeAll
		*	@param elements {Array} Collection of elements to be removed.
		*	@param opts {Object} extra options
		*	@optional
		*	@return Array
		**/
		removeAll: function(elements, opts) {
			opts || (opts = {});
			if(!this._valid(elements) || !_.isArray(elements)) return [];
			var len = this.size(), removed = [];
			for(var i = 0; i < len; i++) {
				if(_.filter(elements, _.matches(this.collection[i])).length > 0) {
					removed.push(this.remove(i, { silent: true }));
					if(i > 0) i--;
					len--;
				}
			}
			if(!opts.silent && removed.length > 0) this.trigger(Collection.EVENTS.removedAll, { removed: removed, collection: this });
			return removed;
		},

		/**
		*	Find an element by evaluation defined in finder.
		*	@public
		*	@method find
		*	@param finder {Function} matcher function
		*	@return Object
		**/
		find: function(finder) {
			if(!finder || !_.isFunction(finder)) return null;
			var args = Array.prototype.slice.call(arguments);
			args.unshift(this.collection);
			return _.find.apply(this, args);
		},

		/**
		*	Find elements by evaluation defined in finder.
		*	@public
		*	@method findBy
		*	@param finder {Function} matcher function
		*	@return Array
		**/
		findBy: function(finder) {
			for(var i = 0, found = []; i < this.size(); i++) {
				if(finder(this.collection[i])) found.push(this.collection[i]);
			}
			return found;
		},

		/**
		*	Find index position of an element that match the evaluation defined in finder.
		*	First element index that matches the evaluation will be returned. Otherwise, it will return null.
		*	@public
		*	@method findPosBy
		*	@param finder {Function} matcher function
		*	@return Object
		**/
		findPosBy: function(finder) {
			for(var i = 0, ix = -1; i < this.size(); i++) {
				if(finder(this.collection[i])) { ix = i; break; }
			}
			return ix;
		},

		/**
		*	Clears the collection
		*	@public
		*	@chainable
		*	@method reset
		*	@param opts {Object} Options
		*	@optional
		*	@return {com.spinal.util.adt.Collection}
		**/
		reset: function(opts) {
			opts || (opts = {});
			this.collection = [];
			if(!opts.silent) this.trigger(Collection.EVENTS.reset, { collection: this });
			return this;
		},

		/**
		*	Returns true if the collection is empty.
		*	@public
		*	@chainable
		*	@method isEmpty
		*	@return Boolean
		**/
		isEmpty: function() {
			return (this.size() === 0);
		},

		/**
		*	Returns the size of the collection.
		*	@public
		*	@chainable
		*	@method size
		*	@return Number
		**/
		size: function() {
			return this.collection.length;
		},

		/**
		*	Sort the collection by comparator passed as parameter.
		*	If the function comparator is ommited, the standard sort will be applied.
		*	@public
		*	@chainable
		*	@method sort
		*	@param comparator {Function} comparator function
		*	@return {com.spinal.util.adt.Collection}
		**/
		sort: function(comparator) {
			(!_.isUndefined(comparator) && _.isFunction(comparator)) ?
				this.collection.sort(comparator) :
				this.collection.sort();
			return this;
		},

		/**
		*	Swap element positions that matches the comparator evaluation function
		*	@public
		*	@chainable
		*	@method swap
		*	@param comparator {Function} comparator function
		*	@return {com.spinal.util.adt.Collection}
		**/
		swap: function(comparator) {
			if(!_.isUndefined(comparator) && _.isFunction(comparator)) {
				for(var i = 0; i < this.collection.length; i++) {
					var ix = comparator(this.collection[i], i);
					if(!_.isNull(ix) && ix > -1) {
						var e = this.collection[i];
						this.collection[i] = this.collection[ix];
						this.collection[ix] = e;
					}
				}
			}
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Collection',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			* @event added
			**/
			added: 'com:spinal:util:adt:collection:added',
			/**
			* @event removed
			**/
			removed: 'com:spinal:util:adt:collection:removed',
			/**
			* @event addedAll
			**/
			addedAll: 'com:spinal:util:adt:collection:addedAll',
			/**
			* @event removedAll
			**/
			removedAll: 'com:spinal:util:adt:collection:removedAll',
			/**
			* @event reset
			**/
			reset: 'com:spinal:util:adt:collection:reset'
		}

	}));

	return Collection;

});

/**
*	@module com.spinal.util.factories
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('util/factories/factory',['core/spinal',
		'util/exception/factory',
		'util/adt/collection'], function(Spinal, FactoryException, Collection) {

	/**
	*	Generic Factory
	*	@namespace com.spinal.util.factories
	*	@class com.spinal.util.factories.Factory
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.util.exception.FactoryException
	*	@requires com.spinal.util.adt.Collection
	**/
	var Factory = Spinal.namespace('com.spinal.util.factories.Factory', Spinal.SpinalClass.inherit({

		/**
		*	Collection of factory objects
		*	@public
		*	@property factories
		*	@type {com.spinal.util.adt.Collection}
		**/
		factories: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.factories.Factory}
		**/
		initialize: function() {
			this.factories = new Collection();
			return Factory.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Creates a pseudo constructor to allow passing an argument list with the new operator.
		*	This utility function checks first if the factory obj is a constructor function or a simple object,
		*	in order to decide to create a pseudo constructor or not.
		*	In the case of a simple object, the arguments passed will be ignored returning the object reference.
		*	@private
		*	@method _construct
		*	@param factory {Object} Original factoryObj
		*	@return {Function}
		**/
		_construct: function(factory, args) {
			if(!_.isFunction(factory)) return factory;
			function F() { return factory.apply(this, args); }
		    F.prototype = factory.prototype;
		    return new F();
		},

		/**
		*	Returns a factory that has been registered with the id passed as parameter.
		*	@public
		*	@method GetFactory
		*	@param id {String} Factory Id
		*	@return Object
		**/
		getFactory: function(id) {
			return this.factories.find(function(f) { return (f.id === id); });
		},

		/**
		*	Register a new generic factoryObj as Factory
		*	@public
		*	@method Register
		*	@param id {String} Factory Id
		*	@param factory {Object} factoryObj
		*	@return Function
		**/
		register: function(id, factory) {
			if(!id || !factory) return null;
			if(!this.getFactory(id)) this.factories.add({ id: id, factory: factory });
			return factory;
		},

		/**
		*	UnRegister a existing factory
		*	@public
		*	@method Unregister
		*	@param id {String} Factory Id
		*	@return Object
		**/
		unregister: function(id) {
			if(!id) return null;
			if(this.getFactory(id)) return this.factories.removeBy(function(f) { return (f.id === id); })[0];
		},

		/**
		*	Factory Method Create
		*	@public
		*	@method Create
		*	@return Object
		**/
		create: function(id) {
			var f = this.getFactory(id);
			if(!f) throw new FactoryException('UnregisteredFactory', { id: id });
			return this._construct(f.factory, Array.prototype.slice.call(arguments, 1));
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Factory'

	}));

	return Factory;

});

/**
*	@module com.spinal.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('util/adt/stack',['core/spinal',
	'util/adt/collection'], function(Spinal, Collection) {

	/**
	*	Defines the interface of a Stack LIFO (LastIn-FirstOut)
	*	<h5>Usages:</h5>
	*
	*		var mystack = new Stack([]); // initial
	*			mystack.addAll([{ name: 1 }, { name: 2 }]); // using 'addAll' from com.spinal.util.adt.Collection
	*			mystack.push({ name: 3 }); // or adding one by one.
	*			mystack.pop();
	*
	*		var mystack = new Stack([], { interface: Spinal.SpinalClass });
	*			mystack.addAll([{ name: 1 }, { name: 2 }]); // using 'addAll' from com.spinal.util.adt.Collection
	*			mystack.push({ name: 3 }); // or adding one by one.
	*			mystack.pop();
	*
	*	@namespace com.spinal.util.adt
	*	@class com.spinal.util.adt.Stack
	*	@extends com.spinal.util.adt.Collection
	**/
	var Stack = Spinal.namespace('com.spinal.util.adt.Stack', Collection.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param initial {Array} initial collection of elements in the stack.
		*	@param opts {Object} Additional options.
		*	@return {com.spinal.util.adt.Stack}
		**/
		initialize: function(initial, opts) {
			return Stack.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Validate the element in the stack.
		*	@private
		*	@method _valid
		*	@param element {Object} element to be evaluated.
		*	@return Boolean
		**/
		_valid: function(element) {
			return Stack.__super__._valid.apply(this, arguments);
		},

		/**
		*	Set the initial state of the stack
		*	@public
		*	@method set
		*	@param arr {Array} initial elements in the collection.
		*	@param opts {Object} Additional options.
		*	@return {com.spinal.util.adt.Stack}
		**/
		set: function(arr, opts) {
			opts || (opts = {});
			Stack.__super__.set.apply(this, arguments);
			return this;
		},

		/**
		*	Inserts the specified element into this stack.
		*	@public
		*	@method push
		*	@param element {Object} element to be inserted.
		*	@return Boolean
		**/
		push: function(element) {
			if(!this._valid(element)) return false;
			(!_.isNull(this._interface)) ?
				this.collection.unshift(new this._interface(element)) :
				this.collection.unshift(element);
			return true;
		},

		/**
		*	Retrieves, but does not remove, the head of this stack, or returns null if this stack is empty.
		*	@public
		*	@method peek
		*	@return Object
		**/
		peek: function() {
			return (this.size() > 0) ? this.collection[0] : null;
		},

		/**
		*	Retrieves and removes the head of this stack, or returns null if this stack is empty.
		*	@public
		*	@method pop
		*	@return Object
		**/
		pop: function() {
			return (this.size() > 0) ? this.remove(0) : null;
		},

		/**
		*   Returns the 1-based position where an object is on this stack
		*	@public
		*	@method search
		*	@param element {Object} element to get 1-based position
		*	@return Number
		**/
		search: function(element) {
			var pos = -1;
			for(var i = 0; i < this.size(); i++) {
				if(_.isEqual(this.collection[i],element)) { pos = i; break; }
			}
			return pos;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Stack'

	}));

	return Stack;

});

/**
*	@module com.spinal.util.factories
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('util/factories/async-factory',['core/spinal',
		'util/adt/stack',
		'util/factories/factory'], function(Spinal, Stack, Factory) {

	/**
	*	AsyncFactory Class
	*	This class uses a Stack ADT internally to enqueue resources and trigger the loading phase asynchronously.
	*	After all the resources are loaded, it register them in the factory.
	*	<h5>Usages:</h5>
	*
	*		var myAsyncFactory = new AsyncFactory();
	*			myAsyncFactory.set([{
	*				id: 'resourceA', path: 'path/to/resourceA',
	*				id: 'resourceB', path: 'path/to/resourceB'
	*			}]);
	*			myAsyncFactory.on(AsyncFactory.EVENTS.loaded, myLoadedCallback);
	*			// On each resource loaded and successfuly registered, the callback will be called.
	*			myAsyncFactory.load(_.bind(function(id, resource) {
	*				// make use of resource or the id of the resource ('resourceA' or 'resourceB');
	*			}, this));
	*
	*	Needless to say that the main purpose of having a Stack class supporting the asynchronous factory implementation
	*	is essentially, to provide a common interface to manage the resources list by easily 'convention' rather than
	*	supporting the intrinsect mechanisms to load the resources "one by one", since the resource queue is being managed
	*	internally by requirejs itself.
	*	With that being said, this class is suceptible to be changed to "inject" different async strategies as
	*	"Adapter" classes instead. (The developer should NOT notice any difference on the High-level API).
	*
	*	@namespace com.spinal.util.factories
	*	@class com.spinal.util.factories.AsyncFactory
	*	@extends com.spinal.util.factories.Factory
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.util.adt.Stack
	*	@requires com.spinal.util.factories.Factory
	**/
	var AsyncFactory = Spinal.namespace('com.spinal.util.factories.AsyncFactory', Factory.inherit({

		/**
		*	Stack of factory constructors to load
		*	@public
		*	@property stack
		*	@type {com.spinal.util.adt.Stack}
		**/
		stack: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param [opts] {Object} options
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			this.stack = new Stack([], opts);
			return AsyncFactory.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Resets the factory stack
		*	@public
		*	@chainable
		*	@method reset
		*	@param [opts] {Object} options
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		reset: function(opts) {
			this.stack.reset(opts);
			return this;
		},

		/**
		*	Set a new collection of elements to be inserted in the factory stack
		*	@FIXME: Must validate same rules as 'push' but atomically.
		*	@public
		*	@chainable
		*	@method set
		*	@param arr {Array} new collection to be replaced
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		set: function(arr) {
			if(!arr || !_.isArray(arr)) return false;
			this.stack.reset({ silent: true });
			this.stack.set(arr);
			return this;
		},

		/**
		*	Find a resource inside the factory stack by id
		*	@public
		*	@method findById
		*	@param id {String} resource id
		*	@return Object
		**/
		findById: function(id) {
			return this.stack.find(_.bind(function(r) { return (r.id && id && r.id === id); }, this));
		},

		/**
		*	Find a resource position (0-based) in the factory stack by passing the resource reference
		*	@public
		*	@method findPos
		*	@param resource {Function} resource reference
		*	@return Number
		**/
		findPos: function(resource) {
			return this.stack.search(resource);
		},

		/**
		*	Find a resource position in the factory stack by resource id
		*	@public
		*	@method findPosById
		*	@param id {String} resource id
		*	@return Number
		**/
		findPosById: function(id) {
			if(!id) return -1;
			return this.stack.findPosBy(function(resource) { return (resource.id === id); });
		},

		/**
		*	Inserts a resource into the factory stack
		*	@public
		*	@chainable
		*	@method push
		*	@param resource {Object} resource
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		push: function(resource) {
			if(!resource || !resource.id || !resource.path) return this;
			this.stack.push(resource);
			return this;
		},

		/**
		*	Removes a resource from the factory stack
		*	@public
		*	@chainable
		*	@method remove
		*	@param resource {Object} resource reference
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		remove: function(resource, opts) {
			opts || (opts = {});
			if(!resource) return this;
			this.stack.remove(this.stack.search(resource), opts);
			return this;
		},

		/**
		*	Checks if the resource already exists in the factory stack by id passed as parameter
		*	@public
		*	@method exists
		*	@param id {String} resource id
		*	@return Boolean
		**/
		exists: function(id) {
			return !_.isUndefined(this.findById(id));
		},

		/**
		*	Swaps positions of 2 resources inside the factory stack.
		*	@public
		*	@method swap
		*	@param comparator {Function} predicate that evaluates when the swap should take place
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		swap: function(comparator) {
			this.stack.swap(comparator);
			return this;
		},

		/**
		*	Load all resources in the factory stack if the stack is not empty
		*	@public
		*	@chainable
		*	@method load
		*	@param callback {Function} callback to execute on every resource loaded
		*	@param [opts] {Object} options
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		load: function(callback, opts) {
			opts || (opts = {});
			if(this.stack.size() <= 0) {
				if(callback && _.isFunction(callback)) callback([]);
				return this;
			}
			if(!opts.silent) this.trigger(AsyncFactory.EVENTS.prepared, this.stack.collection);
			return this._execute(callback, opts);
		},

		/**
		*	Handle Resources loaded by the current factory stack
		*	@private
		*	@method _handle
		*	@param resources {Array} resource reference
		*	@param [opts] {Object} options
		*	@return Array
		**/
		_handle: function(resources, opts) {
			return _.map(resources, function(resource) {
				var res = this.stack.pop();
				var registered = AsyncFactory.__super__.register.call(this, res.id, resource);
				if(!opts.silent && res.callback && _.isFunction(res.callback)) res.callback(res.id, resource);
				return registered;
			}, this);
		},

		/**
		*	Triggers loading phase of the current resources in the factory stack
		*	@private
		*	@method _execute
		*	@param callback {Function} callback to be executed after all resources are loaded
		*	@param [opts] {Object} options
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		_execute: function(callback, opts) {
			var paths = this.stack.map(function(resource) { return resource.path; });
			require(paths, _.bind(function() {
				var resources = this._handle(Array.prototype.slice.call(arguments), opts);
				if(callback && _.isFunction(callback)) callback(resources);
				if(!opts.silent) this.trigger(AsyncFactory.EVENTS.loaded, resources);
			}, this), _.bind(function(err) { this.trigger(AsyncFactory.EVENTS.failed, err); }, this));
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'AsyncFactory',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			* @event loaded
			**/
			loaded: 'com:spinal:util:factories:async:loaded',
			/**
			* @event loaded
			**/
			failed: 'com:spinal:util:factories:async:failed',
			/**
			* @event prepared
			**/
			prepared: 'com:spinal:util:factories:async:prepared'
		}

	}));

	return AsyncFactory;

});

/**
*	@module com.spinal.util.exception
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('util/exception/plugin',['core/spinal',
	'util/exception/exception'], function(Spinal, Exception) {

	/**
	*	Plugin Exception Type
	*	@namespace com.spinal.util.exception
	*	@class com.spinal.util.exception.PluginException
	*	@extends com.spinal.util.exception.Exception
	**/
	var PluginException = Spinal.namespace('com.spinal.util.exception.PluginException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.exception.PluginException}
		**/
		initialize: function() {
			return PluginException.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'PluginException',

		/**
		*	__Type List__
		*
		*		Generic (inherited from com.spinal.util.exception.Exception)
		*		ConfigNotSpecified
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			ConfigNotSpecified: _.template('Config was not defined')
		}

	}));

	return PluginException;

});

/**
*	@module com.spinal.util.exception
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('util/exception/ui',['core/spinal',
		'util/exception/exception'], function(Spinal, Exception) {

	/**
	*	UI Exception Type
	*	@namespace com.spinal.util.exception
	*	@class com.spinal.util.exception.UIException
	*	@extends com.spinal.util.exception.Exception
	**/
	var UIException = Spinal.namespace('com.spinal.util.exception.UIException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.exception.UIException}
		**/
		initialize: function() {
			return UIException.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'UIException',

		/**
		*	__Type List__
		*
		*		Generic (inherited from com.spinal.util.exception.Exception)
		*		InvalidIDType
		*		SuccessorNotSpecified
		*		InvalidSuccessorType
		*		UIStackViolation
		*		InvalidModelType
		*		UnsupportedRenderMethod
		*		InvalidInterfaceType
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			InvalidIDType: _.template('\'id\' parameter must be a String in the constructor.'),
			SuccessorNotSpecified: _.template('\'successor\' parameter was not speficied in the constructor.'),
			InvalidSuccessorType: _.template('\'successor\' must be an instance of com.spinal.ui.Container.'),
			UIStackViolation: _.template('UI Stack Violation found: view \'<%= viewId %>\' can not be found inside the successor specified \'<%= succesorId %>\'.'),
			InvalidModelType: _.template('\'model\' must be an instance of Backbone.Model.'),
			UnsupportedRenderMethod: _.template('unsupported render method -> \'<%= method %>\'.'),
			InvalidInterfaceType: _.template('unsupported Interface Type')
		}

	}));

	return UIException;

});

/**
*	@module com.spinal.util.exception
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('util/exception/context',['core/spinal',
		'util/exception/exception'], function(Spinal, Exception) {

	/**
	*	IoC Context Exception Type
	*	@namespace com.spinal.util.exception
	*	@class com.spinal.util.exception.ContextException
	*	@extends com.spinal.util.exception.Exception
	**/
	var ContextException = Spinal.namespace('com.spinal.util.exception.ContextException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.exception.ContextException}
		**/
		initialize: function() {
			return ContextException.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'ContextException',

		/**
		*	__Type List__
		*
		*		Generic (inherited from com.spinal.util.exception.Exception)
		*		UndefinedContext
		*		InvalidSpecFormat
		*		SpecIdRequired
		*		FactoryNotDeclared
		*		EngineNotDeclared
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			UndefinedContext: _.template('Context Not Defined'),
			InvalidSpecFormat: _.template('Invalid Spec Format'),
			SpecIdRequired: _.template('Spec ID was not defined'),
			FactoryNotDeclared: _.template('Factory is required to be able to instanciate <%= clazz %>'),
			EngineNotDeclared: _.template('Engine not declared')
		}

	}));

	return ContextException;

});

/**
*	@module com.spinal.util.exception
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('util/exception/processor',['core/spinal',
		'util/exception/exception'], function(Spinal, Exception) {

	/**
	*	IoC Processor Exception Type
	*	@namespace com.spinal.util.exception
	*	@class com.spinal.util.exception.ProcessorException
	*	@extends com.spinal.util.exception.Exception
	**/
	var ProcessorException = Spinal.namespace('com.spinal.util.exception.ProcessorException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.exception.ProcessorException}
		**/
		initialize: function() {
			return ProcessorException.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'ProcessorException',

		/**
		*	__Type List__
		*
		*		Generic (inherited from com.spinal.util.exception.Exception)
		*		BoneNotFound
		*		InvalidModuleDeclaration
		*		CreateModuleException
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			BoneNotFound: _.template('Bone <%= id %> was not found.'),
			InvalidModuleDeclaration: _.template('Module bone <%= id %> is missing required \'class\' declaration.'),
			CreateModuleException: _.template('Create Model operation requires a \'className\' and module \'data\' in order to work.')
		}

	}));

	return ProcessorException;

});

/**
*	@module com.spinal.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('util/adt/queue',['core/spinal',
	   'util/adt/collection'], function(Spinal, Collection) {

	/**
	*	Defines the interface of a FIFO Queue (FirstIn-FirstOut)
	*	<h5>Usages:</h5>
	*
	*		var myqueue = new Queue([], { capacity: 5 }); // initial is set to capacity was set to 5
	*			myqueue.addAll([{ name: 1 }, { name: 2 }]); // using 'addAll' from com.spinal.util.adt.Collection
	*			myqueue.offer({ name: 3 }); // or adding one by one.
	*			myqueue.poll();
	*
	*		var myqueue = new Queue([], { capacity: 3, interface: Spinal.SpinalClass });
	*			myqueue.addAll([{ name: 1 }, { name: 2 }]); // using 'addAll' from com.spinal.util.adt.Collection
	*			myqueue.offer({ name: 3 }); // or adding one by one.
	*			myqueue.poll();
	*
	*	@namespace com.spinal.util.adt
	*	@class com.spinal.util.adt.Queue
	*	@extends com.spinal.util.adt.Collection
	**/
	var Queue = Spinal.namespace('com.spinal.util.adt.Queue', Collection.inherit({

		/**
		*	Queue capacity
		*	@public
		*	@property capacity
		*	@type Number
		**/
		capacity: 0,

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param initial {Array} initial collection of elements in the queue.
		*	@param opts {Object} Additional options.
		*	@return {com.spinal.util.adt.Queue}
		**/
		initialize: function(initial, opts) {
			return Queue.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Validate capacity of the queue to add or not the element in the queue.
		*	@private
		*	@method _valid
		*	@param element {Object} element to be evaluated.
		*	@return Boolean
		**/
		_valid: function(element) {
			if(this.size() >= this.capacity) return false;
			return Queue.__super__._valid.apply(this, arguments);
		},

		/**
		*	Set the initial state of the queue
		*	@public
		*	@method set
		*	@param arr {Array} initial elements in the collection.
		*	@param opts {Object} Additional options.
		*	@return {com.spinal.util.adt.Queue}
		**/
		set: function(arr, opts) {
			opts || (opts = {});
			if(_.isUndefined(opts.capacity)) throw new Error('Queue requires a \'capacity\' property in order to be instanciate it.');
			if(arr.length > opts.capacity) throw new Error('Queue element\'s collection passed overflows the current capacity [' + opts.capacity + '].');
			this.capacity = opts.capacity;
			Queue.__super__.set.apply(this, arguments);
			return this;
		},

		/**
		*	Inserts the specified element into this queue if it is possible to do so immediately without violating capacity restrictions.
		*	@public
		*	@method offer
		*	@param element {Object} element to be inserted.
		*	@return Boolean
		**/
		offer: function(element) {
			if(!this._valid(element)) return false;
			(!_.isNull(this._interface)) ?
				this.collection.push(new this._interface(element)) :
				this.collection.push(element);
			return true;
		},

		/**
		*	Retrieves, but does not remove, the head of this queue, or returns null if this queue is empty.
		*	@public
		*	@method peek
		*	@return Object
		**/
		peek: function() {
			return (this.size() > 0) ? this.collection[0] : null;
		},

		/**
		*	Retrieves and removes the head of this queue, or returns null if this queue is empty.
		*	@public
		*	@method poll
		*	@return Object
		**/
		poll: function() {
			return (this.size() > 0) ? this.remove(0) : null;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Queue'

	}));

	return Queue;

});

/**
*	SpinalJS | Util Module Package
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('spinal-util',['util/string',
		'util/schema',
		'util/http/ajax-http',
		'util/factories/factory',
		'util/factories/async-factory',
		'util/exception/exception',
		'util/exception/plugin',
		'util/exception/ui',
		'util/exception/factory',
		'util/exception/context',
		'util/exception/processor',
		'util/adt/collection',
		'util/adt/iterator',
		'util/adt/queue',
		'util/adt/stack'], function() { });


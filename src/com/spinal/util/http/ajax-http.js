/**
*	@module com.spinal.util.http
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal', 'util/string'], function(Spinal, StringUtil) {

	/**
	*	HTTP Ajax based Controller Class
	*	Defines a Basic HTTP Controller structure to make ajax request calls
	*	This interface supports the following HTTP methods: GET, POST, PUT AND DELETE.
	*	Content Types: XML, JSON AND HTML.
	*	<h5>Usage:</h5>
	*
	*		// Controller Class declaration (will inherit methods from AjaxHttp)
	*		var MyController = Spinal.namespace('com.company.controller.MyController', AjaxHttp.inherit({
	*
	*			endpoint: '/path/to/remote/endpoint/',
	*
	*			initialize: function() {
    *				MyController.__super__.initialize.apply(this, arguments);
	*				return this;
	*			},
	*
	*			method: function(data, opts) {
	*				this.call({
	*					action: 'method', // -> "/path/to/remote/endpoint/method",
	*					method: AjaxHttp.VERBS.POST,
	*					// optional parameters
	*					params: data,
	*					success: this.service.parse, // -> will pass arguments to the parse method on the service object
	*					skipSuccess: true // -> Skips MyController success event triggering
	*				}, opts);
	*			}
	*
	*			...
	*
	*		}));
	*
	*		In another context:
	*
	*		var c = new MyController({ service: serviceInstance });
	*			c.method({someData}, { after: function(req, res, ...) {
	*				// This callback is executed despite success or fail.
	*				console.log(arguments);
	*			} });
	*
	*	@namespace com.spinal.util
	*	@class com.spinal.util.http.AjaxHttp
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	**/
	var AjaxHttp = Spinal.namespace('com.spinal.util.http.AjaxHttp', Spinal.SpinalClass.inherit({

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
		initialize: function(opts) {
			opts || (opts = {});
			if(!this.endpoint) throw new Error(this.toString() + ' requires an endpoint path');
			if(opts.service) this.service = opts.service;
			return AjaxHttp.__super__.initialize.apply(this, arguments);;
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
				url: (this.endpoint + req.action + StringUtil.createQueryString(req.params)),
				type: AjaxHttp.VERBS.GET,
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
				type: AjaxHttp.VERBS.POST,
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
				type: AjaxHttp.VERBS.PUT,
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
				type: AjaxHttp.VERBS.DELETE,
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
			if(req.success && this.service) req.success.apply(this.service, arguments);
			if(!req.skipSuccess) this.trigger(AjaxHttp.EVENTS.success, arguments);
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
			if(req.fail && this.service) req.fail.apply(this.service, arguments);
			if(!req.skipFail) this.trigger(AjaxHttp.EVENTS.fail, arguments);
			if(req.__after__) req.__after__(arguments);
			return this;
		},

		/**
		*	Before Execute Hook
		*	@public
		*	@method before
		*	@param req {Object} request data reference
		*	@param [opts] {Object} optional data
		*	@return com.spinal.util.http.AjaxHttp
		**/
		before: function(req, opts) {
			opts || (opts = {});
			this._handle(req, opts);
			if(req.progress) req.progress(arguments);
			if(!req.skipProgress) this.trigger(AjaxHttp.EVENTS.progress, req, opts);
			return this;
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
				if(_.contains(_.values(AjaxHttp.VERBS), req.method))
					this.before(arguments)['_' + req.method](req);
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

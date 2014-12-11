//	SpinalJS Ioc@0.0.1 (c) 2014 Patricio Ferreira <3dimentionar@gmail.com>, 3dimention.com
//	SpinalJS may be freely distributed under the MIT license.
//	For all details and documentation: http://3dimention.github.io/spinal
/**
*	@module com.spinal.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('ioc/engine',['ioc/context',
		'util/adt/collection',
		'util/exception/context'], function(Context, Collection, ContextException) {

	/**
	*	Bone Engine Class
	*	@namespace com.spinal.ioc
	*	@class com.spinal.ioc.Engine
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.Context
	*	@requires com.spinal.util.adt.Collection
	*	@requires com.spinal.util.exception.ContextException
	**/
	var Engine = Spinal.namespace('com.spinal.ioc.Engine', Spinal.SpinalClass.inherit({

		/**
		*	Main Spec root reference
		*	@public
		*	@property root
		*	@type {Object}
		**/
		root: {},

		/**
		*	List of specs
		*	@public
		*	@property specs
		*	@type {com.spinal.util.adt.Collection}
		**/
		specs: null,

		/**
		*	Async Module Factory
		*	@public
		*	@property factory
		*	@type {com.spinal.util.AsyncFactory}
		**/
		factory: null,

		/**
		*	Supported annotations
		*	@public
		*	@property annotations,
		*	@type Object
		**/
		annotations: {
			_id: 'id',
			_specs: 'specs',
			_ready: 'ready',
			_plugins: 'plugins'
		},

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param root {Object} reference to the spec root
		*	@param factory {com.spinal.util.factories.AsyncFactory} factory reference
		*	@return {com.spinal.ioc.Engine}
		**/
		initialize: function(factory) {
			if(!factory) throw new ContextException('FactoryNotDeclared', { clazz: Engine.NAME });
			this.factory = factory;
			this.specs = new Collection([]);
			_.each(this.annotations, function(v, k) { this['__' + v] = (Engine.PREFIX + v); }, this);
			return this;
		},

		/**
		*	Performs validations against a given spec
		*	@private
		*	@method _valid
		*	@param spec {Object} spec reference
		*	@return Boolean
		**/
		_valid: function(spec) {
			if(!_.isObject(spec)) throw new ContextException('InvalidSpecFormat');
			if(!spec[this.__id]) throw new ContextException('SpecIdRequired');
		},

		/**
		*	Merges a new spec into the root and adds it into the specs collection
		*	Additionally, if there is any $ready annotation in the new spec, this method will merge it.
		*	@private
		*	@method _addSpec
		*	@param spec {Object} spec reference
		**/
		_addSpec: function(spec) {
			_.extend(this.root, _.omit(spec, this.__id, this.__specs, this.__ready));
			if(this.specs.add(spec[this.__id]) && spec[this.__ready]) {
				if(_.isUndefined(this.root[this.__ready])) this.root[this.__ready] = [];
				this.root[this.__ready] = _.union(this.root[this.__ready], spec[this.__ready]);
			}
		},

		/**
		*	Build specs into a single object unit suitable for querying by this class
		*	This method is also responsible to build composite spec trees by merging them
		*	into a single object to speed up querying and reducing the amount of nesting loops.
		*	@public
		*	@method build
		*	@param spec {Object} spec
		*	@return {com.spinal.ioc.Engine}
		**/
		build: function(spec) {
			this._valid(spec);
			if(!this.specs.contains(spec[this.__id])) this._addSpec(spec);
			if(spec[this.__specs]) this.invoke('build', spec[this.__specs]);
			return this;
		},

		/**
		*	Checks if any of the actions declared in the $ready annotation were completed.
		*	If $ready annotation is not defined or it's not an array, it returns true.
		*	@public
		*	@method ready
		*	@return Boolean
		**/
		ready: function() {
			return (this.root.$ready &&
				_.isArray(this.root.$ready) &&
				_.every(_.pluck(this.root.$ready, '_$ready')));
		},

		/**
		*	Checks if $plugin annotation is present inside the current root spec.
		*	@public
		*	@method plugin
		*	@return Boolean
		**/
		plugin: function() {
			return (this.root.$plugins);
		},

		/**
		*	Perform a look up of bones by a predicate passed as parameter.
		*	If a bone is specified as a extra argument, it will narrow the search down to the specific bone context.
		*	@public
		*	@method getBonesBy
		*	@param finder {Function} predicate evaluation
		*	@return Array
		**/
		getBonesBy: function(finder) {
			if(!this.root) return [];
			return _.compact(_.map(this.root, function(b, id) { return (finder(b, id)) ? this.getBone(id) : null; }, this));
		},

		/**
		*	Perform a bone look up by id.
		*	If the bone is a module and it was already created, this method will return the instance of the bone.
		*	@public
		*	@method getBone
		*	@param id {String} bone id
		*	@return Object
		**/
		getBone: function(id) {
			return (this.root && this.root[id]) ?
				((this.isCreated(this.root[id])) ? this.root[id]._$created : this.root[id]) : null;
		},

		/**
		*	Perform a look up of bones by className passed as parameter.
		*	In order to use this method, the context must be completly initialized.
		*	@public
		*	@method findBonesByType
		*	@param type {String} bone type
		*	@return Array
		**/
		getBonesByClass: function(className) {
			return this.getBonesBy(_.bind(function(b, id) {
				return (this.isModule(b) && this.isCreated(b) && b._$created.constructor.NAME === className);
			}, this));
		},

		/**
		*	Perform a look up of bones by type passed as parameter.
		*	In order to use this method, the context must be completly initialized.
		*	@public
		*	@method getBonesByType
		*	@param type {String} bone type
		*	@return Array
		**/
		getBonesByType: function(type) {
			return this.getBonesBy(_.bind(function(b, id) {
				return (this.isModule(b) && this.isCreated(b)) ? (this.getBone(id) instanceof type) : (b instanceof type);
			}, this));
		},

		/**
		*	Checks if the bone defined was declared as a module.
		*	@public
		*	@method isModule
		*	@param bone {Object} current bone to be evaluated
		*	@return Boolean
		**/
		isModule: function(bone) {
			return (bone && bone.$module);
		},

		/**
		*	Checks if the bone was succesufuly created
		*	@public
		*	@method isCreated
		*	@param bone {Object} current bone to be evaluated
		*	@return Boolean
		**/
		isCreated: function(bone) {
			return (bone && bone._$created);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Engine',

		/**
		*	@static
		*	@property PREFIX
		*	@type String
		**/
		PREFIX: '$',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event initialized
			**/
			proxified: 'com:spinal:ioc:engine:proxified',
			/**
			*	@event pluginNotification
			**/
			plugin: 'com:spinal:ioc:engine:plugin-notification'
		}

	}));

	return Engine;

});

/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('ioc/processor/bone',['core/spinal',
		'ioc/engine',
		'util/exception/context',
		'util/exception/processor'], function(Spinal, Engine, ContextException, ProcessorException) {

	/**
	*	BaseClass Bone Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.BoneProcessor
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.Context
	*	@requires com.spinal.util.exception.ContextException
	*	@requires com.spinal.util.exception.ProcessorException
	**/
	var BoneProcessor = Spinal.namespace('com.spinal.ioc.processor.BoneProcessor', Spinal.SpinalClass.inherit({

		/**
		*	Engine
		*	@private
		*	@property _engine
		*	@type {com.spinal.ioc.Engine}
		**/
		_engine: null,

		/**
		*	Supported annotations
		*	@public
		*	@property annotations,
		*	@type Object
		**/
		annotations: {
			_r: 'bone!',
			_d: '!'
		},

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param engine {com.spinal.ioc.Engine} engine reference
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		**/
		initialize: function(engine) {
			if(!engine) throw new ContextException('EngineNotDeclared');
			this._engine = engine;
			return this;
		},

		/**
		*	Default Spec root filtering method useful to dicard bones from the main spec
		*	suitable for matching specific processor behaviors.
		*	@private
		*	@method _root
		*	@return Object
		**/
		_root: function() {
			return this._engine.root;
		},

		/**
		*	Check if expr matches the annotation passed as parameter
		*	If the annotation is omitted, the annotation declared in this processor will be used.
		*	@public
		*	@method validate
		*	@param expr {String} expression to be evaluated
		*	@param [annotation] {String} annotation used to be matched with the expression
		*	@return Boolean
		**/
		validate: function(expr, annotation) {
			if(!expr || !_.isString(expr)) return false;
			if(!annotation) annotation = this.annotations._r;
			return ((Engine.PREFIX + expr).indexOf(annotation) !== -1);
		},

		/**
		*	Checks if the expression is a module bone dependency
		*	@public
		*	@method isModuleDependency
		*	@param expr {String} expression to be evaluated
		*	@return Boolean
		**/
		isModuleDependency: function(expr) {
			if(!expr || !_.isString(expr)) return false;
			return (this._engine.isModule(this.getDependency(expr)));
		},

		/**
		*	Extracts and returns the dependent bone id from the expression passed by parameter
		*	@public
		*	@method getDependencyId
		*	@param expr {String} dependency expression to be evaluated
		*	@param [delimiter] {String} optional delimiter that identifies a bone reference
		*	@return String
		**/
		getDependencyId: function(expr, delimiter) {
			if(!expr || !_.isString(expr)) return null;
			var pos = expr.indexOf((delimiter && delimiter !== '') ? delimiter : this.annotations._d);
			return (pos > 0) ? expr.substring((pos+1), expr.length) : null;
		},

		/**
		*	Retrieves dependent bone from the spec by the expression passed as parameter
		*	@public
		*	@method getDependency
		*	@param expr {String} expression to be evaluated
		*	@param [delimiter] {String} optional delimiter that identifies a bone reference
		*	@return Object
		**/
		getDependency: function(expr, delimiter) {
			var dependencyId = this.getDependencyId.apply(this, arguments);
			return (dependencyId) ? this._engine.getBone(dependencyId) : null;
		},

		/**
		*	Filters out and call the predicate function over the notations supported by the processor.
		*	Predicate function must return the reference to the bone processed, otherwise the rest of the evaluations
		*	will be skipped.
		*	@public
		*	@method execute
		*	@param predicate {Function} predicate function that filters out bones that are suitable to be processed
		*	@param [bone] {Object} recursive context
		*	@return Array
		**/
		execute: function(predicate, bone) {
			if(!predicate || !_.isFunction(predicate)) return false;
			var bones = [], context = (bone) ? bone : this._root();
			for(var id in context) {
				var r = predicate.call(this, context[id], id, (bone) ? context : null);
				if(r) { bones.push(r) } else { break; }
			}
			return _.compact(_.flatten(bones));
		}

	}, {

		/**
		*	Class Name
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'BoneProcessor',

		/**
		*	BoneProcessor Events
		*	@static
		*	@property Object
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event processed
			**/
			processed: 'com:spinal:ioc:processor:processed'
		}

	}));

	return BoneProcessor;

});

/**
*	@module com.spinal.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('ioc/context',['core/spinal',
		'util/string',
		'util/adt/iterator',
		'util/factories/async-factory',
		'util/exception/context',
		'ioc/processor/bone',
		'ioc/engine'], function(Spinal, StringUtil, Iterator, AsyncFactory, ContextException, BoneProcessor, Engine) {

	/**
	*	IOC Context Class
	*	@namespace com.spinal.ioc
	*	@class com.spinal.ioc.Context
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.util.StringUtil
	*	@requires com.spinal.util.adt.Iterator
	*	@requires com.spinal.util.AsyncFactory
	*	@requires com.spinal.util.exception.ContextException
	*	@requires com.spinal.ioc.processor.BoneProcessor
	*	@requires com.spinal.ioc.Engine
	**/
	var Context = Spinal.namespace('com.spinal.ioc.Context', Spinal.SpinalClass.inherit({

		/**
		*	Identifier
		*	@public
		*	@property id
		*	@type String
		**/
		id: StringUtil.uuid(),

		/**
		*	Engine Class
		*	@public
		*	@property query
		*	@type com.spinal.ioc.Engine
		**/
		engine: null,

		/**
		*	Async Module Factory
		*	@public
		*	@property factory
		*	@type {com.spinal.util.AsyncFactory}
		**/
		factory: null,

		/**
		*	Processors List used by the context
		*	@public
		*	@property processors
		*	@type {com.spinal.util.adt.Iterator}
		**/
		processors: new Iterator([
			{ id: 'PluginProcessor', path: 'ioc/processor/plugin' },
			{ id: 'CreateProcessor', path: 'ioc/processor/create' },
			{ id: 'ReadyProcessor', path: 'ioc/processor/ready' }
		]),

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.Context}
		**/
		initialize: function() {
			this.factory = new AsyncFactory();
			this.engine = new Engine(this.factory);
			this.listenTo(this.engine, Engine.EVENTS.proxified, _.bind(this.proxify, this));
			this.listenTo(this.engine, Engine.EVENTS.plugin, _.bind(this.notify, this));
			this.proxify(this.engine, 'getBone', 'getBonesByType', 'getBonesByClass');
			return this;
		},

		/**
		*	Load Processors if they were not loaded previously.
		*	@private
		*	@method _loadProcessors
		*	@param [callback] {Function} callback reference
		*	@return {com.spinal.ioc.Context}
		**/
		_loadProcessors: function(callback) {
			this.processors.rewind();
			(!this.factory.getFactory('CreateProcesor')) ?
				this.factory.set(this.processors.collection).load(_.bind(this._onProcessorsLoaded, this, callback)) :
				this._onProcessorsLoaded(callback);
			return this;
		},

		/**
		*	Processors Load Handler
		*	@private
		*	@method _onProcessorsLoaded
		*	@param [callback] {Function} callback reference
		**/
		_onProcessorsLoaded: function(callback) {
			while(this.processors.hasNext()) {
				var p = this.processors.next();
				p.module = this.bonefactory('create', p.id, this.engine);
				p.module.once(BoneProcessor.EVENTS.processed, _.bind(this._next, this, p.module, callback));
			}
			return (this.processors.rewind() && this._next());
		},

		/**
		*	Next Processor Execution Complete Handler
		*	@private
		*	@method _next
		*	@param processor {Object} processor reference
		*	@param [callback] {Function} callback reference
		*	@return com.spinal.ioc.Context
		**/
		_next: function(processor, callback) {
			if(processor) this.notify(Context.EVENTS.processorCompleted, null, processor);
			return (this.processors.hasNext()) ?
				this.processors.next().module.execute() :
				this.notify(Context.EVENTS.initialized, callback, this);
		},

		/**
		*	Bone Factory method wrapper
		*	@public
		*	@method bonefactory
		*	@param methodName {String} factory method name
		*	@return Object
		**/
		bonefactory: function(methodName) {
			if(!methodName) return null;
			var args = Array.prototype.slice.call(arguments, 1);
			return (this.factory[methodName]) ? this.factory[methodName].apply(this.factory, args) : null;
		},

		/**
		*	Context Wiring
		*	@public
		*	@chainable
		*	@method wire
		*	@throws {com.spinal.util.exception.ContextException}
		*	@param spec {Object} context specification to be wired
		*	@param callback {Function} callback function to be called after autowiring.
		*	@return {com.spinal.ioc.Context}
		**/
		wire: function(spec, callback) {
			if(!spec) { callback(this); return this; }
			if(!_.isObject(spec)) throw new ContextException('InvalidSpecFormat');
			this.engine.build(spec);
			return this._loadProcessors(callback);
		},

		/**
		*	Trigger Context notifications
		*	@public
		*	@method notify
		*	@param eventName {String} event name to be trigger
		*	@param [callback] {Function} optional callback to be called
		**/
		notify: function(eventName, callback) {
			if(callback && _.isFunction(callback)) callback(this);
			if(eventName && _.isString(eventName)) {
				var args = Array.prototype.slice.call(arguments, 2); args.unshift(eventName);
				this.trigger.apply(this, args);
			}
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Context',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event initialized
			**/
			initialized: 'com:spinal:ioc:context:initialized',
			/**
			*	@event processorCompleted
			**/
			processorCompleted: 'com:spinal:ioc:context:processor:completed'
		},

		/**
		*	Static IoC Initializer
		*	@static
		*	@method Initialize
		*	@param spec {Object} Default spec
		*	@param callback {Function} callback pass to the wire
		*	@return com.spinal.ioc.Context
		**/
		Initialize: function(spec, callback) {
			return (arguments.length === 1 && _.isFunction(spec)) ?
				new Context().wire(null, spec) :
				new Context().wire(spec, callback);
		},

		/**
		*	Main Spec LazyLoad
		*	@static
		*	@method LazyLoad
		*	@param pathSpec {String} main spec path
		*	@param callback {Function} callback pass to the wire
		*	@return com.spinal.ioc.Context
		**/
		LazyLoad: function(pathSpec, callback) {
			require([pathSpec], callback);
		}

	}));

	// Automatic Initializer
	var mainSpec = $('script[data-spec]').data('spec');
	if(mainSpec) Context.LazyLoad(mainSpec, function(spec) { Spinal.app = Context.Initialize(spec); });

	return Context;

});

/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('ioc/processor/plugin',['ioc/context',
		'ioc/processor/bone',
		'util/exception/processor'], function(Context, BoneProcessor, ProcessorException) {

	/**
	*	Defines a processor that acts as a wrapper to trigger plugins functionality
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.PluginProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	*
	*	@requires com.spinal.ioc.Context
	*	@requires com.spinal.ioc.processor.BoneProcessor
	**/
	var PluginProcessor = Spinal.namespace('com.spinal.ioc.processor.PluginProcessor', BoneProcessor.inherit({

		/**
		*	Default plugins path processors
		*	@public
		*	@property defaultPath
		*	@type String
		**/
		defaultPath: 'ioc/plugins/',

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		initialize: function() {
			return PluginProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Adds a new plugin module into the async factory stack
		*	@private
		*	@chainable
		*	@method _enqueue
		*	@param id {String} module id
		*	@param success {Function} callback function to be executed once the module is loaded
		*	@return Object
		**/
		_enqueue: function(id, success) {
			this._engine.factory.push({ id: id, path: (this.defaultPath + id), callback: success });
			return this;
		},

		/**
		*	Function as partial that creates an instance of the module plugin by passing the parameters to
		*	the constructor function (including params)
		*	@private
		*	@method _create
		*	@throws {com.spinal.util.error.types.ProcessorException}
		*	@param params {Object} plugin params
		*	@param pluginName {String} plugin name to pass to the factory to create an instance
		*	@return Object
		**/
		_create: function(params, pluginName) {
			return this._engine.factory.create(pluginName, ((params) ? params : {}), this._engine).execute();
		},

		/**
		*	Process all plugins extracted from the root spec
		*	@public
		*	@method process
		*	@param plugins {Object} plugins reference
		*	@return Array
		**/
		process: function(plugins) {
			return _.map(plugins, function(params, id) {
				this._enqueue(id, _.bind(_.partial(this._create, params), this));
				return id;
			}, this);
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		execute: function() {
			var plugins = (this._engine.plugin()) ? this.process(this._engine.root[this._engine.__plugins]) : [];
			this._engine.factory.load(_.bind(function() {
				delete this._engine.root[this._engine.__plugins];
				this.trigger(PluginProcessor.EVENTS.processed, {  type: PluginProcessor.NAME, plugins: plugins });
			}, this));
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'PluginProcessor'

	}));

	return PluginProcessor;

});

/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('ioc/processor/create',['ioc/context',
	'ioc/engine',
	'ioc/processor/bone',
	'util/exception/processor'], function(Context, Engine, BoneProcessor, ProcessorException) {

	/**
	*	Create Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.CreateProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	*
	*	@requires com.spinal.ioc.Context
	*	@requires com.spinal.ioc.processor.BoneProcessor
	*	@requires com.spinal.util.exception.ProcessorException
	**/
	var CreateProcessor = Spinal.namespace('com.spinal.ioc.processor.CreateProcessor', BoneProcessor.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		initialize: function() {
			return CreateProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Filters out bones without any type of prefixes suitable for this processor
		*	@private
		*	@method _root
		*	@return Object
		**/
		_root: function() {
			return _.omit(this._engine.root, function(v, k) { return (k.indexOf(Engine.PREFIX) === 0); });
		},

		/**
		*	Add the module into the async factory stack
		*	@private
		*	@method _enqueue
		*	@param id {String} module id
		*	@param success {Function} callback function to be executed once the module is loaded
		*	@param dependencies {Array} dependencies for the current module being enqueued
		*	@return Object
		**/
		_enqueue: function(id, success, dependencies) {
			if(!(module = this._engine.getBone(id))) throw new ProcessorException('BoneNotFound');
			this._engine.factory.push({ id: id, path: module.$module, callback: success });
			return this._sorting(id, module, dependencies);
		},

		/**
		*	Resolves module's ordering based on module's dependencies inside the current factory stack
		*	@private
		*	@method _sorting
		*	@param id {String} module id
		*	@param module {Object} module reference
		*	@param dependencies {Array} dependencies for the current module id
		*	@return Object
		**/
		_sorting: function(id, module, dependencies) {
			if(dependencies.length === 0) return module;
			var dpos = _.map(dependencies, function(d) { return this._engine.factory.findPosById(d.id); }, this);
			this._engine.factory.swap(_.bind(function(maxp, minp, m, ix) {
				return (id === m.id && ix <= maxp) ? maxp : ix;
			}, this, _.max(dpos), _.min(dpos)));
			return module;
		},

		/**
		*	Function as partial that creates an instance of the module by passing the parameters to
		*	the constructor function (including dependencies if they exists)
		*	@private
		*	@method _create
		*	@throws {com.spinal.util.error.types.ProcessorException}
		*	@param dependecies {Array} array of dependencies (module ids)
		*	@param bone {Object} bone reference
		*	@param moduleName {String} module name to pass to factory to create an instance
		*	@return Object
		**/
		_create: function(dependencies, bone, moduleName) {
			if(!bone || !moduleName) throw new ProcessorException('CreateModuleException');
			if(dependencies && dependencies.length > 0) this._inject(bone.$params, dependencies);
			return (bone._$created = this._engine.factory.create(moduleName, bone.$params));
		},

		/**
		*	Inject dependency via constructor params into the current module
		*	@private
		*	@method _inject
		*	@param obj {Object} object in which the dependency will be injected
		*	@param deps {Array} list of dependencies (modules ids)
		**/
		_inject: function(obj, deps) {
			_.each(deps, function(dep) { obj[dep.property] = this._engine.getBone(dep.id); }, this);
		},

		/**
		*	Handles bone's metadata declarations to determine dependencies and act accordingly.
		*	@private
		*	@method _dependencies
		*	@param params {Object} object to be evaluated
		*	@return Object
		**/
		_dependencies: function(params) {
			return _.compact(_.map(params, function(value, key, obj) {
				if(!this._resolve(value, obj, key)) return { id: this.getDependencyId(value), property: key };
			}, this));
		},

		/**
		*	Resolve Bone Expression
		*	@private
		*	@method _resolve
		*	@param expr {String} expression to be evaluated
		*	@param parent {Object} parent bone reference
		*	@param key {Object} property key of the parent bone in which the dependency extracted from expr will be
		*	injected
		*	@return Boolean
		**/
		_resolve: function(expr, parent, key) {
			if(!expr || !parent) return null;
			if(!this.validate(expr)) return key;
			if(!this.isModuleDependency(expr)) return (parent[key] = this.getDependency(expr));
		},

		/**
		*	Evaluates and process all bones inside the spec and return them one by one.
		*	@public
		*	@method process
		*	@param bone {Object} bone reference to be evaluated
		*	@param id {String} bone id to be evaluated
		*	@param [parent] {Object} optional parent bone (when nesting through arrays or objects)
		*	@return Boolean
		**/
		process: function(bone, id, parent) {
			if(this._engine.isModule(bone)) {
				var deps = this._dependencies(bone.$params);
				return this._enqueue(id, _.bind(_.partial(this._create, deps, bone), this), deps);
			} else if(_.isObject(bone) || _.isArray(bone)) {
				return CreateProcessor.__super__.execute.call(this, this.process, bone, id);
			}
			return (!_.isNull(parent)) ? this._resolve(bone, parent, id) : bone;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		execute: function() {
			var bs = CreateProcessor.__super__.execute.call(this, this.process);
			this._engine.factory.load(_.bind(function() {
				this.trigger(CreateProcessor.EVENTS.processed, { type: CreateProcessor.NAME, bones: bs });
			}, this));
			return this;
		}

	}, {

		/**
		*	Class Name
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'CreateProcessor'

	}));

	return CreateProcessor;

});

/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('ioc/processor/ready',['ioc/context',
		'ioc/processor/bone',
		'ioc/engine'], function(Context, BoneProcessor, Engine) {

	/**
	*	Ready Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.ReadyProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	*
	*	@requires com.spinal.ioc.Context
	*	@requires com.spinal.ioc.processor.BoneProcessor
	**/
	var ReadyProcessor = Spinal.namespace('com.spinal.ioc.processor.ReadyProcessor', BoneProcessor.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.processor.ReadyProcessor}
		**/
		initialize: function() {
			return ReadyProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Process and resolves possible dependencies on the expression's param list via injection
		*	@private
		*	@method _inject
		*	@param exprs {Array} param expressions
		*	@return Object
		*/
		_inject: function(exprs) {
			if(!_.isArray(exprs)) return {};
			return _.map(exprs, function(expr) {
				return (this.validate(expr) && (bone = this.getDependency(expr))) ? bone : expr;
			}, this);
		},

		/**
		*	Resolves and processes actions declared in module's ready section by parsing expression as methods
		*	and params to be passed to the result of those methods
		*	@private
		*	@method _resolve
		*	@param exprs {Array} action expressions
		*	@param params {Array} params
		*	@return Array
		**/
		_resolve: function(exprs, params) {
			return _.compact(_.map(exprs, function(expr) {
				if(this.validate(expr) && (info = this.getDependencyId(expr).split('.'))) {
					if(info.length > 1 && (bone = this._engine.getBone(info[0]))) {
						bone[info[1]].apply(bone, this._inject(_.flatten(params)));
						return expr;
					}
				}
			}, this));
		},

		/**
		*	Evaluates and process all actions inside the root spec and return them one by one.
		*	@public
		*	@method process
		*	@param actions {Array} array of actions declared in $ready annotation
		*	@return Boolean
		**/
		process: function(actions) {
			if(!actions || actions.length === 0) return [];
			return _.compact(_.map(actions, function(action) {
				if(!_.isObject(action) || action._$ready) return null;
				return (this._resolve(_.keys(action), _.values(action)) && (action._$ready = true));
			}, this));
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.ReadyProcessor}
		**/
		execute: function() {
			var actions = (!this._engine.ready()) ? this.process(this._engine.root.$ready) : [];
			this.trigger(ReadyProcessor.EVENTS.processed, { type: ReadyProcessor.NAME, actions: actions });
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'ReadyProcessor'

	}));

	return ReadyProcessor;

});

/**
*	@module com.spinal.ioc.plugins
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.0.1
*	@TODO:
*		- Improve logic here, there are a lot of queries that can be simplfied like,
*		  loops, look ups, make use of util/adt classes and general statements.
*		- Verification if a template package was already loaded in the html_load function.
**/
define('ioc/plugins/html',['ioc/engine',
		'util/string'], function(Engine, StringUtils) {

	/**
	*	HTML IoC Plugin
	*	Initial Implementation to manage templates loaded at runtime.
	*	Nothing amazing about the strategy choosen. This will stay as basic as possible for now.
	*	@namespace com.spinal.ioc.plugins
	*	@class com.spinal.ioc.plugins.HTMLPlugin
	*	@extends com.spinal.core.Spinal.SpinalClass
	*
	*	@requires com.spianl.ioc.Engine
	*	@requires com.spinal.util.StringUtils
	**/
	var HTMLPlugin = Spinal.namespace('com.spinal.ioc.plugins.HTMLPlugin', Spinal.SpinalClass.inherit({

		/**
		*	Engine reference
		*	@public
		*	@property _engine
		*	@type {com.spinal.ioc.Engine}
		**/
		_engine: null,

		/**
		*	Template Packages Config retrieve from spec
		*	@private
		*	@property packages
		*	@type Object
		**/
		_packages: null,

		/**
		*	Templates
		*	@private
		*	@property _tpls
		*	@type Object
		**/
		_tpls: {},

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param attrs {Object} attributes
		*	@param engine {com.spinal.ioc.Engine} engine reference
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		initialize: function(attrs, engine) {
			this._engine = engine;
			this._packages = (!_.isEmpty(attrs)) ? attrs : {};
			return this;
		},

		/**
		*	Query the list of packages using a query (dot notation) to get the template
		*	If pkg is passed, will be use to prefix the specific package.
		*	In each case, if doesn't match any results the method returns null
		*	@private
		*	@method _query
		*	@param query {String}
		*	@param core {Boolean} Flag that allow performing lookup on core templates
		*	@return Function
		**/
		_query: function(query, core) {
			return StringUtils.search(query, (core) ? Spinal.templates : this._tpls);
		},

		/**
		*	Perform a lazy loading once the IoC Context is initialized for those template packages
		*	flagged with the 'lazyloading' property set to true.
		*	@private
		*	@method _lazy
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		_lazy: function() {
			var tplNames = _.compact(_.map(this._packages, function(p, n) { return (p.lazyLoading) ? n : null; }));
			return this.html_load(tplNames);
		},

		/**
		*	Proxified Checks if a template package is already loaded
		*	@public
		*	@method html_loaded
		*	@param templatePackageName {String} template package name
		*	@return Boolean
		**/
		html_loaded: function(templatePackageName) {
			return (_.has(this._packages, templatePackageName) && !_.isUndefined(this._tpls[templatePackageName]));
		},

		/**
		*	Proxified Load Template module using requirejs strategy to be injected as part of
		*	the current context.
		*	@FIXME: Logic and Engine event triggering need to be improved.
		*	@public
		*	@method html_load
		*	@param tpl {String,Array} template name or list of template names
		*	@param [callback] {Function} callback function
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		html_load: function(tpl, callback) {
			if(!tpl) return this;
			if(_.isString(tpl) && tpl !== '') tpl = [tpl];
			var ename = Engine.EVENTS.plugin;
			var ps = _.compact(_.map(this._packages, function(p, n) { return (_.contains(tpl, n)) ? p.path : null; }));
			require(ps, _.bind(function() {
				_.extend(this._tpls, _.object(tpl, Array.prototype.slice.call(arguments)));
				if(callback && _.isFunction(callback)) callback();
				this._engine.trigger(Engine.EVENTS.plugin, ename, tpl);
			}, this));
			return this;
		},

		/**
		*	Proxified Template function that performs a look up over all the template packages
		*	using the route passed as parameter (in dot notation format) and pass the additional params
		*	to the existing compiled template function. If the template function is not found
		*	returns an empty string
		*	@public
		*	@method html_tpl
		*	@param route {String} route using dot notation format
		*	@param [params] {Object} parameters to pass to the template
		*	@return String
		**/
		html_tpl: function(route, params) {
			if(!route || route === '') return '';
			if(!params) params = {};
			var inCore = (route.indexOf('!') === -1),
				tpl = this._query(route.replace('!', '.'), inCore);
			if(tpl && _.isString(tpl)) tpl = _.template(unescape(tpl));
			return ((tpl && _.isFunction(tpl)) ? tpl(params) : '').replace(/\n/g, '').replace(/\t/g, ' ');
		},

		/**
		*	Plugin execution
		*	@public
		*	@chainable
		*	@method execute
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		execute: function() {
			this._engine.trigger(Engine.EVENTS.proxified, this, 'html_load', 'html_loaded', 'html_tpl');
			return this._lazy();
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'HTMLPlugin'

	}));

	return HTMLPlugin;

});

/**
*	@module com.spinal.ioc.plugins
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.0.1
**/
define('ioc/plugins/theme',['ioc/engine',
		'util/adt/collection'], function(Engine, Collection) {

	/**
	*	Theme IoC Plugin
	*	@namespace com.spinal.ioc.plugins
	*	@class com.spinal.ioc.plugins.ThemePlugin
	*	@extends com.spinal.core.Spinal.SpinalClass
	*
	*	@requires com.spinal.ioc.Engine
	*	@requires com.spinal.util.adt.Collection
	**/
	var ThemePlugin = Spinal.namespace('com.spinal.ioc.plugins.ThemePlugin', Spinal.SpinalClass.inherit({

		/**
		*	Skins
		*	@public
		*	@property themes
		*	@type Object
		**/
		themes: null,

		/**
		*	General Settings for Theme management
		*	@public
		*	@property _config
		*	@type Object
		**/
		_config: null,

		/**
		*	Engine reference
		*	@public
		*	@property _engine
		*	@type {com.spinal.ioc.Engine}
		**/
		_engine: null,

		/**
		*	Header HTML element
		*	@private
		*	@property _$header
		*	@type Object
		**/
		_$header: null,

		/**
		*	Link Template
		*	@private
		*	@property _link
		*	@type Function
		**/
		_link: _.template('<link rel="stylesheet" href="<%= href %>" theme="<%= theme %>" />'),

		/**
		*	Boostrap Files
		*	@private
		*	@property _bootstrap
		*	@type String
		**/
		_bootstrap: {
			core: 'bootstrap/css/bootstrap.min.css',
			theme: 'bootstrap/css/bootstrap-theme.min.css'
		},

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param setup {Object} setup
		*	@param engine {com.spinal.ioc.Engine} engine reference
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		initialize: function(setup, engine) {
			if(!setup || !setup.config || !setup.config.basePath) throw new PluginException('ConfigNotSpecified');
			this.themes = _.omit(setup, 'config');
			this._config = setup.config;
			this._engine = engine;
			this._$header = $('head');
			return this._useDefault();
		},

		/**
		*	Check if option to use Default Bootstrap Theme is set to true and will inject the css accordingly
		*	@private
		*	@method _useDefault
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		_useDefault: function() {
			if(this._config.bootstrap) {
				var links = this._link({ theme: 'bootstrap', href: this._resolveURI({ path: this._bootstrap.core }) }) +
					this._link({ theme: 'bootstrap-theme', href: this._resolveURI({ path: this._bootstrap.theme }) });
				this._$header.append(links);
			}
			return this;
		},

		/**
		*	Resolve Theme Path
		*	@private
		*	@method _resolveURI
		*	@param config {Object} theme config reference
		*	@return String
		**/
		_resolveURI: function(config) {
			if(config.url) return config.url;
			return (this._config.basePath + config.path);
		},

		/**
		*	Find a theme by name passed by parameter, it the theme is not found the function returns null.
		*	@public
		*	@method findTheme
		*	@param themeName {String} theme name
		*	@return Object
		**/
		findTheme: function(themeName) {
			var config = _.find(this.themes, function(theme, name) {
				return ((!themeName && theme._default && (themeName = name)) || (themeName === name));
			});
			return (config) ? { name: themeName, config: config } : this.theme_current();
		},

		/**
		*	Process Plugin implementation
		*	@public
		*	@method process
		*	@param themeName {String} Theme name
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		process: function() {
			var theme = this.theme_current();
			var rmvEval = 'link[theme!="'+ theme.name +'"][theme!="bootstrap"][theme!="bootstrap-theme"]';
			var $existing = this._$header.children(rmvEval);
			if($existing.length > 0) $existing.remove();
			this._$header.append(this._link({ theme: theme.name, href: this._resolveURI(theme.config) }));
			return this;
		},

		/**
		*	Retrieves the current theme
		*	@public
		*	@method current
		*	@return Object
		**/
		theme_current: function() {
			return this.theme;
		},

		/**
		*	Delegated Method to the context via engine to be able to change the current theme
		*	@public
		*	@chainable
		*	@method changeTheme
		*	@param [themeName] {String} theme name
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		theme_change: function(themeName) {
			this.theme = this.findTheme(themeName);
			return this.process();
		},

		/**
		*	Plugin execution
		*	@public
		*	@chainable
		*	@method execute
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		execute: function() {
			if(!_.isEmpty(this.themes)) {
				this.theme_change();
				this._engine.trigger(Engine.EVENTS.proxified, this, 'theme_change', 'theme_current');
			}
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'ThemePlugin'

	}));

	return ThemePlugin;

});

/**
*	SpinalJS | IOC Module Package
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('spinal-ioc',['ioc/context',
		'ioc/engine',
		'ioc/processor/bone',
		'ioc/processor/plugin',
		'ioc/processor/create',
		'ioc/processor/ready',
		'ioc/plugins/html',
		'ioc/plugins/theme'], function() { });


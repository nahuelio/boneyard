/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
		'ioc/processor/bone'], function(Context, BoneProcessor) {

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
		*	Supported Notation Regular Expression
		*	@public
		*	@property notationRE
		*	@type RegExp
		**/
		notationRE: new RegExp('\\' + Context.PREFIX + '(ready)$', 'i'),

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
		*	Validates if the current processor supports the notation passed as parameter
		*	@public
		*	@method _isModuleBoneReady
		*	@param bone {String} notation to be evaluated
		*	@return Boolean
		**/
		_isModuleBoneReady: function(bone) {
			var result = (this.ctx.query.isModule(bone) && this.ctx.query.isCreated(bone) && !this.ctx.query.isReady(bone));
			if(result) return !_.isUndefined(bone.$ready);
			return false;
		},

		/**
		*	Extract dependent bone id (if exists) from the String notation and return it as object
		*	with the following structure: { bone: [instance], op: [methodName|propertyName] }
		*	If no dependency is found in the notation, the method will return the instance reference to the current bone.
		*	If none of the rules applies, this method will return null.
		*	@public
		*	@method getDependency
		*	@param notation {String} bone dependency notation
		*	@param bone {Object} current module bone reference
		*	@return Object
		**/
		getDependency: function(notation, bone) {
			if(!notation || !bone || notation === '') return null;
			var pts = null, rBone = null, dep = ReadyProcessor.__super__.getDependency.apply(this, arguments);
			pts = (dep) ? dep.split('.') : [null, notation];
			if(dep && pts.length === 1) return null;
			if(dep && pts.length > 1) rBone = this.ctx.getBone(pts[0]);
			return _.extend({ op: pts[1] }, (rBone) ? { bone: rBone } : { bone: bone });
		},

		/**
		*	Process and resolves possible dependencies on params via setter injection.
		*	@FIXME: Improve this logic with notations (Not sure if it's worth it to use RegExp)
		*	It might affect performance, run some benchmarking to determine if indexOf will be faster.
 		*	@public
		*	@method processParams
		*	@param ps {Any} parameters passed via setter by a context spec directive
		*	@param mBone {Object} current module bone reference
		*	@return {Any}
		*/
		processParams: function(ps, mBone) {
			if(!ps) return null;
			if(!_.isArray(ps) || !_.isObject(ps)) return ps;
			for(var p in ps) {
				if(ps[p] && _.isString(ps[p]) &&
					(this.matchNotation(ps[p], ReadyProcessor.__super__.notationRE) || ps[p].indexOf('$this') !== 1)) {
						var depId = ReadyProcessor.__super__.getDependency(ps[p]);
						ps[p] = (depId) ? this.ctx.getBone(depId) : mBone;
				}
			}
			return ps;
		},

		/**
		*	Handler when a module $ready depends on a bone of type '$module' in order to execute the operation requested
		*	@public
		*	@method handleOperation
		*	@param bone {Object} current bone to evaluate
		*	@param id {String} current bone id
		*	@return Boolean
		**/
		process: function(bone, id) {
			if(!bone || !_.isObject(bone)) return false;
			for(var b in bone) {
				var mBone = this.ctx.getBone(id),
					d = this.getDependency(b, mBone),
					params = this.processParams(bone[b], mBone);
				if(!d || !d.bone[d.op]) continue; // FIXME: throw an exception maybe! ignore or a warning.
				(_.isFunction(d.bone[d.op])) ? d.bone[d.op].apply(d.bone, params) : (d.bone[d.op] = params);
			};
			return true;
		},

		/**
		*	Validates the notation and handles it accordingly to the processor.
		*	@public
		*	@method handleNotation
		*	@param bone {Object} current bone to evaluate
		*	@param id {Object} current bone id
		*	@param [parentBone] {Object} parent bone ref
		*	@return Boolean
		**/
		handleNotation: function(bone, id, parentBone) {
			var result = this._isModuleBoneReady(bone);
			if(result) {
				ReadyProcessor.__super__.execute.call(this, this.handleNotation, bone.$ready, id);
			} else if(parentBone && parentBone.id) {
				this.process(bone, parentBone.id);
			}
			return false;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@param [bone] {Object} Bone context in which the execution will be narrowed down
		*	@param [id] {Object} Bone Id of the context
		*	@return {com.spinal.ioc.processor.ReadyProcessor}
		**/
		execute: function(bone, id) {
			var result = ReadyProcessor.__super__.execute.call(this, this.handleNotation, bone, id);
			this.ctx.trigger(Context.EVENTS.ready, result);
			this.ctx.trigger(Context.EVENTS.processed, { type: ReadyProcessor.NAME });
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

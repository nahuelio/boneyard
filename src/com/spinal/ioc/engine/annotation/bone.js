/**
*	Checks if the bone defined was declared as a module.
*	@static
*	@method isModule
*	@param bone {Object} current bone to be evaluated
*	@return Boolean
**/
isModule: function(bone) {
	return _.defined(bone.$module);
},

/**
*	Checks if the bone was succesfully created
*	@static
*	@method isCreated
*	@param bone {Object} current bone to be evaluated
*	@return Boolean
**/
isCreated: function(bone) {
	return _.defined(bone._$created);
},

/**
*	Check if the bone is an instance of a Backbone class
*	@public
*	@method isNative
*	@param bone {Object} bone reference
*	@return Boolean
**/
isNative: function(bone) {
	if(!_.defined(bone)) return false;
	return (bone instanceof Backbone.Model ||
		bone instanceof Backbone.Collection ||
		bone instanceof Backbone.View ||
		bone instanceof Backbone.Router);
}

/**
*	FIXME: Move this guy to Bone annotation
*	Instanciate a bone in the root of the Context
*	@public
*	@method create
*	@param injector {com.spinal.ioc.helpers.Injector} injector reference
*	@return Object
**/
create: function(injector) {
	var bone = _.pick(injector.bone, 'id', '$module', '$params');
	return (this.specs.getBone(bone.id)._$created = this.factory.create(bone.$module, bone.$params));
}

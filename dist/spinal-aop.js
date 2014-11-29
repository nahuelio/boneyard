//	SpinalJS Aop@0.0.1 (c) 2014 Patricio Ferreira <3dimentionar@gmail.com>, 3dimention.com
//	SpinalJS may be freely distributed under the MIT license.
//	For all details and documentation: http://3dimention.github.io/spinal
/**
*	@module com.spinal.aop
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('aop/interceptor',['core/spinal'], function(Spinal) {

	/**
	*	Interceptor Class
	*	@namespace com.spinal.aop
	*	@class com.spinal.aop.Interceptor
	*	@extends com.spinal.core.SpinalClass
	**/
	var Interceptor = Spinal.namespace('com.spinal.aop.Interceptor', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.aop.Interceptor}
		**/
		initialize: function() {
			Interceptor.__super__.initialize.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Interceptor'

	}));

	return Interceptor;

});

/**
*	@module com.spinal.aop
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('aop/advice',['aop/interceptor'], function(Interceptor) {

	/**
	*	Advice Class
	*	@namespace com.spinal.aop
	*	@class com.spinal.aop.Advice
	*	@extends com.spinal.aop.Interceptor
	*
	*	@requires com.spinal.aop.Interceptor
	**/
	var Advice = Spinal.namespace('com.spinal.aop.Advice', Interceptor.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.aop.Advice}
		**/
		initialize: function() {
			Advice.__super__.initialize.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Advice'

	}));

	return Advice;

});

/**
*	@module com.spinal.aop
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('aop/advisor',['aop/interceptor'], function(Interceptor) {

	/**
	*	Advisor Class
	*	@namespace com.spinal.aop
	*	@class com.spinal.aop.Advisor
	*	@extends com.spinal.aop.Interceptor
	*
	*	@requires com.spinal.aop.Interceptor
	**/
	var Advisor = Spinal.namespace('com.spinal.aop.Advisor', Interceptor.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.aop.Advisor}
		**/
		initialize: function() {
			Advisor.__super__.initialize.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Advisor'

	}));

	return Advisor;

});

/**
*	@module com.spinal.aop
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('aop/pointcut',['aop/interceptor'], function(Interceptor) {

	/**
	*	PointCut Class
	*	@namespace com.spinal.aop
	*	@class com.spinal.aop.PointCut
	*	@extends com.spinal.aop.Interceptor
	*
	*	@requires com.spinal.aop.Interceptor
	**/
	var PointCut = Spinal.namespace('com.spinal.aop.PointCut', Interceptor.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.aop.PointCut}
		**/
		initialize: function() {
			PointCut.__super__.initialize.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'PointCut'

	}));

	return PointCut;

});

/**
*	SpinalJS | AOP Module Package
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('spinal-aop',['aop/interceptor',
		'aop/advice',
		'aop/advisor',
		'aop/pointcut'], function() { });


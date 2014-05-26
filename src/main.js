/**
*	SpinalJS Main File
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
requirejs.config({

	baseURL: '/',

	paths: {
		'libs': 'libs',
		'core': 'com/spinal/core',
		'mvc': 'com/spinal/mvc',
		'ui': 'com/spinal/ui',
		'util': 'com/spinal/util'
	},

	shim: {
		'libs/bootstrap': ['libs/jquery', 'libs/modernizr'],
		'libs/underscore': ['libs/bootstrap'],
		'libs/backbone': ['libs/underscore']
	}

});

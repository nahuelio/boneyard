/**
*	SpinalJS Main File
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
requirejs.config({

	baseURL: '/',

	paths: {
		'libs': 'libs',
		'text': 'libs/text',
		'core': 'com/spinal/core',
		'ioc': 'com/spinal/ioc',
		'ui': 'com/spinal/ui',
		'util': 'com/spinal/util'
	},

	shim: {
		'libs/bootstrap': ['libs/jquery'],
		'libs/underscore': ['libs/bootstrap'],
		'libs/backbone': ['libs/underscore']
	}

});

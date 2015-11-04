/**
*	Boneyard Main File
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
requirejs.config({

	baseURL: '/',

	paths: {
		'libs': 'libs',
		'text': 'libs/text',
		'core': 'com/boneyard/core',
		'ioc': 'com/boneyard/ioc',
		'ui': 'com/boneyard/ui',
		'util': 'com/boneyard/util'
	},

	shim: {
		'libs/bootstrap': ['libs/jquery'],
		'libs/underscore': ['libs/bootstrap'],
		'libs/backbone': ['libs/underscore']
	}

});

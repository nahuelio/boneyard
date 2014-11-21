/**
*	Spinal Templates (For Unit Testing purposes)
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.0.1
**/
define(['underscore'], function() {

	return {

		head: {
			script: _.template('<script type="{{type}}" src="{{src}}"></script>'),
			theme: _.template('<link rel="stylesheet" href="{{href}}" theme="{{theme}}" />'),
			css: _.template('<link rel="stylesheet" href="{{href}}" />')
		}

	};

});

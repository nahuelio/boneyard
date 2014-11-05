/**
*	UI Templates (For Unit Testing purposes)
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.0.1
**/
define(['underscore'], function() {

	return {

		ui: {

			div: _.template('<div id="{{id}}" class="{{cls}}"></div>'),
			button: _.template('<button id="{{id}}">{{label}}</button>')

		}

	};

});

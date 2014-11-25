/**
*	Other Templates (For Unit Testing purposes)
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.0.1
**/
define(['underscore'], function() {

	return {

		header: {

		},

		content: {

			other: _.template('<p class="{{cls}}"></p>'),
			rule: _.template('<hr />')

		},

		footer: {

		}

	};

});

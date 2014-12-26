/**
*	Other Templates (For Unit Testing purposes)
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.0.1
**/
define(['core/spinal'], function(Spinal) {

	return Spinal.namespace('html.other', {

		header: {

		},

		content: {

			other: '<p class="<%= cls %>"></p>',
			rule: '<hr />'

		},

		footer: {

		}

	});

});

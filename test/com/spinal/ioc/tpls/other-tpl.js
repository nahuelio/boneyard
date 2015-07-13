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

			other: '<p class="<%= (obj.cls) ? obj.cls : "default" %>"></p>',
			rule: '<hr />'

		},

		footer: {

		}

	});

});

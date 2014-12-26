/**
*	My Templates (For Unit Testing purposes)
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.0.1
**/
define(['core/spinal'], function(Spinal) {

	return Spinal.namespace('html.my', {

		header: {

		},

		content: {

			menu: '<div class="<%= cls %>"></div>'

		},

		footer: {

		}

	});

});

/**
*	Main Composer Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		theme: 'standard',

		global: {

			$module: {
				class: 'ui/container',
				params: { el: 'div.global', css: '$bone!theme' }
			}

		},

		custom: {

			$module: {
				class: 'ui/mycustomcomponent',
				params: { el: 'div.global', css: '$bone!theme' }
			}

		}

	};

});
